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
    const create = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const requiredScalarData = autoGenrateUserScalarsOrEnums();
        const defaultData = await resolveValue(defaultDataResolver);
        const data = { ...requiredScalarData, ...defaultData, ...inputData };
        return await getClient<PrismaClient>().user.create({ data });
    };
    return { create };
}
