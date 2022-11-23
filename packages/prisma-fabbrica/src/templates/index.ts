import { DMMF } from "@prisma/generator-helper";
import ts from "typescript";
import { template } from "talt";

type StripCreate<T extends string> = T extends `create${infer S}` ? Uncapitalize<S> : T;

function camelize(pascal: string) {
  return pascal[0].toLowerCase() + pascal.slice(1);
}

function pascalize(camel: string) {
  return camel[0].toUpperCase() + camel.slice(1);
}

const ast = new Proxy(ts.factory, {
  get(target: any, n) {
    const name = n as string;
    if (name.startsWith("update")) return target[name];
    return target[`create${pascalize(name)}`];
  },
}) as unknown as {
  [K in keyof ts.NodeFactory as StripCreate<K>]: ts.NodeFactory[K];
};

export function findPrsimaCreateInputTypeFromModelName(document: DMMF.Document, modelName: string) {
  const search = `${modelName}CreateInput`;
  const inputType = document.schema.inputObjectTypes.prisma.find(x => x.name === search);
  if (!inputType) throw new Error(`Not found ${search}`);
  return inputType;
}

function filterRequiredFields(inputType: DMMF.InputType) {
  return inputType.fields.filter(field => field.isRequired);
}

function isScalarOrEnumField(field: DMMF.SchemaArg) {
  return (
    field.inputTypes.length === 1 &&
    field.inputTypes.every(cit => cit.location === "enumTypes" || cit.location === "scalar")
  );
}

function isInputObjectTypeField(field: DMMF.SchemaArg) {
  return field.inputTypes.length === 1 && field.inputTypes.every(cit => cit.location === "inputObjectTypes");
}

function filterRequiredScalarOrEnumFields(inputType: DMMF.InputType) {
  return filterRequiredFields(inputType).filter(isScalarOrEnumField);
}

function filterRequiredInputObjectTypeField(inputType: DMMF.InputType) {
  return filterRequiredFields(inputType).filter(isInputObjectTypeField);
}

function filterEnumFields(inputType: DMMF.InputType) {
  return inputType.fields.filter(
    field =>
      field.inputTypes.length > 0 && field.inputTypes.every(childInputType => childInputType.location === "enumTypes"),
  );
}

function extractFirstEnumValue(enums: DMMF.SchemaEnum[], field: DMMF.SchemaArg) {
  const typeName = field.inputTypes[0].type;
  const found = enums.find(e => e.name === field.inputTypes[0].type);
  if (!found) {
    throw new Error(`Not found enum ${typeName}`);
  }
  return found.values[0];
}

export const header = (prismaClientModuleSpecifier: string) =>
  template.sourceFile`
    import { Prisma } from ${() => ast.stringLiteral(prismaClientModuleSpecifier)};
    import type { PrismaClient } from ${() => ast.stringLiteral(prismaClientModuleSpecifier)};
    import { getClient } from "@quramy/prisma-fabbrica/lib/clientHolder";
    import scalarFieldValueGenerator from "@quramy/prisma-fabbrica/lib/scalar/gen";
    import { Resolver, resolveValue } from "@quramy/prisma-fabbrica/lib/helpers";
    export { initialize } from "@quramy/prisma-fabbrica";
  `();

export const importStatement = (specifier: string, prismaClientModuleSpecifier: string) =>
  template.statement`
    import { ${() => ast.identifier(specifier)} } from ${() => ast.stringLiteral(prismaClientModuleSpecifier)};
  `();

export const scalarFieldType = (
  modelName: string,
  fieldName: string,
  inputType: DMMF.SchemaArgInputType,
): ts.TypeNode => {
  if (inputType.location !== "scalar") {
    throw new Error("Invalid call. This function is allowed for only scalar field.");
  }
  switch (inputType.type) {
    case "Boolean":
      return ast.keywordTypeNode(ts.SyntaxKind.BooleanKeyword);
    case "String":
      return ast.keywordTypeNode(ts.SyntaxKind.StringKeyword);
    case "Int":
    case "Float":
      return ast.keywordTypeNode(ts.SyntaxKind.NumberKeyword);
    case "BigInt":
      return ast.keywordTypeNode(ts.SyntaxKind.BigIntKeyword);
    case "Decimal":
      return template.typeNode`Prisma.Decimal`();
    case "DateTime":
      return template.typeNode`Date`();
    case "Bytes":
      return template.typeNode`Buffer`();
    case "JSON":
      // FIXME Is the folloing type right?
      // return template.typeNode`Prisma.Json`();
      return ast.keywordTypeNode(ts.SyntaxKind.AnyKeyword);
    default:
      throw new Error(`Unknown scalar type "${inputType.type}" for ${modelName}.${fieldName} .`);
  }
};

