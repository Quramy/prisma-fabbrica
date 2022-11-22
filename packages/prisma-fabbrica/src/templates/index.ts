import { DMMF } from "@prisma/generator-helper";
import ts from "typescript";
import { template } from "talt";

function camelize(pascal: string) {
  return pascal[0].toLowerCase() + pascal.slice(1);
}

export function findPrsimaCreateInputTypeFromModelName(document: DMMF.Document, modelName: string) {
  const inputType = document.schema.inputObjectTypes.prisma.find(x => x.name === `${modelName}CreateInput`);
  if (!inputType) throw new Error("");
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
    import { Prisma } from ${() => ts.factory.createStringLiteral(importSpecifierToPrismaClient)};
    import type { PrismaClient } from ${() => ts.factory.createStringLiteral(importSpecifierToPrismaClient)};
    import { getClient } from "@quramy/prisma-fabbrica";
    import scalarFieldValueGenerator from "@quramy/prisma-fabbrica/lib/scalar/gen";
    import { Resolver, resolveValue } from "@quramy/prisma-fabbrica/lib/helpers";
  `();

export const importStatement = (specifier: string, moduleSpecifer: string) =>
  template.statement`
    import { ${() => ts.factory.createIdentifier(specifier)} } from ${() =>
    ts.factory.createStringLiteral(moduleSpecifer)};
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
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
    case "String":
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
    case "Int":
    case "Float":
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    case "BigInt":
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BigIntKeyword);
    case "Decimal":
      return template.typeNode`Prisma.Decimal`();
    case "DateTime":
      return template.typeNode`Date`();
    case "Bytes":
      return template.typeNode`Buffer`();
    case "JSON":
      // FIXME Is the folloing type right?
      // return template.typeNode`Prisma.Json`();
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
    default:
      throw new Error(`Unknown scalar type "${inputType.type}" for ${modelName}.${fieldName} .`);
  }
};

export const argInputType = (modelName: string, fieldName: string, inputType: DMMF.SchemaArgInputType): ts.TypeNode => {
  const fieldType = () => {
    if (inputType.location === "scalar") {
      return scalarFieldType(modelName, fieldName, inputType);
    } else if (inputType.location === "enumTypes") {
      return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(inputType.type as string));
    } else if (inputType.location === "outputObjectTypes" || inputType.location === "inputObjectTypes") {
      return ts.factory.createTypeReferenceNode(
        template.expression<ts.Identifier>`Prisma.${() => ts.factory.createIdentifier(inputType.type as string)}`(),
      );
    } else {
      // FIXME inputType.location === "fieldRefTypes"
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);
    }
  };
  return inputType.isList
    ? ts.factory.createTypeReferenceNode(template.expression<ts.Identifier>`Prisma.Enumerable<${fieldType}>`())
    : fieldType();
};

export const modelScalarOrEnumFields = (modelName: string, inputType: DMMF.InputType) =>
  template.statement<ts.TypeAliasDeclaration>`
    type MODEL_SCALAR_OR_ENUM_FIELDS = ${() =>
      ts.factory.createTypeLiteralNode(
        filterRequiredScalarOrEnumFields(inputType).map(field =>
          ts.factory.createPropertySignature(
            undefined,
            field.name,
            undefined,
            ts.factory.createUnionTypeNode(
              field.inputTypes.map(childInputType => argInputType(modelName, field.name, childInputType)),
            ),
          ),
        ),
      )}
  `({
    MODEL_SCALAR_OR_ENUM_FIELDS: ts.factory.createIdentifier(`${modelName}ScalarOrEnumFields`),
  });

export const modelAssociationFactory = (fieldType: DMMF.SchemaArg, model: DMMF.Model) => {
  const targetModel = model.fields.find(f => f.name === fieldType.name)!;
  return template.statement<ts.TypeAliasDeclaration>`
    type ${() => ts.factory.createIdentifier(`${model.name}${fieldType.name}Factory`)} = {
      _factoryFor: ${() => ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(targetModel.type))};
      buildCreateInput: () => PromiseLike<Prisma.${() =>
        ts.factory.createIdentifier(fieldType.inputTypes[0].type as string)}["create"]>;
    };
  `();
};

export const modelFactoryDefineInput = (modelName: string, inputType: DMMF.InputType) =>
  template.statement<ts.TypeAliasDeclaration>`
    type MODEL_FACTORY_DEFINE_INPUT = ${() =>
      ts.factory.createTypeLiteralNode(
        inputType.fields.map(field =>
          ts.factory.createPropertySignature(
            undefined,
            field.name,
            !field.isRequired || isScalarOrEnumField(field)
              ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
              : undefined,
            ts.factory.createUnionTypeNode([
              ...(field.isRequired && isInputObjectTypeField(field)
                ? [ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(`${modelName}${field.name}Factory`))]
                : []),
              ...field.inputTypes.map(childInputType => argInputType(modelName, field.name, childInputType)),
            ]),
          ),
        ),
      )};
  `({
    MODEL_FACTORY_DEFINE_INPUT: ts.factory.createIdentifier(`${modelName}FactoryDefineInput`),
  });

export const modelFactoryDefineOptions = (modelName: string) =>
  template.statement<ts.TypeAliasDeclaration>`
    type MODEL_FACTORY_DEFINE_OPTIONS = {
      defaultData: Resolver<MODEL_FACTORY_DEFINE_INPUT>;
    };
  `({
    MODEL_FACTORY_DEFINE_OPTIONS: ts.factory.createIdentifier(`${modelName}FactoryDefineOptions`),
    MODEL_FACTORY_DEFINE_INPUT: ts.factory.createIdentifier(`${modelName}FactoryDefineInput`),
  });

