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

function filterScalarFields(inputType: DMMF.InputType) {
  return inputType.fields.filter(
    field =>
      field.inputTypes.length > 0 && field.inputTypes.every(childInputType => childInputType.location === "scalar"),
  );
}

function filterNonNullScalarFields(inputType: DMMF.InputType) {
  return filterScalarFields(inputType).filter(field => !field.isNullable);
}

function filterObjectTypeFields(inputType: DMMF.InputType) {
  return inputType.fields.filter(
    field =>
      field.inputTypes.length > 0 &&
      field.inputTypes.every(childInputType => childInputType.location === "inputObjectTypes"),
  );
}

export const header = template.sourceFile`
  import { Prisma } from "@prisma/client";
  import { getClient } from "@quramy/prisma-fabbrica";
  import scalarFieldValueGenerator from "@quramy/prisma-fabbrica/lib/scalar/gen";
  
  type Resolver<T extends Record<string, unknown>> =
    | T
    | (() => T)
    | (() => PromiseLike<T>);
  
  async function resolveValue<T extends Record<string, unknown>>(
    resolver: Resolver<T>
  ) {
    const fn =
      typeof resolver === "function" ? resolver : () => Promise.resolve(resolver);
    return (await fn()) as T;
  }

  const defineFnMap = new Map<unknown, (options: any) => unknown>();
`;

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

export const modelScalarFields = (modelName: string, inputType: DMMF.InputType) =>
  template.statement<ts.TypeAliasDeclaration>`
    type MODEL_SCALAR_FIELDS = TYPE_RHS;
  `({
    MODEL_SCALAR_FIELDS: ts.factory.createIdentifier(`${modelName}ScalarFields`),
    TYPE_RHS: ts.factory.createTypeLiteralNode(
      filterNonNullScalarFields(inputType).map(field =>
        ts.factory.createPropertySignature(
          undefined,
          field.name,
          undefined,
          scalarFieldType(modelName, field.name, field.inputTypes[0]),
        ),
      ),
    ),
  });

export const modelFactoryDefineInput = (modelName: string, inputTpue: DMMF.InputType) =>
  template.statement<ts.TypeAliasDeclaration>`
    type MODEL_FACTORY_DEFINE_INPUT = TYPE_RHS;
  `({
    MODEL_FACTORY_DEFINE_INPUT: ts.factory.createIdentifier(`${modelName}FactoryDefineInput`),
    TYPE_RHS: ts.factory.createTypeLiteralNode([
      ...filterScalarFields(inputTpue).map(field =>
        ts.factory.createPropertySignature(
          undefined,
          field.name,
          ts.factory.createToken(ts.SyntaxKind.QuestionToken),
          scalarFieldType(modelName, field.name, field.inputTypes[0]),
        ),
      ),
      ...filterObjectTypeFields(inputTpue).map(field =>
        ts.factory.createPropertySignature(
          undefined,
          field.name,
          !field.isRequired ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
          ts.factory.createTypeReferenceNode(
            template.expression<ts.Identifier>`Prisma.TYPE_ID`({
              TYPE_ID: ts.factory.createIdentifier(field.inputTypes[0].type as string),
            }),
          ),
        ),
      ),
    ]),
  });

export const defineModelFactoryOptions = (modelName: string) =>
  template.statement<ts.TypeAliasDeclaration>`
    type DEFINE_MODEL_FACTORY_OPTIONS = {
      defaultAttrs: Resolver<MODEL_FACTORY_DEFINE_INPUT>;
    };
  `({
    DEFINE_MODEL_FACTORY_OPTIONS: ts.factory.createIdentifier(`Define${modelName}FactoryOptions`),
    MODEL_FACTORY_DEFINE_INPUT: ts.factory.createIdentifier(`${modelName}FactoryDefineInput`),
  });

