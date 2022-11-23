import { Prisma } from "./../client";
import type { PrismaClient } from "./../client";
import { getClient } from "@quramy/prisma-fabbrica/lib/clientHolder";
import scalarFieldValueGenerator from "@quramy/prisma-fabbrica/lib/scalar/gen";
import { Resolver, resolveValue } from "@quramy/prisma-fabbrica/lib/helpers";
export { initialize } from "@quramy/prisma-fabbrica";
type UserScalarOrEnumFields = {
    id: string;
    name: string;
};
type UserFactoryDefineInput = {
    id?: string;
    name?: string;
};
type UserFactoryDefineOptions = {
    defaultData?: Resolver<UserFactoryDefineInput>;
};
function autoGenerateUserScalarsOrEnums(): UserScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "id", isId: true, isUnique: false }),
        name: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "name", isId: false, isUnique: false })
    };
}
function defineUserFactoryInternal({ defaultData: defaultDataResolver }: UserFactoryDefineOptions) {
    const buildCreateInput = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const requiredScalarData = autoGenerateUserScalarsOrEnums();
        const defaultData = await resolveValue(defaultDataResolver ?? {});
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
export function defineUserFactory(args: UserFactoryDefineOptions = {}) {
    return defineUserFactoryInternal(args);
}
