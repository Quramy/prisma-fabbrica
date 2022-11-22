import { Role } from "./client";
import { Prisma } from "./client";
import type { PrismaClient } from "./client";
import { getClient } from "@quramy/prisma-fabbrica";
import scalarFieldValueGenerator from "@quramy/prisma-fabbrica/lib/scalar/gen";
import { Resolver, resolveValue } from "@quramy/prisma-fabbrica/lib/helpers";
type UserScalarOrEnumFields = {
    id: string;
    role: Role;
};
type UserFactoryDefineInput = {
    id?: string;
    role?: Role;
    roleDefault?: Role;
    roles?: Prisma.UserCreaterolesInput | Prisma.Enumerable<Role>;
};
type UserFactoryDefineOptions = {
    defaultData: Resolver<UserFactoryDefineInput>;
};
function autoGenrateUserScalarsOrEnums(): UserScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "id", isId: true, isUnique: false }),
        role: "USER"
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
