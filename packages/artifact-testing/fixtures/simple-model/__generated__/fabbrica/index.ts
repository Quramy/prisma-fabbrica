import type { User } from "../client";
import type { Prisma, PrismaClient } from "../client";
import { createInitializer, createScreener, getScalarFieldValueGenerator, normalizeResolver, normalizeList, getSequenceCounter, createCallbackChain, destructure } from "@quramy/prisma-fabbrica/lib/internal";
import type { ModelWithFields, Resolver, } from "@quramy/prisma-fabbrica/lib/internal";
export { resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";

type BuildDataOptions<TTransients extends Record<string, unknown>> = {
    readonly seq: number;
} & TTransients;

type TraitName = string | symbol;

type CallbackDefineOptions<TCreated, TCreateInput, TTransients extends Record<string, unknown>> = {
    onAfterBuild?: (createInput: TCreateInput, transientFields: TTransients) => void | PromiseLike<void>;
    onBeforeCreate?: (createInput: TCreateInput, transientFields: TTransients) => void | PromiseLike<void>;
    onAfterCreate?: (created: TCreated, transientFields: TTransients) => void | PromiseLike<void>;
};

const initializer = createInitializer();

const { getClient } = initializer;

export const { initialize } = initializer;

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

type UserTransientFields = Record<string, unknown> & Partial<Record<keyof UserFactoryDefineInput, never>>;

type UserFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<User, Prisma.UserCreateInput, TTransients>;

type UserFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: TraitName]: UserFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<User, Prisma.UserCreateInput, TTransients>;

type UserTraitKeys<TOptions extends UserFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;

export interface UserFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "User";
    build(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput>;
    buildList(list: readonly Partial<Prisma.UserCreateInput & TTransients>[]): PromiseLike<Prisma.UserCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput[]>;
    pickForConnect(inputData: User): Pick<User, "id">;
    create(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<User>;
    createList(list: readonly Partial<Prisma.UserCreateInput & TTransients>[]): PromiseLike<User[]>;
    createList(count: number, item?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<User[]>;
    createForConnect(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Pick<User, "id">>;
}

export interface UserFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends UserFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): UserFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateUserScalarsOrEnums({ seq }: {
    readonly seq: number;
}): UserScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
        name: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "name", isId: false, isUnique: false, seq })
    };
}

function defineUserFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends UserFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): UserFactoryInterface<TTransients, UserTraitKeys<TOptions>> {
    const getFactoryWithTraits = (traitKeys: readonly UserTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("User", modelFieldDefinitions);
        const handleAfterBuild = createCallbackChain([
            onAfterBuild,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterBuild),
        ]);
        const handleBeforeCreate = createCallbackChain([
            ...traitKeys.slice().reverse().map(traitKey => traitsDefs[traitKey]?.onBeforeCreate),
            onBeforeCreate,
        ]);
        const handleAfterCreate = createCallbackChain([
            onAfterCreate,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterCreate),
        ]);
        const build = async (inputData: Partial<Prisma.UserCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateUserScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<UserFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const [transientFields, filteredInputData] = destructure(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<UserFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {} as Prisma.UserCreateInput;
            const data: Prisma.UserCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.UserCreateInput & TTransients>>(...args).map(data => build(data)));
        const pickForConnect = (inputData: User) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.UserCreateInput & TTransients> = {}) => {
            const [transientFields] = destructure(defaultTransientFieldValues, inputData);
            const data = await build(inputData).then(screen);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().user.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.UserCreateInput & TTransients>>(...args).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.UserCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "User" as const,
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

interface UserFactoryBuilder {
    <TOptions extends UserFactoryDefineOptions>(options?: TOptions): UserFactoryInterface<{}, UserTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends UserTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends UserFactoryDefineOptions<TTransients>>(options?: TOptions) => UserFactoryInterface<TTransients, UserTraitKeys<TOptions>>;
}

/**
 * Define factory for {@link User} model.
 *
 * @param options
 * @returns factory {@link UserFactoryInterface}
 */
export const defineUserFactory = (<TOptions extends UserFactoryDefineOptions>(options?: TOptions): UserFactoryInterface<TOptions> => {
    return defineUserFactoryInternal(options ?? {}, {});
}) as UserFactoryBuilder;

defineUserFactory.withTransientFields = defaultTransientFieldValues => options => defineUserFactoryInternal(options ?? {}, defaultTransientFieldValues);
