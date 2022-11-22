import { Prisma } from "./client";
import type { PrismaClient } from "./client";
import { getClient } from "@quramy/prisma-fabbrica";
import scalarFieldValueGenerator from "@quramy/prisma-fabbrica/lib/scalar/gen";
import { Resolver, resolveValue } from "@quramy/prisma-fabbrica/lib/helpers";
type UserScalarOrEnumFields = {
    id: string;
    name: string;
};
type UserFactoryDefineInput = {
    id?: string;
    name?: string;
    profile?: Prisma.ProfileCreateNestedOneWithoutUserInput;
};
type UserFactoryDefineOptions = {
    defaultData: Resolver<UserFactoryDefineInput>;
};
function autoGenrateUserScalarsOrEnums(): UserScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "id", isId: true, isUnique: false }),
        name: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "name", isId: false, isUnique: false })
    };
}
export function defineUserFactory({ defaultData: defaultDataResolver }: UserFactoryDefineOptions) {
    const buildCreateInput = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const requiredScalarData = autoGenrateUserScalarsOrEnums();
        const defaultData = await resolveValue(defaultDataResolver);
        const defaultAssociations = {};
        const data: Prisma.UserCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const create = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const data = await buildCreateInput(inputData);
        return await getClient<PrismaClient>().user.create({ data });
    };
    return {
        _factoryFor: "User" as const,
        buildCreateInput,
        create,
    };
}
type ProfileScalarOrEnumFields = {
    id: string;
};
type ProfileuserFactory = {
    _factoryFor: "User";
    buildCreateInput: () => PromiseLike<Prisma.UserCreateNestedOneWithoutProfileInput["create"]>;
};
type ProfileFactoryDefineInput = {
    id?: string;
    user: ProfileuserFactory | Prisma.UserCreateNestedOneWithoutProfileInput;
};
type ProfileFactoryDefineOptions = {
    defaultData: Resolver<ProfileFactoryDefineInput>;
};
function isProfileuserFactory(x: ProfileuserFactory | Prisma.UserCreateNestedOneWithoutProfileInput): x is ProfileuserFactory {
    return (x as any)._factoryFor === "User";
}
function autoGenrateProfileScalarsOrEnums(): ProfileScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "Profile", fieldName: "id", isId: true, isUnique: false })
    };
}
export function defineProfileFactory({ defaultData: defaultDataResolver }: ProfileFactoryDefineOptions) {
    const buildCreateInput = async (inputData: Partial<Prisma.ProfileCreateInput> = {}) => {
        const requiredScalarData = autoGenrateProfileScalarsOrEnums();
        const defaultData = await resolveValue(defaultDataResolver);
        const defaultAssociations = {
            user: isProfileuserFactory(defaultData.user) ? { create: await defaultData.user.buildCreateInput() } : defaultData.user
        };
        const data: Prisma.ProfileCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const create = async (inputData: Partial<Prisma.ProfileCreateInput> = {}) => {
        const data = await buildCreateInput(inputData);
        return await getClient<PrismaClient>().profile.create({ data });
    };
    return {
        _factoryFor: "Profile" as const,
        buildCreateInput,
        create,
    };
}
