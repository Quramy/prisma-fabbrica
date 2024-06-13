import type { User } from "../client";
import type { Profile } from "../client";
import type { Prisma, PrismaClient } from "../client";
import { createInitializer, createScreener, getScalarFieldValueGenerator, normalizeResolver, normalizeList, getSequenceCounter, createCallbackChain, synthesize, } from "@quramy/prisma-fabbrica/lib/internal";
import type { ModelWithFields, Resolver, } from "@quramy/prisma-fabbrica/lib/internal";
export { resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";

type BuildDataOptions<TTransients extends Record<string, unknown>> = {
    readonly seq: number;
} & TTransients;

type CallbackDefineOptions<TCreated, TCreateInput, TTransients extends Record<string, unknown>> = {
    onAfterBuild?: (createInput: TCreateInput & TTransients) => void | PromiseLike<void>;
    onBeforeCreate?: (createInput: TCreateInput & TTransients) => void | PromiseLike<void>;
    onAfterCreate?: (created: TCreated & TTransients) => void | PromiseLike<void>;
};

const initializer = createInitializer();

const { getClient } = initializer;

export const { initialize } = initializer;

const modelFieldDefinitions: ModelWithFields[] = [{
        name: "User",
        fields: [{
                name: "profile",
                type: "Profile",
                relationName: "ProfileToUser"
            }]
    }, {
        name: "Profile",
        fields: [{
                name: "user",
                type: "User",
                relationName: "ProfileToUser"
            }]
    }];

type UserScalarOrEnumFields = {
    id: string;
    name: string;
};

type UserprofileFactory = {
    _factoryFor: "Profile";
    build: () => PromiseLike<Prisma.ProfileCreateNestedOneWithoutUserInput["create"]>;
};

type UserFactoryDefineInput = {
    id?: string;
    name?: string;
    profile?: UserprofileFactory | Prisma.ProfileCreateNestedOneWithoutUserInput;
};

type UserFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<User, Prisma.UserCreateInput, TTransients>;

type UserFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: UserFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<User, Prisma.UserCreateInput, TTransients>;

function isUserprofileFactory(x: UserprofileFactory | Prisma.ProfileCreateNestedOneWithoutUserInput | undefined): x is UserprofileFactory {
    return (x as any)?._factoryFor === "Profile";
}

type UserTraitKeys<TOptions extends UserFactoryDefineOptions<Record<string, unknown>>> = keyof TOptions["traits"];

export interface UserFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "User";
    build(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Prisma.UserCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.UserCreateInput>[]): PromiseLike<Prisma.UserCreateInput[]>;
    pickForConnect(inputData: User): Pick<User, "id">;
    create(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<User>;
    createList(inputData: number | readonly Partial<Prisma.UserCreateInput>[]): PromiseLike<User[]>;
    createForConnect(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Pick<User, "id">>;
}

export interface UserFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends UserFactoryDefineOptions<any> = UserFactoryDefineOptions> extends UserFactoryInterfaceWithoutTraits<TTransients> {
    use(name: UserTraitKeys<TOptions>, ...names: readonly UserTraitKeys<TOptions>[]): UserFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateUserScalarsOrEnums({ seq }: {
    readonly seq: number;
}): UserScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
        name: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "name", isId: false, isUnique: false, seq })
    };
}

function defineUserFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends UserFactoryDefineOptions<any>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): UserFactoryInterface<TTransients, TOptions> {
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
            const resolveValue = normalizeResolver<UserFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const transients = synthesize(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transients };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<UserFactoryDefineInput>, BuildDataOptions<any>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {
                profile: isUserprofileFactory(defaultData.profile) ? {
                    create: await defaultData.profile.build()
                } : defaultData.profile
            };
            const data: Prisma.UserCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            await handleAfterBuild({ ...data, ...transients });
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
    <TOptions extends UserFactoryDefineOptions>(options?: TOptions): UserFactoryInterface<{}, TOptions>;
    withTransientFields: <TTransients extends Record<string, unknown>>(defaultTransientFieldValues: TTransients) => <TOptions extends UserFactoryDefineOptions<TTransients>>(options?: TOptions) => UserFactoryInterface<TTransients, TOptions>;
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

type ProfileScalarOrEnumFields = {
    id: string;
};

type ProfileuserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutProfileInput["create"]>;
};

