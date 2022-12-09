import { DMMF } from "@prisma/generator-helper";
import ts from "typescript";
import { template } from "talt";
import { camelize, byName } from "../helpers";
import { createFieldDefinitions } from "../relations";

import { ast } from "./ast-tools/astShorthand";
import { createJSONLiteral } from "./ast-tools/createJSONLiteral";
import { wrapWithTSDoc, insertLeadingBreakMarker } from "./ast-tools/comment";

export function findPrsimaCreateInputTypeFromModelName(document: DMMF.Document, modelName: string) {
  const search = `${modelName}CreateInput`;
  const inputType = document.schema.inputObjectTypes.prisma.find(x => x.name === search);
  if (!inputType) throw new Error(`Not found ${search}`);
  return inputType;
}

export function getIdFieldNames(model: DMMF.Model) {
  if (model.primaryKey) {
    return model.primaryKey.fields;
  }
  const idLike = model.fields.find(f => f.isId || f.isUnique);
  if (idLike) {
    return [idLike.name];
  }
  if (model.uniqueFields.length) {
    return model.uniqueFields[0];
  }
  throw new Error(`Model ${model.name} does not have @id nor @@id nor @@unique.`);
}

function filterRequiredFields(inputType: DMMF.InputType) {
  return inputType.fields.filter(field => field.isRequired);
}

function isScalarOrEnumField(field: DMMF.SchemaArg) {
  return field.inputTypes.every(cit => cit.location === "enumTypes" || cit.location === "scalar");
}

function isInputObjectTypeField(field: DMMF.SchemaArg) {
  return field.inputTypes.length === 1 && field.inputTypes.every(cit => cit.location === "inputObjectTypes");
}

function filterRequiredScalarOrEnumFields(inputType: DMMF.InputType) {
  return filterRequiredFields(inputType)
    .filter(inputType => !inputType.isNullable)
    .filter(isScalarOrEnumField);
}

function filterRequiredInputObjectTypeField(inputType: DMMF.InputType) {
  return filterRequiredFields(inputType).filter(isInputObjectTypeField);
}

function filterBelongsToField(model: DMMF.Model, inputType: DMMF.InputType) {
  return inputType.fields
    .filter(isInputObjectTypeField)
    .filter(field => model.fields.find(byName(field))?.isList === false);
}

function filterEnumFields(inputType: DMMF.InputType) {
  return inputType.fields.filter(
    field =>
      field.inputTypes.length > 0 && field.inputTypes.every(childInputType => childInputType.location === "enumTypes"),
  );
}

function extractFirstEnumValue(enums: DMMF.SchemaEnum[], field: DMMF.SchemaArg) {
  const typeName = field.inputTypes[0].type;
  const found = enums.find(byName(typeName));
  if (!found) {
    throw new Error(`Not found enum ${typeName}`);
  }
  return found.values[0];
}

export const header = (prismaClientModuleSpecifier: string) =>
  template.sourceFile`
    import { Prisma } from ${() => ast.stringLiteral(prismaClientModuleSpecifier)};
    import type { PrismaClient } from ${() => ast.stringLiteral(prismaClientModuleSpecifier)};
    import {
      getClient,
      ModelWithFields,
      createScreener,
      scalarFieldValueGenerator,
      Resolver,
      normalizeResolver,
      normalizeList,
      getSequenceCounter,
    } from "@quramy/prisma-fabbrica/lib/internal";
    export { initialize, resetSequence } from "@quramy/prisma-fabbrica/lib/internal";
  `();

export const buildDataOptions = () =>
  template.statement<ts.TypeAliasDeclaration>`
    type BuildDataOptions = {
      readonly seq: number;
    };
  `();

export const importStatement = (specifier: string, prismaClientModuleSpecifier: string) =>
  template.statement<ts.ImportDeclaration>`
    import type { ${() => ast.identifier(specifier)} } from ${() => ast.stringLiteral(prismaClientModuleSpecifier)};
  `();

export const modelFieldDefinitions = (models: DMMF.Model[]) =>
  template.statement`
    const modelFieldDefinitions: ModelWithFields[] = ${() => createJSONLiteral(createFieldDefinitions(models))};
  `();