export const isModelAssociationFactory = (fieldType: DMMF.SchemaArg, model: DMMF.Model) => {
  const targetModel = model.fields.find(f => f.name === fieldType.name)!;
  return template.statement<ts.FunctionDeclaration>`
    function ${() => ts.factory.createIdentifier(`is${model.name}${fieldType.name}Factory`)}(
      x: MODEL_ASSOCIATION_FACTORY | ${() => argInputType(model.name, fieldType.name, fieldType.inputTypes[0])}
    ): x is MODEL_ASSOCIATION_FACTORY {
      return (x as any)._factoryFor === ${() => ts.factory.createStringLiteral(targetModel.type)};
    }
  `({
    MODEL_ASSOCIATION_FACTORY: ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier(`${model.name}${fieldType.name}Factory`),
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
        ts.factory.createObjectLiteralExpression(
          filterRequiredScalarOrEnumFields(inputType).map(field =>
            ts.factory.createPropertyAssignment(
              ts.factory.createIdentifier(field.name),
              field.inputTypes[0].location === "scalar"
                ? template.expression`
                    scalarFieldValueGenerator.SCALAR_TYPE({ modelName: MODEL_NAME, fieldName: FIELD_NAME, isId: IS_ID, isUnique: IS_UNIQUE })
                  `({
                    SCALAR_TYPE: ts.factory.createIdentifier(field.inputTypes[0].type as string),
                    MODEL_NAME: ts.factory.createStringLiteral(modelName),
                    FIELD_NAME: ts.factory.createStringLiteral(field.name),
                    IS_ID: model.fields.find(f => f.name === field.name)!.isId
                      ? ts.factory.createTrue()
                      : ts.factory.createFalse(),
                    IS_UNIQUE: model.fields.find(f => f.name === field.name)!.isUnique
                      ? ts.factory.createTrue()
                      : ts.factory.createFalse(),
                  })
                : ts.factory.createStringLiteral(extractFirstEnumValue(enums, field)),
            ),
          ),
          true,
        )};
    }
  `({
    AUTO_GENRATE_MODEL_SCALARS_OR_ENUMS: ts.factory.createIdentifier(`autoGenrate${modelName}ScalarsOrEnums`),
    MODEL_SCALAR_OR_ENUM_FIELDS: ts.factory.createIdentifier(`${modelName}ScalarOrEnumFields`),
  });

export const defineModelFactory = (modelName: string, inputType: DMMF.InputType) =>
  template.statement<ts.FunctionDeclaration>`
    export function DEFINE_MODEL_FACTORY({
      defaultData: defaultDataResolver
    }: MODEL_FACTORY_DEFINE_OPTIONS) {
      const buildCreateInput = async (
        inputData: Partial<Prisma.MODEL_CREATE_INPUT> = {}
      ) => {
        const requiredScalarData = AUTO_GENRATE_MODEL_SCALARS_OR_ENUMS()
        const defaultData= await resolveValue(defaultDataResolver);
        const defaultAssociations = ${() =>
          ts.factory.createObjectLiteralExpression(
            filterRequiredInputObjectTypeField(inputType).map(field =>
              ts.factory.createPropertyAssignment(
                ts.factory.createIdentifier(field.name),
                template.expression`
                  IS_MODEL_ASSOCIATION_FACTORY(defaultData.FIELD_NAME) ? { create: await defaultData.FIELD_NAME.buildCreateInput() } : defaultData.FIELD_NAME
                `({
                  IS_MODEL_ASSOCIATION_FACTORY: ts.factory.createIdentifier(`is${modelName}${field.name}Factory`),
                  FIELD_NAME: ts.factory.createIdentifier(field.name),
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
        _factoryFor: ${() => ts.factory.createStringLiteral(modelName)} as const,
        buildCreateInput,
        create,
      };
    }
  `({
    MODEL_KEY: ts.factory.createIdentifier(camelize(modelName)),
    DEFINE_MODEL_FACTORY: ts.factory.createIdentifier(`define${modelName}Factory`),
    MODEL_FACTORY_DEFINE_OPTIONS: ts.factory.createIdentifier(`${modelName}FactoryDefineOptions`),
    MODEL_CREATE_INPUT: ts.factory.createIdentifier(`${modelName}CreateInput`),
    AUTO_GENRATE_MODEL_SCALARS_OR_ENUMS: ts.factory.createIdentifier(`autoGenrate${modelName}ScalarsOrEnums`),
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
    ...document.datamodel.models.flatMap(model => [
      modelScalarOrEnumFields(model.name, findPrsimaCreateInputTypeFromModelName(document, model.name)),
      ...filterRequiredInputObjectTypeField(findPrsimaCreateInputTypeFromModelName(document, model.name)).map(
        fieldType => modelAssociationFactory(fieldType, model),
      ),
      modelFactoryDefineInput(model.name, findPrsimaCreateInputTypeFromModelName(document, model.name)),
      modelFactoryDefineOptions(model.name),
      ...filterRequiredInputObjectTypeField(findPrsimaCreateInputTypeFromModelName(document, model.name)).map(
        fieldType => isModelAssociationFactory(fieldType, model),
      ),
      autoGenrateModelScalarsOrEnums(
        model.name,
        findPrsimaCreateInputTypeFromModelName(document, model.name),
        model,
        document.schema.enumTypes.model ?? [],
      ),
      defineModelFactory(model.name, findPrsimaCreateInputTypeFromModelName(document, model.name)),
    ]),
  ];

  return ts.factory.updateSourceFile(template.sourceFile("")(), statements);
}
