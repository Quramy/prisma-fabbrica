import type { User } from "./../client";
import type { Profile } from "./../client";
import { Prisma } from "./../client";
import type { PrismaClient } from "./../client";
import { getClient, ModelWithFields, createScreener, getScalarFieldValueGenerator, Resolver, normalizeResolver, normalizeList, getSequenceCounter, } from "@quramy/prisma-fabbrica/lib/internal";
export { initialize, resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";

type BuildDataOptions = {
    readonly seq: number;
};

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

type UserFactoryDefineOptions = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isUserprofileFactory(x: UserprofileFactory | Prisma.ProfileCreateNestedOneWithoutUserInput | undefined): x is UserprofileFactory {
    return (x as any)?._factoryFor === "Profile";
}

type UserTraitKeys<TOptions extends UserFactoryDefineOptions> = keyof TOptions["traits"];

export interface UserFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "User";
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

function defineUserFactoryInternal<TOptions extends UserFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): UserFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly UserTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("User", modelFieldDefinitions);
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
            const defaultAssociations = {
                profile: isUserprofileFactory(defaultData.profile) ? {
                    create: await defaultData.profile.build()
                } : defaultData.profile
            };
            const data: Prisma.UserCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.UserCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: User) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().user.create({ data });
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

/**
 * Define factory for {@link User} model.
 *
 * @param options
 * @returns factory {@link UserFactoryInterface}
 */
export function defineUserFactory<TOptions extends UserFactoryDefineOptions>(options?: TOptions): UserFactoryInterface<TOptions> {
    return defineUserFactoryInternal(options ?? {});
}

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

type ProfileFactoryDefineOptions = {
    defaultData: Resolver<ProfileFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<ProfileFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isProfileuserFactory(x: ProfileuserFactory | Prisma.UserCreateNestedOneWithoutProfileInput | undefined): x is ProfileuserFactory {
    return (x as any)?._factoryFor === "User";
}

type ProfileTraitKeys<TOptions extends ProfileFactoryDefineOptions> = keyof TOptions["traits"];

export interface ProfileFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "Profile";
    build(inputData?: Partial<Prisma.ProfileCreateInput>): PromiseLike<Prisma.ProfileCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.ProfileCreateInput>): PromiseLike<Prisma.ProfileCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.ProfileCreateInput>[]): PromiseLike<Prisma.ProfileCreateInput[]>;
    pickForConnect(inputData: Profile): Pick<Profile, "id">;
    create(inputData?: Partial<Prisma.ProfileCreateInput>): PromiseLike<Profile>;
    createList(inputData: number | readonly Partial<Prisma.ProfileCreateInput>[]): PromiseLike<Profile[]>;
    createForConnect(inputData?: Partial<Prisma.ProfileCreateInput>): PromiseLike<Pick<Profile, "id">>;
}

export interface ProfileFactoryInterface<TOptions extends ProfileFactoryDefineOptions = ProfileFactoryDefineOptions> extends ProfileFactoryInterfaceWithoutTraits {
    use(name: ProfileTraitKeys<TOptions>, ...names: readonly ProfileTraitKeys<TOptions>[]): ProfileFactoryInterfaceWithoutTraits;
}

function autoGenerateProfileScalarsOrEnums({ seq }: {
    readonly seq: number;
}): ProfileScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "Profile", fieldName: "id", isId: true, isUnique: false, seq })
    };
}

function defineProfileFactoryInternal<TOptions extends ProfileFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): ProfileFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly ProfileTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Profile", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.ProfileCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateProfileScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<ProfileFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<ProfileFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                user: isProfileuserFactory(defaultData.user) ? {
                    create: await defaultData.user.build()
                } : defaultData.user
            };
            const data: Prisma.ProfileCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.ProfileCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: Profile) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.ProfileCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().profile.create({ data });
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

/**
 * Define factory for {@link Profile} model.
 *
 * @param options
 * @returns factory {@link ProfileFactoryInterface}
 */
export function defineProfileFactory<TOptions extends ProfileFactoryDefineOptions>(options: TOptions): ProfileFactoryInterface<TOptions> {
    return defineProfileFactoryInternal(options);
}
