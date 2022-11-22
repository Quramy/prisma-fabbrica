import { DMMF } from "@prisma/generator-helper";
import ts from "typescript";
import { template } from "talt";

function camelize(pascal: string) {
  return pascal[0].toLowerCase() + pascal.slice(1);
}

const ast = ts.factory;

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

export const header = (importSpecifierToPrismaClient: string) =>
  template.sourceFile`
    import { Prisma } from ${() => ast.createStringLiteral(importSpecifierToPrismaClient)};
    import type { PrismaClient } from ${() => ast.createStringLiteral(importSpecifierToPrismaClient)};
    import { getClient } from "@quramy/prisma-fabbrica/lib/clientHolder";
    import scalarFieldValueGenerator from "@quramy/prisma-fabbrica/lib/scalar/gen";
    import { Resolver, resolveValue } from "@quramy/prisma-fabbrica/lib/helpers";
    export { initialize } from "@quramy/prisma-fabbrica";
  `();

export const importStatement = (specifier: string, moduleSpecifer: string) =>
  template.statement`
    import { ${() => ast.createIdentifier(specifier)} } from ${() => ast.createStringLiteral(moduleSpecifer)};
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
      return ast.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
    case "String":
      return ast.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
    case "Int":
    case "Float":
      return ast.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    case "BigInt":
      return ast.createKeywordTypeNode(ts.SyntaxKind.BigIntKeyword);
    case "Decimal":
      return template.typeNode`Prisma.Decimal`();
    case "DateTime":
      return template.typeNode`Date`();
    case "Bytes":
      return template.typeNode`Buffer`();
    case "JSON":
      // FIXME Is the folloing type right?
      // return template.typeNode`Prisma.Json`();
      return ast.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
    default:
      throw new Error(`Unknown scalar type "${inputType.type}" for ${modelName}.${fieldName} .`);
  }
};

export const argInputType = (modelName: string, fieldName: string, inputType: DMMF.SchemaArgInputType): ts.TypeNode => {
  const fieldType = () => {
    if (inputType.location === "scalar") {
      return scalarFieldType(modelName, fieldName, inputType);
    } else if (inputType.location === "enumTypes") {
      return ast.createTypeReferenceNode(ast.createIdentifier(inputType.type as string));
    } else if (inputType.location === "outputObjectTypes" || inputType.location === "inputObjectTypes") {
      return ast.createTypeReferenceNode(
        template.expression<ts.Identifier>`Prisma.${() => ast.createIdentifier(inputType.type as string)}`(),
      );
    } else {
      // FIXME inputType.location === "fieldRefTypes"
      return ast.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);
    }
  };
  return inputType.isList
    ? ast.createTypeReferenceNode(template.expression<ts.Identifier>`Prisma.Enumerable<${fieldType}>`())
    : fieldType();
};

export const modelScalarOrEnumFields = (modelName: string, inputType: DMMF.InputType) =>
  template.statement<ts.TypeAliasDeclaration>`
    type MODEL_SCALAR_OR_ENUM_FIELDS = ${() =>
      ast.createTypeLiteralNode(
        filterRequiredScalarOrEnumFields(inputType).map(field =>
          ast.createPropertySignature(
            undefined,
            field.name,
            undefined,
            ast.createUnionTypeNode(
              field.inputTypes.map(childInputType => argInputType(modelName, field.name, childInputType)),
            ),
          ),
        ),
      )}
  `({
    MODEL_SCALAR_OR_ENUM_FIELDS: ast.createIdentifier(`${modelName}ScalarOrEnumFields`),
  });

export const modelBelongsToRelationFactory = (fieldType: DMMF.SchemaArg, model: DMMF.Model) => {
  const targetModel = model.fields.find(f => f.name === fieldType.name)!;
  return template.statement<ts.TypeAliasDeclaration>`
    type ${() => ast.createIdentifier(`${model.name}${fieldType.name}Factory`)} = {
      _factoryFor: ${() => ast.createLiteralTypeNode(ast.createStringLiteral(targetModel.type))};
      buildCreateInput: () => PromiseLike<Prisma.${() =>
        ast.createIdentifier(fieldType.inputTypes[0].type as string)}["create"]>;
    };
  `();
};

export const modelFactoryDefineInput = (modelName: string, inputType: DMMF.InputType) =>
  template.statement<ts.TypeAliasDeclaration>`
    type MODEL_FACTORY_DEFINE_INPUT = ${() =>
      ast.createTypeLiteralNode(
        inputType.fields.map(field =>
          ast.createPropertySignature(
            undefined,
            field.name,
            !field.isRequired || isScalarOrEnumField(field) ? ast.createToken(ts.SyntaxKind.QuestionToken) : undefined,
            ast.createUnionTypeNode([
              ...(field.isRequired && isInputObjectTypeField(field)
                ? [ast.createTypeReferenceNode(ast.createIdentifier(`${modelName}${field.name}Factory`))]
                : []),
              ...field.inputTypes.map(childInputType => argInputType(modelName, field.name, childInputType)),
            ]),
          ),
        ),
      )};
  `({
    MODEL_FACTORY_DEFINE_INPUT: ast.createIdentifier(`${modelName}FactoryDefineInput`),
  });

export const modelFactoryDefineOptions = (modelName: string, isOpionalDefaultData: boolean) =>
  isOpionalDefaultData
    ? template.statement<ts.TypeAliasDeclaration>`
        type MODEL_FACTORY_DEFINE_OPTIONS = {
          defaultData?: Resolver<MODEL_FACTORY_DEFINE_INPUT>;
        };
      `({
        MODEL_FACTORY_DEFINE_OPTIONS: ast.createIdentifier(`${modelName}FactoryDefineOptions`),
        MODEL_FACTORY_DEFINE_INPUT: ast.createIdentifier(`${modelName}FactoryDefineInput`),
      })
    : template.statement<ts.TypeAliasDeclaration>`
        type MODEL_FACTORY_DEFINE_OPTIONS = {
          defaultData: Resolver<MODEL_FACTORY_DEFINE_INPUT>;
        };
      `({
        MODEL_FACTORY_DEFINE_OPTIONS: ast.createIdentifier(`${modelName}FactoryDefineOptions`),
        MODEL_FACTORY_DEFINE_INPUT: ast.createIdentifier(`${modelName}FactoryDefineInput`),
      });

export const isModelAssociationFactory = (fieldType: DMMF.SchemaArg, model: DMMF.Model) => {
  const targetModel = model.fields.find(f => f.name === fieldType.name)!;
  return template.statement<ts.FunctionDeclaration>`
    function ${() => ast.createIdentifier(`is${model.name}${fieldType.name}Factory`)}(
      x: MODEL_BELONGS_TO_RELATION_FACTORY | ${() => argInputType(model.name, fieldType.name, fieldType.inputTypes[0])}
    ): x is MODEL_BELONGS_TO_RELATION_FACTORY {
      return (x as any)._factoryFor === ${() => ast.createStringLiteral(targetModel.type)};
    }
  `({
    MODEL_BELONGS_TO_RELATION_FACTORY: ast.createTypeReferenceNode(
      ast.createIdentifier(`${model.name}${fieldType.name}Factory`),
    ),
  });
};

export const autoGenrateModelScalarsOrEnums = (
  modelName: string,
  inputType: DMMF.InputType,
  model: DMMF.Model,
  enums: DMMF.SchemaEnum[],
) =>
  template.statement<ts.FunctionDeclaration>`
    function AUTO_GENRATE_MODEL_SCALARS_OR_ENUMS(): MODEL_SCALAR_OR_ENUM_FIELDS {
      return ${() =>
        ast.createObjectLiteralExpression(
          filterRequiredScalarOrEnumFields(inputType).map(field =>
            ast.createPropertyAssignment(
              ast.createIdentifier(field.name),
              field.inputTypes[0].location === "scalar"
                ? template.expression`
                    scalarFieldValueGenerator.SCALAR_TYPE({ modelName: MODEL_NAME, fieldName: FIELD_NAME, isId: IS_ID, isUnique: IS_UNIQUE })
                  `({
                    SCALAR_TYPE: ast.createIdentifier(field.inputTypes[0].type as string),
                    MODEL_NAME: ast.createStringLiteral(modelName),
                    FIELD_NAME: ast.createStringLiteral(field.name),
                    IS_ID: model.fields.find(f => f.name === field.name)!.isId ? ast.createTrue() : ast.createFalse(),
                    IS_UNIQUE: model.fields.find(f => f.name === field.name)!.isUnique
                      ? ast.createTrue()
                      : ast.createFalse(),
                  })
                : ast.createStringLiteral(extractFirstEnumValue(enums, field)),
            ),
          ),
          true,
        )};
    }
  `({
    AUTO_GENRATE_MODEL_SCALARS_OR_ENUMS: ast.createIdentifier(`autoGenrate${modelName}ScalarsOrEnums`),
    MODEL_SCALAR_OR_ENUM_FIELDS: ast.createIdentifier(`${modelName}ScalarOrEnumFields`),
  });

export const defineModelFactoryInernal = (modelName: string, inputType: DMMF.InputType) =>
  template.statement<ts.FunctionDeclaration>`
    function DEFINE_MODEL_FACTORY_INERNAL({
      defaultData: defaultDataResolver
    }: MODEL_FACTORY_DEFINE_OPTIONS) {
      const buildCreateInput = async (
        inputData: Partial<Prisma.MODEL_CREATE_INPUT> = {}
      ) => {
        const requiredScalarData = AUTO_GENRATE_MODEL_SCALARS_OR_ENUMS()
        const defaultData= await resolveValue(defaultDataResolver ?? {});
        const defaultAssociations = ${() =>
          ast.createObjectLiteralExpression(
            filterRequiredInputObjectTypeField(inputType).map(field =>
              ast.createPropertyAssignment(
                ast.createIdentifier(field.name),
                template.expression`
                  IS_MODEL_BELONGS_TO_RELATION_FACTORY(defaultData.FIELD_NAME) ? {
                    create: await defaultData.FIELD_NAME.buildCreateInput()
                  } : defaultData.FIELD_NAME
                `({
                  IS_MODEL_BELONGS_TO_RELATION_FACTORY: ast.createIdentifier(`is${modelName}${field.name}Factory`),
                  FIELD_NAME: ast.createIdentifier(field.name),
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
        _factoryFor: ${() => ast.createStringLiteral(modelName)} as const,
        buildCreateInput,
        create,
      };
    }
  `({
    MODEL_KEY: ast.createIdentifier(camelize(modelName)),
    DEFINE_MODEL_FACTORY_INERNAL: ast.createIdentifier(`define${modelName}FactoryInternal`),
    MODEL_FACTORY_DEFINE_OPTIONS: ast.createIdentifier(`${modelName}FactoryDefineOptions`),
    MODEL_CREATE_INPUT: ast.createIdentifier(`${modelName}CreateInput`),
    AUTO_GENRATE_MODEL_SCALARS_OR_ENUMS: ast.createIdentifier(`autoGenrate${modelName}ScalarsOrEnums`),
  });

export const defineModelFactory = (modelName: string, inputType: DMMF.InputType) =>
  filterRequiredInputObjectTypeField(inputType).length
    ? template.statement<ts.FunctionDeclaration>`
        export function DEFINE_MODEL_FACTORY(args: MODEL_FACTORY_DEFINE_OPTIONS) {
          return DEFINE_MODEL_FACTORY_INERNAL(args);
        }
      `({
        DEFINE_MODEL_FACTORY: ast.createIdentifier(`define${modelName}Factory`),
        DEFINE_MODEL_FACTORY_INERNAL: ast.createIdentifier(`define${modelName}FactoryInternal`),
        MODEL_FACTORY_DEFINE_OPTIONS: ast.createIdentifier(`${modelName}FactoryDefineOptions`),
      })
    : template.statement<ts.FunctionDeclaration>`
        export function DEFINE_MODEL_FACTORY(args: MODEL_FACTORY_DEFINE_OPTIONS = {}) {
          return DEFINE_MODEL_FACTORY_INERNAL(args);
        }
      `({
        DEFINE_MODEL_FACTORY: ast.createIdentifier(`define${modelName}Factory`),
        DEFINE_MODEL_FACTORY_INERNAL: ast.createIdentifier(`define${modelName}FactoryInternal`),
        MODEL_FACTORY_DEFINE_OPTIONS: ast.createIdentifier(`${modelName}FactoryDefineOptions`),
      });

export function getSourceFile({
  document,
  importSpecifierToPrismaClient,
}: {
  document: DMMF.Document;
  importSpecifierToPrismaClient: string;
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
    ...enums.map(enumName => importStatement(enumName, importSpecifierToPrismaClient)),
    ...header(importSpecifierToPrismaClient).statements,
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
        autoGenrateModelScalarsOrEnums(model.name, createInputType, model, document.schema.enumTypes.model ?? []),
        defineModelFactoryInernal(model.name, createInputType),
        defineModelFactory(model.name, createInputType),
      ]),
  ];

  return ast.updateSourceFile(template.sourceFile("")(), statements);
}
