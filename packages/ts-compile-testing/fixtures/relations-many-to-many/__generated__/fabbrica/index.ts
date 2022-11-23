import { Prisma } from "./../client";
import type { PrismaClient } from "./../client";
import { getClient } from "@quramy/prisma-fabbrica/lib/clientHolder";
import scalarFieldValueGenerator from "@quramy/prisma-fabbrica/lib/scalar/gen";
import { Resolver, resolveValue } from "@quramy/prisma-fabbrica/lib/helpers";
export { initialize } from "@quramy/prisma-fabbrica";
type PostScalarOrEnumFields = {
    id: string;
    title: string;
};
type PostFactoryDefineInput = {
    id?: string;
    title?: string;
    categories?: Prisma.CategoryCreateNestedManyWithoutPostsInput;
};
type PostFactoryDefineOptions = {
    defaultData?: Resolver<PostFactoryDefineInput>;
};
function autoGeneratePostScalarsOrEnums(): PostScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "Post", fieldName: "id", isId: true, isUnique: false }),
        title: scalarFieldValueGenerator.String({ modelName: "Post", fieldName: "title", isId: false, isUnique: false })
    };
}
function definePostFactoryInternal({ defaultData: defaultDataResolver }: PostFactoryDefineOptions) {
    const buildCreateInput = async (inputData: Partial<Prisma.PostCreateInput> = {}) => {
        const requiredScalarData = autoGeneratePostScalarsOrEnums();
        const defaultData = await resolveValue(defaultDataResolver ?? {});
        const defaultAssociations = {};
        const data: Prisma.PostCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const create = async (inputData: Partial<Prisma.PostCreateInput> = {}) => {
        const data = await buildCreateInput(inputData);
        return await getClient<PrismaClient>().post.create({ data });
    };
    return {
        _factoryFor: "Post" as const,
        buildCreateInput,
        create,
    };
}
export function definePostFactory(args: PostFactoryDefineOptions = {}) {
    return definePostFactoryInternal(args);
}
type CategoryScalarOrEnumFields = {
    id: string;
    name: string;
};
type CategoryFactoryDefineInput = {
    id?: string;
    name?: string;
    posts?: Prisma.PostCreateNestedManyWithoutCategoriesInput;
};
type CategoryFactoryDefineOptions = {
    defaultData?: Resolver<CategoryFactoryDefineInput>;
};
function autoGenerateCategoryScalarsOrEnums(): CategoryScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "Category", fieldName: "id", isId: true, isUnique: false }),
        name: scalarFieldValueGenerator.String({ modelName: "Category", fieldName: "name", isId: false, isUnique: false })
    };
}
function defineCategoryFactoryInternal({ defaultData: defaultDataResolver }: CategoryFactoryDefineOptions) {
    const buildCreateInput = async (inputData: Partial<Prisma.CategoryCreateInput> = {}) => {
        const requiredScalarData = autoGenerateCategoryScalarsOrEnums();
        const defaultData = await resolveValue(defaultDataResolver ?? {});
        const defaultAssociations = {};
        const data: Prisma.CategoryCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const create = async (inputData: Partial<Prisma.CategoryCreateInput> = {}) => {
        const data = await buildCreateInput(inputData);
        return await getClient<PrismaClient>().category.create({ data });
    };
    return {
        _factoryFor: "Category" as const,
        buildCreateInput,
        create,
    };
}
export function defineCategoryFactory(args: CategoryFactoryDefineOptions = {}) {
    return defineCategoryFactoryInternal(args);
}