export const scalarFieldType = (
  model: DMMF.Model,
  fieldName: string,
  inputType: DMMF.SchemaArgInputType,
): ts.TypeNode => {
  if (inputType.location !== "scalar") {
    throw new Error("Invalid call. This function is allowed for only scalar field.");
  }
  switch (inputType.type) {
    case "Null":
      return ast.literalTypeNode(ast.null());
    case "Boolean":
      return ast.keywordTypeNode(ts.SyntaxKind.BooleanKeyword);
    case "String":
      return ast.keywordTypeNode(ts.SyntaxKind.StringKeyword);
    case "Int":
    case "Float":
      return ast.keywordTypeNode(ts.SyntaxKind.NumberKeyword);
    case "BigInt":
      return template.typeNode`bigint | number`();
    case "Decimal":
      return template.typeNode`Prisma.Decimal | Prisma.DecimalJsLike | string`();
    case "DateTime":
      return template.typeNode`Date`();
    case "Bytes":
      return template.typeNode`Buffer`();
    case "Json":
      return template.typeNode`Prisma.InputJsonValue`();
    default:
      throw new Error(`Unknown scalar type "${inputType.type}" for ${model.name}.${fieldName} .`);
  }
};

export const argInputType = (model: DMMF.Model, fieldName: string, inputType: DMMF.SchemaArgInputType): ts.TypeNode => {
  const fieldType = () => {
    if (inputType.location === "scalar") {
      return scalarFieldType(model, fieldName, inputType);
    } else if (inputType.location === "enumTypes") {
      return inputType.namespace === "model"
        ? ast.typeReferenceNode(ast.identifier(inputType.type as string))
        : template.typeNode`Prisma.${() => ast.identifier(inputType.type as string)}`();
    } else if (inputType.location === "outputObjectTypes" || inputType.location === "inputObjectTypes") {
      return ast.typeReferenceNode(
        template.expression<ts.Identifier>`Prisma.${() => ast.identifier(inputType.type as string)}`(),
      );
    } else {
      // FIXME inputType.location === "fieldRefTypes"
      return ast.keywordTypeNode(ts.SyntaxKind.UnknownKeyword);
    }
  };
  return inputType.isList
    ? ast.typeReferenceNode(template.expression<ts.Identifier>`Prisma.Enumerable<${fieldType}>`())
    : fieldType();
};

export const modelScalarOrEnumFields = (model: DMMF.Model, inputType: DMMF.InputType) =>
  template.statement<ts.TypeAliasDeclaration>`
    type MODEL_SCALAR_OR_ENUM_FIELDS = ${() =>
      ast.typeLiteralNode(
        filterRequiredScalarOrEnumFields(inputType).map(field =>
          ast.propertySignature(
            undefined,
            field.name,
            undefined,
            ast.unionTypeNode(field.inputTypes.map(childInputType => argInputType(model, field.name, childInputType))),
          ),
        ),
      )}
  `({
    MODEL_SCALAR_OR_ENUM_FIELDS: ast.identifier(`${model.name}ScalarOrEnumFields`),
  });

export const modelBelongsToRelationFactory = (fieldType: DMMF.SchemaArg, model: DMMF.Model) => {
  const targetModel = model.fields.find(byName(fieldType))!;
  return template.statement<ts.TypeAliasDeclaration>`
    type ${() => ast.identifier(`${model.name}${fieldType.name}Factory`)} = {
      _factoryFor: ${() => ast.literalTypeNode(ast.stringLiteral(targetModel.type))};
      build: () => PromiseLike<Prisma.${() => ast.identifier(fieldType.inputTypes[0].type as string)}["create"]>;
    };
  `();
};

export const modelFactoryDefineInput = (model: DMMF.Model, inputType: DMMF.InputType) =>
  template.statement<ts.TypeAliasDeclaration>`
    type MODEL_FACTORY_DEFINE_INPUT = ${() =>
      ast.typeLiteralNode(
        inputType.fields.map(field =>
          ast.propertySignature(
            undefined,
            field.name,
            !field.isRequired || isScalarOrEnumField(field) ? ast.token(ts.SyntaxKind.QuestionToken) : undefined,
            ast.unionTypeNode([
              ...((field.isRequired || model.fields.find(byName(field))!.isList === false) &&
              isInputObjectTypeField(field)
                ? [ast.typeReferenceNode(ast.identifier(`${model.name}${field.name}Factory`))]
                : []),
              ...field.inputTypes.map(childInputType => argInputType(model, field.name, childInputType)),
            ]),
          ),
        ),
      )};
  `({
    MODEL_FACTORY_DEFINE_INPUT: ast.identifier(`${model.name}FactoryDefineInput`),
  });

