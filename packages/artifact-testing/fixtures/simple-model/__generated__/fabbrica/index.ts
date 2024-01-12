import type { User } from "../client";
import { Prisma } from "../client";
import type { PrismaClient } from "../client";
import { createInitializer, ModelWithFields, createScreener, getScalarFieldValueGenerator, Resolver, normalizeResolver, normalizeList, getSequenceCounter, createCallbackChain, } from "@quramy/prisma-fabbrica/lib/internal";
export { resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";

type BuildDataOptions = {
    readonly seq: number;
};

type CallbackDefineOptions<TCreated, TCreateInput> = {
    onAfterBuild?: (createInput: TCreateInput) => void | PromiseLike<void>;
    onBeforeCreate?: (createInput: TCreateInput) => void | PromiseLike<void>;
    onAfterCreate?: (created: TCreated) => void | PromiseLike<void>;
};

const initializer = createInitializer();

const { getClient } = initializer;

export const { initialize } = initializer;

const factoryFor = Symbol("factoryFor");

const modelFieldDefinitions: ModelWithFields[] = [{
        name: "User",
        fields: []
    }];

type UserScalarOrEnumFields = {
    id: string;
    name: string;
};

type UserFactoryDefineInput = {
    id?: string;
    name?: string;
};

type UserFactoryTrait = {
    data?: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions>;
} & CallbackDefineOptions<User, Prisma.UserCreateInput>;

type UserFactoryDefineOptions = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: UserFactoryTrait;
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

export interface UserFactoryInterface<TOptions extends UserFactoryDefineOptions = UserFactoryDefineOptions> extends UserFactoryInterfaceWithoutTraits {
    use(name: UserTraitKeys<TOptions>, ...names: readonly UserTraitKeys<TOptions>[]): UserFactoryInterfaceWithoutTraits;
}

function autoGenerateUserScalarsOrEnums({ seq }: {
    readonly seq: number;
}): UserScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
        name: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "name", isId: false, isUnique: false, seq })
    };
}

function defineUserFactoryInternal<TOptions extends UserFactoryDefineOptions>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions): UserFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly UserTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("User", modelFieldDefinitions);
        const handleAfterBuild = createCallbackChain([
            onAfterBuild,
            ...traitKeys.map(traitKey => traitsDefs[traitKey].onAfterBuild),
        ]);
        const handleBeforeCreate = createCallbackChain([
            ...traitKeys.slice().reverse().map(traitKey => traitsDefs[traitKey].onBeforeCreate),
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
                const resolveTraitValue = normalizeResolver<Partial<UserFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {};
            const data: Prisma.UserCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            await handleAfterBuild(data);
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.UserCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: User) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            await handleBeforeCreate(data);
            const createdData = await getClient<PrismaClient>().user.create({ data });
            await handleAfterCreate(createdData);
            return createdData;
        };
        const createList = (inputData: number | readonly Partial<Prisma.UserCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.UserCreateInput> = {}) => create(inputData).then(pickForConnect);
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
export function defineUserFactory<TOptions extends UserFactoryDefineOptions>(options?: TOptions): UserFactoryInterface<TOptions> {
    return defineUserFactoryInternal(options ?? {});
}
