import type { User } from "./__generated__/client";
import { Prisma } from "./__generated__/client";
import type { PrismaClient } from "./__generated__/client";
import {
  getClient,
  ModelWithFields,
  createScreener,
  getScalarFieldValueGenerator,
  Resolver,
  normalizeResolver,
  normalizeList,
  getSequenceCounter,
} from "@quramy/prisma-fabbrica/lib/internal";
export {
  initialize,
  resetSequence,
  registerScalarFieldValueGenerator,
  resetScalarFieldValueGenerator,
} from "@quramy/prisma-fabbrica/lib/internal";

type BuildDataOptions = {
  readonly seq: number;
};

type CallbackDefineOptions<TCreated, TCreateInput, TExtra = never> = {
  onAfterBuild?: (createInput: TCreateInput, extra: TExtra) => void | PromiseLike<void>;
  onBeforeCreate?: (createInput: TCreateInput, extra: TExtra) => void | PromiseLike<void>;
  onAfterCreate?: (created: TCreated, extra: TExtra) => void | PromiseLike<void>;
};

const factoryFor = Symbol("factoryFor");

const modelFieldDefinitions: ModelWithFields[] = [
  {
    name: "User",
    fields: [],
  },
];

function createCallbackChain<T extends any[]>(callbackFns: (((...args: T) => any) | undefined)[]) {
  return async (...args: T) => {
    await callbackFns.reduce(async (acc, fn) => {
      await acc;
      if (!fn) return;
      await fn(...args);
    }, Promise.resolve());
  };
}

type UserScalarOrEnumFields = {
  id: string;
  name: string;
};

type UserFactoryDefineInput = {
  id?: string;
  name?: string;
};

type UserFactoryDefineOptions = {
  defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions>;
  traits?: {
    [traitName: string | symbol]: {
      data?: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions>;
    } & CallbackDefineOptions<User, Prisma.UserCreateInput>;
  };
} & CallbackDefineOptions<User, Prisma.UserCreateInput>;

type UserTraitKeys<TOptions extends UserFactoryDefineOptions> = keyof TOptions["traits"];

export interface UserFactoryInterfaceWithoutTraits {
  readonly [factoryFor]: "User";
  build(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Prisma.UserCreateInput>;
  buildCreateInput(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Prisma.UserCreateInput>;
  buildList(inputData: number | readonly Partial<Prisma.UserCreateInput>[]): PromiseLike<Prisma.UserCreateInput[]>;
  pickForConnect(inputData: User): Pick<User, "id">;
  create(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<User>;
  createList(inputData: number | readonly Partial<Prisma.UserCreateInput>[]): PromiseLike<User[]>;
  createForConnect(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Pick<User, "id">>;
}

export interface UserFactoryInterface<TOptions extends UserFactoryDefineOptions = UserFactoryDefineOptions>
  extends UserFactoryInterfaceWithoutTraits {
  use(name: UserTraitKeys<TOptions>, ...names: readonly UserTraitKeys<TOptions>[]): UserFactoryInterfaceWithoutTraits;
}

function autoGenerateUserScalarsOrEnums({ seq }: { readonly seq: number }): UserScalarOrEnumFields {
  return {
    id: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
    name: getScalarFieldValueGenerator().String({
      modelName: "User",
      fieldName: "name",
      isId: false,
      isUnique: false,
      seq,
    }),
  };
}

function defineUserFactoryInternal<TOptions extends UserFactoryDefineOptions>({
  defaultData: defaultDataResolver,
  onAfterBuild,
  onBeforeCreate,
  onAfterCreate,
  traits: traitsDefs = {},
}: TOptions): UserFactoryInterface<TOptions> {
  const getFactoryWithTraits = (traitKeys: readonly UserTraitKeys<TOptions>[] = []) => {
    const seqKey = {};
    const getSeq = () => getSequenceCounter(seqKey);
    const screen = createScreener("User", modelFieldDefinitions);
    const handleAfterBuild = createCallbackChain([
      onAfterBuild,
      ...traitKeys.map(traitKey => traitsDefs[traitKey].onAfterBuild),
    ]);
    const handleBeforeCreate = createCallbackChain([
      ...traitKeys
        .slice()
        .reverse()
        .map(traitKey => traitsDefs[traitKey].onBeforeCreate),
      onBeforeCreate,
    ]);
    const handleAfterCreate = createCallbackChain([
      onAfterCreate,
      ...traitKeys.map(traitKey => traitsDefs[traitKey].onAfterCreate),
    ]);
    const build = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
      const seq = getSeq();
      const requiredScalarData = autoGenerateUserScalarsOrEnums({ seq });
      const resolveValue = normalizeResolver<UserFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
      const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
        const acc = await queue;
        const resolveTraitValue = normalizeResolver<Partial<UserFactoryDefineInput>, BuildDataOptions>(
          traitsDefs[traitKey]?.data ?? {},
        );
        const traitData = await resolveTraitValue({ seq });
        return {
          ...acc,
          ...traitData,
        };
      }, resolveValue({ seq }));
      const defaultAssociations = {};
      const data: Prisma.UserCreateInput = {
        ...requiredScalarData,
        ...defaultData,
        ...defaultAssociations,
        ...inputData,
      };
      await handleAfterBuild(data, null as never);
      return data;
    };
    const buildList = (inputData: number | readonly Partial<Prisma.UserCreateInput>[]) =>
      Promise.all(normalizeList(inputData).map(data => build(data)));
    const pickForConnect = (inputData: User) => ({
      id: inputData.id,
    });
    const create = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
      const data = await build(inputData).then(screen);
      await handleBeforeCreate(data, null as never);
      const created = await getClient<PrismaClient>().user.create({ data });
      await handleAfterCreate(created, null as never);
      return created;
    };
    const createList = (inputData: number | readonly Partial<Prisma.UserCreateInput>[]) =>
      Promise.all(normalizeList(inputData).map(data => create(data)));
    const createForConnect = (inputData: Partial<Prisma.UserCreateInput> = {}) =>
      create(inputData).then(pickForConnect);
    return {
      [factoryFor]: "User" as const,
      build,
      buildList,
      buildCreateInput: build,
      pickForConnect,
      create,
      createList,
      createForConnect,
    };
  };
  const factory = getFactoryWithTraits();
  const useTraits = (name: UserTraitKeys<TOptions>, ...names: readonly UserTraitKeys<TOptions>[]) => {
    return getFactoryWithTraits([name, ...names]);
  };
  return {
    ...factory,
    use: useTraits,
  };
}

/**
 * Define factory for {@link User} model.
 *
 * @param options
 * @returns factory {@link UserFactoryInterface}
 */
export function defineUserFactory<TOptions extends UserFactoryDefineOptions>(
  options?: TOptions,
): UserFactoryInterface<TOptions> {
  return defineUserFactoryInternal(options ?? {});
}