export const modelFactoryDefineOptions = (modelName: string, isOpionalDefaultData: boolean) => {
  const compiled = isOpionalDefaultData
    ? template.statement<ts.TypeAliasDeclaration>`
        type MODEL_FACTORY_DEFINE_OPTIONS = {
          defaultData?: Resolver<MODEL_FACTORY_DEFINE_INPUT, BuildDataOptions>;
        };
      `
    : template.statement<ts.TypeAliasDeclaration>`
        type MODEL_FACTORY_DEFINE_OPTIONS = {
          defaultData: Resolver<MODEL_FACTORY_DEFINE_INPUT, BuildDataOptions>;
        };
      `;
  return compiled({
    MODEL_FACTORY_DEFINE_OPTIONS: ast.identifier(`${modelName}FactoryDefineOptions`),
    MODEL_FACTORY_DEFINE_INPUT: ast.identifier(`${modelName}FactoryDefineInput`),
  });
};

export const modelFactoryInterface = (model: DMMF.Model) =>
  template.statement`
    interface MODEL_FACTORY_INTERFACE {
      readonly _factoryFor: ${() => ast.literalTypeNode(ast.stringLiteral(model.name))}
      build(inputData?: Partial<Prisma.MODEL_CREATE_INPUT>): PromiseLike<Prisma.MODEL_CREATE_INPUT>
      buildCreateInput(inputData?: Partial<Prisma.MODEL_CREATE_INPUT>): PromiseLike<Prisma.MODEL_CREATE_INPUT>
      buildList(inputData: number | readonly Partial<Prisma.MODEL_CREATE_INPUT>[]): PromiseLike<Prisma.MODEL_CREATE_INPUT[]>
      pickForConnect(inputData: MODEL_TYPE): Pick<MODEL_TYPE, MODEL_ID_COLS>
      create(inputData?: Partial<Prisma.MODEL_CREATE_INPUT>): PromiseLike<MODEL_TYPE>
      createList(inputData: number | readonly Partial<Prisma.MODEL_CREATE_INPUT>[]): PromiseLike<MODEL_TYPE[]>
      createForConnect(inputData?: Partial<Prisma.MODEL_CREATE_INPUT>): PromiseLike<Pick<MODEL_TYPE, MODEL_ID_COLS>>
    }
  `({
    MODEL_TYPE: ast.identifier(model.name),
    MODEL_FACTORY_INTERFACE: ast.identifier(`${model.name}FactoryInterface`),
    MODEL_CREATE_INPUT: ast.identifier(`${model.name}CreateInput`),
    MODEL_ID_COLS: ast.unionTypeNode(
      getIdFieldNames(model).map(fieldName => ast.literalTypeNode(ast.stringLiteral(fieldName))),
    ),
  });

export const isModelAssociationFactory = (fieldType: DMMF.SchemaArg, model: DMMF.Model) => {
  const targetModel = model.fields.find(byName(fieldType))!;
  return template.statement<ts.FunctionDeclaration>`
    function ${() => ast.identifier(`is${model.name}${fieldType.name}Factory`)}(
      x: MODEL_BELONGS_TO_RELATION_FACTORY | ${() =>
        argInputType(model, fieldType.name, fieldType.inputTypes[0])} | undefined
    ): x is MODEL_BELONGS_TO_RELATION_FACTORY {
      return (x as any)?._factoryFor === ${() => ast.stringLiteral(targetModel.type)};
    }
  `({
    MODEL_BELONGS_TO_RELATION_FACTORY: ast.typeReferenceNode(`${model.name}${fieldType.name}Factory`),
  });
};

export const autoGenerateModelScalarsOrEnumsFieldArgs = (
  model: DMMF.Model,
  field: DMMF.SchemaArg,
  enums: DMMF.SchemaEnum[],
) =>
  // Note: In Json sclar filed, inputTypes[0].location is not scalar but enumType
  field.inputTypes[field.inputTypes.length - 1].location === "scalar"
    ? template.expression`
        scalarFieldValueGenerator.SCALAR_TYPE({ modelName: MODEL_NAME, fieldName: FIELD_NAME, isId: IS_ID, isUnique: IS_UNIQUE, seq })
      `({
        SCALAR_TYPE: ast.identifier(field.inputTypes[field.inputTypes.length - 1].type as string),
        MODEL_NAME: ast.stringLiteral(model.name),
        FIELD_NAME: ast.stringLiteral(field.name),
        IS_ID:
          model.fields.find(byName(field))!.isId || model.primaryKey?.fields.includes(field.name)
            ? ast.true()
            : ast.false(),
        IS_UNIQUE:
          model.fields.find(byName(field))!.isUnique || model.uniqueFields.flat().includes(field.name)
            ? ast.true()
            : ast.false(),
      })
    : ast.stringLiteral(extractFirstEnumValue(enums, field));