export const autoGenrateModelScalars = (modelName: string, inputType: DMMF.InputType, model: DMMF.Model) =>
  template.statement<ts.FunctionDeclaration>`
    function AUTO_GENRATE_MODEL_SCALARS(): MODEL_SCALAR_FIELDS {
      return OBJECT_VALUE;
    }
  `({
    AUTO_GENRATE_MODEL_SCALARS: ts.factory.createIdentifier(`autoGenrate${modelName}Scalars`),
    MODEL_SCALAR_FIELDS: ts.factory.createIdentifier(`${modelName}ScalarFields`),
    OBJECT_VALUE: ts.factory.createObjectLiteralExpression(
      filterNonNullScalarFields(inputType).map(field =>
        ts.factory.createPropertyAssignment(
          ts.factory.createIdentifier(field.name),
          template.expression`scalarFieldValueGenerator.SCALAR_TYPE({ modelName: MODEL_NAME, fieldName: FIELD_NAME, isId: IS_ID, isUnique: IS_UNIQUE })`(
            {
              SCALAR_TYPE: ts.factory.createIdentifier(field.inputTypes[0].type as string),
              MODEL_NAME: ts.factory.createStringLiteral(modelName),
              FIELD_NAME: ts.factory.createStringLiteral(field.name),
              IS_ID: model.fields.find(f => f.name === field.name)!.isId
                ? ts.factory.createTrue()
                : ts.factory.createFalse(),
              IS_UNIQUE: model.fields.find(f => f.name === field.name)!.isUnique
                ? ts.factory.createTrue()
                : ts.factory.createFalse(),
            },
          ),
        ),
      ),
      true,
    ),
  });

export const defineModelFactory = (modelName: string) =>
  template.statement<ts.FunctionDeclaration>`
    function DEFINE_MODEL_FACTORY({
      defaultAttrs: defaultAttributesResolver
    }: DEFINE_MODEL_FACTORY_OPTIONS) {
      const create = async (
        inputAttributes: Partial<Prisma.MODEL_CREATE_INPUT> = {}
      ) => {
        const scalarsAttributes = AUTO_GENRATE_MODEL_SCALARS()
        const defaultAttributes = await resolveValue(defaultAttributesResolver);
        const data = { ...scalarsAttributes, ...defaultAttributes, ...inputAttributes };
        return await getClient().MODEL_KEY.create({ data });
      };
      return { create };
    }
  `({
    MODEL_KEY: ts.factory.createIdentifier(camelize(modelName)),
    DEFINE_MODEL_FACTORY: ts.factory.createIdentifier(`define${modelName}Factory`),
    DEFINE_MODEL_FACTORY_OPTIONS: ts.factory.createIdentifier(`Define${modelName}FactoryOptions`),
    MODEL_CREATE_INPUT: ts.factory.createIdentifier(`${modelName}CreateInput`),
    AUTO_GENRATE_MODEL_SCALARS: ts.factory.createIdentifier(`autoGenrate${modelName}Scalars`),
  });

export const defineFnMapSet = (modelName: string) =>
  template.statement<ts.ExpressionStatement>`
    defineFnMap.set(MODEL_NAME, DEFINE_MODEL_FACTORY);
  `({
    MODEL_NAME: ts.factory.createStringLiteral(modelName),
    DEFINE_MODEL_FACTORY: ts.factory.createIdentifier(`define${modelName}Factory`),
  });

export const defineFactoryOverload = (modelName: string) =>
  template.statement<ts.FunctionDeclaration>`
    export function defineFactory(
      name: MODEL_NAME,
      options: DEFINE_MODEL_FACTORY_OPTIONS,
    ): ReturnType<typeof DEFINE_MODEL_FACTORY>;
  `({
    MODEL_NAME: ts.factory.createStringLiteral(modelName),
    DEFINE_MODEL_FACTORY: ts.factory.createIdentifier(`define${modelName}Factory`),
    DEFINE_MODEL_FACTORY_OPTIONS: ts.factory.createIdentifier(`Define${modelName}FactoryOptions`),
  });

export const defineFactoryImpl = template.statement`
  export function defineFactory(name: unknown, options: unknown): unknown {
    const defineFn = defineFnMap.get(name);
    if (!defineFn) throw new Error("Invalid model name");
    return defineFn(options);
  }
`;

export function getSourceFile(document: DMMF.Document) {
  const statements = [
    ...header().statements,
    ...document.datamodel.models.flatMap(model => [
      modelScalarFields(model.name, findPrsimaCreateInputTypeFromModelName(document, model.name)),
      modelFactoryDefineInput(model.name, findPrsimaCreateInputTypeFromModelName(document, model.name)),
      defineModelFactoryOptions(model.name),
      autoGenrateModelScalars(model.name, findPrsimaCreateInputTypeFromModelName(document, model.name), model),
      defineModelFactory(model.name),
    ]),
    ...document.datamodel.models.map(model => defineFnMapSet(model.name)),
    ...document.datamodel.models.map(model => defineFactoryOverload(model.name)),
    defineFactoryImpl(),
  ];

  return ts.factory.updateSourceFile(header(), statements);
}
