import { User } from "./../client";
import { Profile } from "./../client";
import { Prisma } from "./../client";
import type { PrismaClient } from "./../client";
import { getClient, ModelWithFields, createScreener, scalarFieldValueGenerator, Resolver, normalizeResolver, normalizeList, getSequenceCounter, } from "@quramy/prisma-fabbrica/lib/internal";
export { initialize, resetSequence } from "@quramy/prisma-fabbrica/lib/internal";
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
};
function isUserprofileFactory(x: UserprofileFactory | Prisma.ProfileCreateNestedOneWithoutUserInput | undefined): x is UserprofileFactory {
    return (x as any)?._factoryFor === "Profile";
}
function autoGenerateUserScalarsOrEnums({ seq }: {
    readonly seq: number;
}): UserScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
        name: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "name", isId: false, isUnique: false, seq })
    };
}
function defineUserFactoryInternal({ defaultData: defaultDataResolver }: UserFactoryDefineOptions) {
    const seqKey = {};
    const getSeq = () => getSequenceCounter(seqKey);
    const screen = createScreener("User", modelFieldDefinitions);
    const build = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateUserScalarsOrEnums({ seq });
        const resolveValue = normalizeResolver<UserFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
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
}
export function defineUserFactory(args: UserFactoryDefineOptions = {}) {
    return defineUserFactoryInternal(args);
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
};
function isProfileuserFactory(x: ProfileuserFactory | Prisma.UserCreateNestedOneWithoutProfileInput | undefined): x is ProfileuserFactory {
    return (x as any)?._factoryFor === "User";
}
function autoGenerateProfileScalarsOrEnums({ seq }: {
    readonly seq: number;
}): ProfileScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "Profile", fieldName: "id", isId: true, isUnique: false, seq })
    };
}
function defineProfileFactoryInternal({ defaultData: defaultDataResolver }: ProfileFactoryDefineOptions) {
    const seqKey = {};
    const getSeq = () => getSequenceCounter(seqKey);
    const screen = createScreener("Profile", modelFieldDefinitions);
    const build = async (inputData: Partial<Prisma.ProfileCreateInput> = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateProfileScalarsOrEnums({ seq });
        const resolveValue = normalizeResolver<ProfileFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
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
}
export function defineProfileFactory(args: ProfileFactoryDefineOptions) {
    return defineProfileFactoryInternal(args);
}