export const autoGenerateModelScalarsOrEnums = (
  model: DMMF.Model,
  inputType: DMMF.InputType,
  enums: DMMF.SchemaEnum[],
) =>
  template.statement<ts.FunctionDeclaration>`
    function AUTO_GENERATE_MODEL_SCALARS_OR_ENUMS({ seq }: { readonly seq: number }): MODEL_SCALAR_OR_ENUM_FIELDS {
      return ${() =>
        ast.objectLiteralExpression(
          filterRequiredScalarOrEnumFields(inputType).map(field =>
            ast.propertyAssignment(field.name, autoGenerateModelScalarsOrEnumsFieldArgs(model, field, enums)),
          ),
          true,
        )};
    }
  `({
    AUTO_GENERATE_MODEL_SCALARS_OR_ENUMS: ast.identifier(`autoGenerate${model.name}ScalarsOrEnums`),
    MODEL_SCALAR_OR_ENUM_FIELDS: ast.identifier(`${model.name}ScalarOrEnumFields`),
  });

export const defineModelFactoryInternal = (model: DMMF.Model, inputType: DMMF.InputType) =>
  template.statement<ts.FunctionDeclaration>`
    function DEFINE_MODEL_FACTORY_INTERNAL({
      defaultData: defaultDataResolver
    }: MODEL_FACTORY_DEFINE_OPTIONS): MODEL_FACTORY_INTERFACE {

      const seqKey = {};
      const getSeq = () => getSequenceCounter(seqKey);
      const screen = createScreener(${() => ast.stringLiteral(model.name)}, modelFieldDefinitions);

      const build = async (
        inputData: Partial<Prisma.MODEL_CREATE_INPUT> = {}
      ) => {
        const seq = getSeq();
        const requiredScalarData = AUTO_GENERATE_MODEL_SCALARS_OR_ENUMS({ seq })
        const resolveValue = normalizeResolver<MODEL_FACTORY_DEFINE_INPUT, BuildDataOptions>(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
        const defaultAssociations = ${() =>
          ast.objectLiteralExpression(
            filterBelongsToField(model, inputType).map(field =>
              ast.propertyAssignment(
                field.name,
                template.expression`
                  IS_MODEL_BELONGS_TO_RELATION_FACTORY(defaultData.FIELD_NAME) ? {
                    create: await defaultData.FIELD_NAME.build()
                  } : defaultData.FIELD_NAME
                `({
                  IS_MODEL_BELONGS_TO_RELATION_FACTORY: ast.identifier(`is${model.name}${field.name}Factory`),
                  FIELD_NAME: ast.identifier(field.name),
                }),
              ),
            ),
            true,
          )};
        const data: Prisma.MODEL_CREATE_INPUT = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData};
        return data;
      };

      const buildList = (
        inputData: number | readonly Partial<Prisma.MODEL_CREATE_INPUT>[]
      ) => Promise.all(normalizeList(inputData).map(data => build(data)));

      const pickForConnect = (inputData: ${() => ast.typeReferenceNode(model.name)}) => (
        ${() =>
          ast.objectLiteralExpression(
            getIdFieldNames(model).map(fieldName =>
              ast.propertyAssignment(fieldName, template.expression`inputData.${() => ast.identifier(fieldName)}`()),
            ),
            true,
          )}
      );

      const create = async (
        inputData: Partial<Prisma.MODEL_CREATE_INPUT> = {}
      ) => {
        const data = await build(inputData).then(screen);
        return await getClient<PrismaClient>().MODEL_KEY.create({ data });
      };

      const createList = (
        inputData: number | readonly Partial<Prisma.MODEL_CREATE_INPUT>[]
      ) => Promise.all(normalizeList(inputData).map(data => create(data)));

      const createForConnect = (inputData: Partial<Prisma.MODEL_CREATE_INPUT> = {}) => create(inputData).then(pickForConnect);

      return {
        _factoryFor: ${() => ast.stringLiteral(model.name)} as const,
        build,
        buildList,
        buildCreateInput: build,
        pickForConnect,
        create,
        createList,
        createForConnect,
      };
    }
  `({
    MODEL_KEY: ast.identifier(camelize(model.name)),
    DEFINE_MODEL_FACTORY_INTERNAL: ast.identifier(`define${model.name}FactoryInternal`),
    MODEL_FACTORY_INTERFACE: ast.identifier(`${model.name}FactoryInterface`),
    MODEL_FACTORY_DEFINE_INPUT: ast.identifier(`${model.name}FactoryDefineInput`),
    MODEL_FACTORY_DEFINE_OPTIONS: ast.identifier(`${model.name}FactoryDefineOptions`),
    MODEL_CREATE_INPUT: ast.identifier(`${model.name}CreateInput`),
    AUTO_GENERATE_MODEL_SCALARS_OR_ENUMS: ast.identifier(`autoGenerate${model.name}ScalarsOrEnums`),
  });