export const argInputType = (modelName: string, fieldName: string, inputType: DMMF.SchemaArgInputType): ts.TypeNode => {
  const fieldType = () => {
    if (inputType.location === "scalar") {
      return scalarFieldType(modelName, fieldName, inputType);
    } else if (inputType.location === "enumTypes") {
      return ast.typeReferenceNode(ast.identifier(inputType.type as string));
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

export const modelScalarOrEnumFields = (modelName: string, inputType: DMMF.InputType) =>
  template.statement<ts.TypeAliasDeclaration>`
    type MODEL_SCALAR_OR_ENUM_FIELDS = ${() =>
      ast.typeLiteralNode(
        filterRequiredScalarOrEnumFields(inputType).map(field =>
          ast.propertySignature(
            undefined,
            field.name,
            undefined,
            ast.unionTypeNode(
              field.inputTypes.map(childInputType => argInputType(modelName, field.name, childInputType)),
            ),
          ),
        ),
      )}
  `({
    MODEL_SCALAR_OR_ENUM_FIELDS: ast.identifier(`${modelName}ScalarOrEnumFields`),
  });

export const modelBelongsToRelationFactory = (fieldType: DMMF.SchemaArg, model: DMMF.Model) => {
  const targetModel = model.fields.find(f => f.name === fieldType.name)!;
  return template.statement<ts.TypeAliasDeclaration>`
    type ${() => ast.identifier(`${model.name}${fieldType.name}Factory`)} = {
      _factoryFor: ${() => ast.literalTypeNode(ast.stringLiteral(targetModel.type))};
      buildCreateInput: () => PromiseLike<Prisma.${() =>
        ast.identifier(fieldType.inputTypes[0].type as string)}["create"]>;
    };
  `();
};

export const modelFactoryDefineInput = (modelName: string, inputType: DMMF.InputType) =>
  template.statement<ts.TypeAliasDeclaration>`
    type MODEL_FACTORY_DEFINE_INPUT = ${() =>
      ast.typeLiteralNode(
        inputType.fields.map(field =>
          ast.propertySignature(
            undefined,
            field.name,
            !field.isRequired || isScalarOrEnumField(field) ? ast.token(ts.SyntaxKind.QuestionToken) : undefined,
            ast.unionTypeNode([
              ...(field.isRequired && isInputObjectTypeField(field)
                ? [ast.typeReferenceNode(ast.identifier(`${modelName}${field.name}Factory`))]
                : []),
              ...field.inputTypes.map(childInputType => argInputType(modelName, field.name, childInputType)),
            ]),
          ),
        ),
      )};
  `({
    MODEL_FACTORY_DEFINE_INPUT: ast.identifier(`${modelName}FactoryDefineInput`),
  });

export const modelFactoryDefineOptions = (modelName: string, isOpionalDefaultData: boolean) =>
  isOpionalDefaultData
    ? template.statement<ts.TypeAliasDeclaration>`
        type MODEL_FACTORY_DEFINE_OPTIONS = {
          defaultData?: Resolver<MODEL_FACTORY_DEFINE_INPUT>;
        };
      `({
        MODEL_FACTORY_DEFINE_OPTIONS: ast.identifier(`${modelName}FactoryDefineOptions`),
        MODEL_FACTORY_DEFINE_INPUT: ast.identifier(`${modelName}FactoryDefineInput`),
      })
    : template.statement<ts.TypeAliasDeclaration>`
        type MODEL_FACTORY_DEFINE_OPTIONS = {
          defaultData: Resolver<MODEL_FACTORY_DEFINE_INPUT>;
        };
      `({
        MODEL_FACTORY_DEFINE_OPTIONS: ast.identifier(`${modelName}FactoryDefineOptions`),
        MODEL_FACTORY_DEFINE_INPUT: ast.identifier(`${modelName}FactoryDefineInput`),
      });

export const isModelAssociationFactory = (fieldType: DMMF.SchemaArg, model: DMMF.Model) => {
  const targetModel = model.fields.find(f => f.name === fieldType.name)!;
  return template.statement<ts.FunctionDeclaration>`
    function ${() => ast.identifier(`is${model.name}${fieldType.name}Factory`)}(
      x: MODEL_BELONGS_TO_RELATION_FACTORY | ${() => argInputType(model.name, fieldType.name, fieldType.inputTypes[0])}
    ): x is MODEL_BELONGS_TO_RELATION_FACTORY {
      return (x as any)._factoryFor === ${() => ast.stringLiteral(targetModel.type)};
    }
  `({
    MODEL_BELONGS_TO_RELATION_FACTORY: ast.typeReferenceNode(ast.identifier(`${model.name}${fieldType.name}Factory`)),
  });
};

export const autoGenerateModelScalarsOrEnumsFieldArgs = (
  model: DMMF.Model,
  field: DMMF.SchemaArg,
  enums: DMMF.SchemaEnum[],
) =>
  field.inputTypes[0].location === "scalar"
    ? template.expression`
        scalarFieldValueGenerator.SCALAR_TYPE({ modelName: MODEL_NAME, fieldName: FIELD_NAME, isId: IS_ID, isUnique: IS_UNIQUE })
      `({
        SCALAR_TYPE: ast.identifier(field.inputTypes[0].type as string),
        MODEL_NAME: ast.stringLiteral(model.name),
        FIELD_NAME: ast.stringLiteral(field.name),
        IS_ID:
          model.fields.find(f => f.name === field.name)!.isId || model.primaryKey?.fields.includes(field.name)
            ? ast.true()
            : ast.false(),
        IS_UNIQUE: model.fields.find(f => f.name === field.name)!.isUnique ? ast.true() : ast.false(),
      })
    : ast.stringLiteral(extractFirstEnumValue(enums, field));

export const autoGenerateModelScalarsOrEnums = (
  model: DMMF.Model,
  inputType: DMMF.InputType,
  enums: DMMF.SchemaEnum[],
) =>
  template.statement<ts.FunctionDeclaration>`
    function AUTO_GENERATE_MODEL_SCALARS_OR_ENUMS(): MODEL_SCALAR_OR_ENUM_FIELDS {
      return ${() =>
        ast.objectLiteralExpression(
          filterRequiredScalarOrEnumFields(inputType).map(field =>
            ast.propertyAssignment(
              ast.identifier(field.name),
              autoGenerateModelScalarsOrEnumsFieldArgs(model, field, enums),
            ),
          ),
          true,
        )};
    }
  `({
    AUTO_GENERATE_MODEL_SCALARS_OR_ENUMS: ast.identifier(`autoGenerate${model.name}ScalarsOrEnums`),
    MODEL_SCALAR_OR_ENUM_FIELDS: ast.identifier(`${model.name}ScalarOrEnumFields`),
  });

export const defineModelFactoryInernal = (modelName: string, inputType: DMMF.InputType) =>
  template.statement<ts.FunctionDeclaration>`
    function DEFINE_MODEL_FACTORY_INERNAL({
      defaultData: defaultDataResolver
    }: MODEL_FACTORY_DEFINE_OPTIONS) {
      const buildCreateInput = async (
        inputData: Partial<Prisma.MODEL_CREATE_INPUT> = {}
      ) => {
        const requiredScalarData = AUTO_GENERATE_MODEL_SCALARS_OR_ENUMS()
        const defaultData= await resolveValue(defaultDataResolver ?? {});
        const defaultAssociations = ${() =>
          ast.objectLiteralExpression(
            filterRequiredInputObjectTypeField(inputType).map(field =>
              ast.propertyAssignment(
                ast.identifier(field.name),
                template.expression`
                  IS_MODEL_BELONGS_TO_RELATION_FACTORY(defaultData.FIELD_NAME) ? {
                    create: await defaultData.FIELD_NAME.buildCreateInput()
                  } : defaultData.FIELD_NAME
                `({
                  IS_MODEL_BELONGS_TO_RELATION_FACTORY: ast.identifier(`is${modelName}${field.name}Factory`),
                  FIELD_NAME: ast.identifier(field.name),
                }),
              ),
            ),
            true,
          )};
        const data: Prisma.MODEL_CREATE_INPUT = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData};
        return data;
      };
      const create = async (
        inputData: Partial<Prisma.MODEL_CREATE_INPUT> = {}
      ) => {
        const data = await buildCreateInput(inputData);
        return await getClient<PrismaClient>().MODEL_KEY.create({ data });
      };
      return {
        _factoryFor: ${() => ast.stringLiteral(modelName)} as const,
        buildCreateInput,
        create,
      };
    }
  `({
    MODEL_KEY: ast.identifier(camelize(modelName)),
    DEFINE_MODEL_FACTORY_INERNAL: ast.identifier(`define${modelName}FactoryInternal`),
    MODEL_FACTORY_DEFINE_OPTIONS: ast.identifier(`${modelName}FactoryDefineOptions`),
    MODEL_CREATE_INPUT: ast.identifier(`${modelName}CreateInput`),
    AUTO_GENERATE_MODEL_SCALARS_OR_ENUMS: ast.identifier(`autoGenerate${modelName}ScalarsOrEnums`),
  });

export const defineModelFactory = (modelName: string, inputType: DMMF.InputType) =>
  filterRequiredInputObjectTypeField(inputType).length
    ? template.statement<ts.FunctionDeclaration>`
        export function DEFINE_MODEL_FACTORY(args: MODEL_FACTORY_DEFINE_OPTIONS) {
          return DEFINE_MODEL_FACTORY_INERNAL(args);
        }
      `({
        DEFINE_MODEL_FACTORY: ast.identifier(`define${modelName}Factory`),
        DEFINE_MODEL_FACTORY_INERNAL: ast.identifier(`define${modelName}FactoryInternal`),
        MODEL_FACTORY_DEFINE_OPTIONS: ast.identifier(`${modelName}FactoryDefineOptions`),
      })
    : template.statement<ts.FunctionDeclaration>`
        export function DEFINE_MODEL_FACTORY(args: MODEL_FACTORY_DEFINE_OPTIONS = {}) {
          return DEFINE_MODEL_FACTORY_INERNAL(args);
        }
      `({
        DEFINE_MODEL_FACTORY: ast.identifier(`define${modelName}Factory`),
        DEFINE_MODEL_FACTORY_INERNAL: ast.identifier(`define${modelName}FactoryInternal`),
        MODEL_FACTORY_DEFINE_OPTIONS: ast.identifier(`${modelName}FactoryDefineOptions`),
      });

export function getSourceFile({
  document,
  prismaClientModuleSpecifier = "@prisma/client",
}: {
  document: DMMF.Document;
  prismaClientModuleSpecifier?: string;
}) {
  const enums = [
    ...new Set(
      document.schema.inputObjectTypes.prisma
        .filter(iOT => iOT.name.endsWith("CreateInput"))
        .flatMap(filterEnumFields)
        .map(field => field.inputTypes[0].type as string),
    ),
  ];
  const statements = [
    ...enums.map(enumName => importStatement(enumName, prismaClientModuleSpecifier)),
    ...header(prismaClientModuleSpecifier).statements,
    ...document.datamodel.models
      .map(model => ({ model, createInputType: findPrsimaCreateInputTypeFromModelName(document, model.name) }))
      .flatMap(({ model, createInputType }) => [
        modelScalarOrEnumFields(model.name, createInputType),
        ...filterRequiredInputObjectTypeField(createInputType).map(fieldType =>
          modelBelongsToRelationFactory(fieldType, model),
        ),
        modelFactoryDefineInput(model.name, createInputType),
        modelFactoryDefineOptions(model.name, filterRequiredInputObjectTypeField(createInputType).length === 0),
        ...filterRequiredInputObjectTypeField(createInputType).map(fieldType =>
          isModelAssociationFactory(fieldType, model),
        ),
        autoGenerateModelScalarsOrEnums(model, createInputType, document.schema.enumTypes.model ?? []),
        defineModelFactoryInernal(model.name, createInputType),
        defineModelFactory(model.name, createInputType),
      ]),
  ];

  return ast.updateSourceFile(template.sourceFile("")(), statements);
}
