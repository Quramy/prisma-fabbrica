import { DMMF } from "@prisma/generator-helper";
import ts from "typescript";
import { template } from "talt";

export const header = template.sourceFile`
  import { PrismaClient, Prisma } from "@prisma/client";
  
  let prisma: PrismaClient;
  
  export function configure(client: PrismaClient) {
    prisma = client;
  }
  
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

function camerize(pascal: string) {
  return pascal[0].toLowerCase() + pascal.slice(1);
}

const defineModelFactoryOptions = (modelName: string) =>
  template.statement<ts.TypeAliasDeclaration>`
    type DEFINE_MODEL_FACTORY_OPTIONS = {
      defaultAttrs: Resolver<Prisma.MODEL_CREATE_INPUT>;
    };
  `({
    DEFINE_MODEL_FACTORY_OPTIONS: ts.factory.createIdentifier(`Define${modelName}FactoryOptions`),
    MODEL_CREATE_INPUT: ts.factory.createIdentifier(`${modelName}CreateInput`),
  });

const defineModelFactory = (modelName: string) =>
  template.statement<ts.FunctionDeclaration>`
    function DEFINE_MODEL_FACTORY({
      defaultAttrs: defaultAttributesResolver
    }: DEFINE_MODEL_FACTORY_OPTIONS) {
      const create = async (
        inputAttributes: Partial<Prisma.MODEL_CREATE_INPUT> = {}
      ) => {
        const defaultAttributes = await resolveValue(defaultAttributesResolver);
        const data = { ...defaultAttributes, ...inputAttributes };
        return await prisma.MODEL_KEY.create({ data });
      };
      return { create };
    }
  `({
    MODEL_KEY: ts.factory.createIdentifier(camerize(modelName)),
    DEFINE_MODEL_FACTORY: ts.factory.createIdentifier(`define${modelName}Factory`),
    DEFINE_MODEL_FACTORY_OPTIONS: ts.factory.createIdentifier(`Define${modelName}FactoryOptions`),
    MODEL_CREATE_INPUT: ts.factory.createIdentifier(`${modelName}CreateInput`),
  });

const defineFnMapSet = (modelName: string) =>
  template.statement<ts.ExpressionStatement>`
    defineFnMap.set(MODEL_NAME, DEFINE_MODEL_FACTORY);
  `({
    MODEL_NAME: ts.factory.createStringLiteral(modelName),
    DEFINE_MODEL_FACTORY: ts.factory.createIdentifier(`define${modelName}Factory`),
  });

const defineFactoryOverload = (modelName: string) =>
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

const defineFactoryImpl = template.statement`
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
      defineModelFactoryOptions(model.name),
      defineModelFactory(model.name),
    ]),
    ...document.datamodel.models.map(model => defineFnMapSet(model.name)),
    ...document.datamodel.models.map(model => defineFactoryOverload(model.name)),
    defineFactoryImpl(),
  ];

  return ts.factory.updateSourceFile(header(), statements);
}