export const defineModelFactory = (model: DMMF.Model, inputType: DMMF.InputType) => {
  const compiled = filterRequiredInputObjectTypeField(inputType).length
    ? template.statement<ts.FunctionDeclaration>`
        export function DEFINE_MODEL_FACTORY(options: MODEL_FACTORY_DEFINE_OPTIONS): MODEL_FACTORY_INTERFACE {
          return DEFINE_MODEL_FACTORY_INTERNAL(options);
        }
      `
    : template.statement<ts.FunctionDeclaration>`
        export function DEFINE_MODEL_FACTORY(options: MODEL_FACTORY_DEFINE_OPTIONS = {}): MODEL_FACTORY_INTERFACE {
          return DEFINE_MODEL_FACTORY_INTERNAL(options);
        }
      `;

  const tsDoc = `
Define factory for {@link ${model.name}} model.

@param options
@returns factory {@link ${model.name}FactoryInterface}
  `;
  return wrapWithTSDoc(
    tsDoc,
    compiled({
      DEFINE_MODEL_FACTORY: ast.identifier(`define${model.name}Factory`),
      DEFINE_MODEL_FACTORY_INTERNAL: ast.identifier(`define${model.name}FactoryInternal`),
      MODEL_FACTORY_DEFINE_OPTIONS: ast.identifier(`${model.name}FactoryDefineOptions`),
      MODEL_FACTORY_INTERFACE: ast.identifier(`${model.name}FactoryInterface`),
    }),
  );
};

export function getSourceFile({
  document,
  prismaClientModuleSpecifier = "@prisma/client",
}: {
  document: DMMF.Document;
  prismaClientModuleSpecifier?: string;
}) {
  const modelEnums = [
    ...new Set(
      document.schema.inputObjectTypes.prisma
        .filter(iOT => iOT.name.endsWith("CreateInput"))
        .flatMap(filterEnumFields)
        .flatMap(field =>
          field.inputTypes
            .filter(inputType => inputType.namespace === "model")
            .map(inputType => inputType.type as string),
        ),
    ),
  ];
  const modelNames = document.datamodel.models.map(m => m.name);
  const statements = [
    ...modelNames.map(modelName => importStatement(modelName, prismaClientModuleSpecifier)),
    ...modelEnums.map(enumName => importStatement(enumName, prismaClientModuleSpecifier)),
    ...header(prismaClientModuleSpecifier).statements,
    insertLeadingBreakMarker(buildDataOptions()),
    insertLeadingBreakMarker(modelFieldDefinitions(document.datamodel.models)),
    ...document.datamodel.models
      .map(model => ({ model, createInputType: findPrsimaCreateInputTypeFromModelName(document, model.name) }))
      .flatMap(({ model, createInputType }) => [
        modelScalarOrEnumFields(model, createInputType),
        ...filterBelongsToField(model, createInputType).map(fieldType =>
          modelBelongsToRelationFactory(fieldType, model),
        ),
        modelFactoryDefineInput(model, createInputType),
        modelFactoryDefineOptions(model.name, filterRequiredInputObjectTypeField(createInputType).length === 0),
        ...filterBelongsToField(model, createInputType).map(fieldType => isModelAssociationFactory(fieldType, model)),
        modelFactoryInterface(model),
        autoGenerateModelScalarsOrEnums(model, createInputType, document.schema.enumTypes.model ?? []),
        defineModelFactoryInternal(model, createInputType),
        defineModelFactory(model, createInputType),
      ])
      .map(insertLeadingBreakMarker),
  ];

  return ast.updateSourceFile(template.sourceFile("")(), statements);
}