type ProfileFactoryDefineInput = {
    id?: string;
    user: ProfileuserFactory | Prisma.UserCreateNestedOneWithoutProfileInput;
};

type ProfileFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<ProfileFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Profile, Prisma.ProfileCreateInput, TTransients>;

type ProfileFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData: Resolver<ProfileFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: ProfileFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Profile, Prisma.ProfileCreateInput, TTransients>;

function isProfileuserFactory(x: ProfileuserFactory | Prisma.UserCreateNestedOneWithoutProfileInput | undefined): x is ProfileuserFactory {
    return (x as any)?._factoryFor === "User";
}

type ProfileTraitKeys<TOptions extends ProfileFactoryDefineOptions<Record<string, unknown>>> = keyof TOptions["traits"];

export interface ProfileFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Profile";
    build(inputData?: Partial<Prisma.ProfileCreateInput & TTransients>): PromiseLike<Prisma.ProfileCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.ProfileCreateInput>): PromiseLike<Prisma.ProfileCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.ProfileCreateInput>[]): PromiseLike<Prisma.ProfileCreateInput[]>;
    pickForConnect(inputData: Profile): Pick<Profile, "id">;
    create(inputData?: Partial<Prisma.ProfileCreateInput & TTransients>): PromiseLike<Profile>;
    createList(inputData: number | readonly Partial<Prisma.ProfileCreateInput>[]): PromiseLike<Profile[]>;
    createForConnect(inputData?: Partial<Prisma.ProfileCreateInput>): PromiseLike<Pick<Profile, "id">>;
}

export interface ProfileFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends ProfileFactoryDefineOptions<any> = ProfileFactoryDefineOptions> extends ProfileFactoryInterfaceWithoutTraits<TTransients> {
    use(name: ProfileTraitKeys<TOptions>, ...names: readonly ProfileTraitKeys<TOptions>[]): ProfileFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateProfileScalarsOrEnums({ seq }: {
    readonly seq: number;
}): ProfileScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "Profile", fieldName: "id", isId: true, isUnique: false, seq })
    };
}

function defineProfileFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends ProfileFactoryDefineOptions<any>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): ProfileFactoryInterface<TTransients, TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly ProfileTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Profile", modelFieldDefinitions);
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
        const build = async (inputData: Partial<Prisma.ProfileCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateProfileScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<ProfileFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver);
            const transients = synthesize(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transients };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<ProfileFactoryDefineInput>, BuildDataOptions<any>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {
                user: isProfileuserFactory(defaultData.user) ? {
                    create: await defaultData.user.build()
                } : defaultData.user
            };
            const data: Prisma.ProfileCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            await handleAfterBuild({ ...data, ...transients });
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.ProfileCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: Profile) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.ProfileCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            await handleBeforeCreate(data);
            const createdData = await getClient<PrismaClient>().profile.create({ data });
            await handleAfterCreate(createdData);
            return createdData;
        };
        const createList = (inputData: number | readonly Partial<Prisma.ProfileCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.ProfileCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "Profile" as const,
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
    const useTraits = (name: ProfileTraitKeys<TOptions>, ...names: readonly ProfileTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface ProfileFactoryBuilder {
    <TOptions extends ProfileFactoryDefineOptions>(options: TOptions): ProfileFactoryInterface<{}, TOptions>;
    withTransientFields: <TTransients extends Record<string, unknown>>(defaultTransientFieldValues: TTransients) => <TOptions extends ProfileFactoryDefineOptions<TTransients>>(options: TOptions) => ProfileFactoryInterface<TTransients, TOptions>;
}

/**
 * Define factory for {@link Profile} model.
 *
 * @param options
 * @returns factory {@link ProfileFactoryInterface}
 */
export const defineProfileFactory = (<TOptions extends ProfileFactoryDefineOptions>(options: TOptions): ProfileFactoryInterface<TOptions> => {
    return defineProfileFactoryInternal(options, {});
}) as ProfileFactoryBuilder;

defineProfileFactory.withTransientFields = defaultTransientFieldValues => options => defineProfileFactoryInternal(options, defaultTransientFieldValues);
