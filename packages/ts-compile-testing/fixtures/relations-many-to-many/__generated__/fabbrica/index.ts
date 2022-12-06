import { Post } from "./../client";
import { Category } from "./../client";
import { Prisma } from "./../client";
import type { PrismaClient } from "./../client";
import { getClient, ModelWithFields, createScreener, scalarFieldValueGenerator, Resolver, normalizeResolver, getSequenceCounter, } from "@quramy/prisma-fabbrica/lib/internal";
export { initialize, resetSequence } from "@quramy/prisma-fabbrica/lib/internal";
type BuildDataOptions = {
    readonly seq: number;
};
const modelFieldDefinitions: ModelWithFields[] = [{
        name: "Post",
        fields: [{
                name: "categories",
                type: "Category",
                relationName: "CategoryToPost"
            }]
    }, {
        name: "Category",
        fields: [{
                name: "posts",
                type: "Post",
                relationName: "CategoryToPost"
            }]
    }];
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
    defaultData?: Resolver<PostFactoryDefineInput, BuildDataOptions>;
};
function autoGeneratePostScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PostScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "Post", fieldName: "id", isId: true, isUnique: false, seq }),
        title: scalarFieldValueGenerator.String({ modelName: "Post", fieldName: "title", isId: false, isUnique: false, seq })
    };
}
function definePostFactoryInternal({ defaultData: defaultDataResolver }: PostFactoryDefineOptions) {
    const seqKey = {};
    const getSeq = () => getSequenceCounter(seqKey);
    const screen = createScreener("Post", modelFieldDefinitions);
    const build = async (inputData: Partial<Prisma.PostCreateInput> = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGeneratePostScalarsOrEnums({ seq });
        const resolveValue = normalizeResolver<PostFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
        const defaultAssociations = {};
        const data: Prisma.PostCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const buildList = (inputData: number | Partial<Prisma.PostCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => build(data)));
    };
    const pickForConnect = (inputData: Post) => ({
        id: inputData.id
    });
    const create = async (inputData: Partial<Prisma.PostCreateInput> = {}) => {
        const data = await build(inputData).then(screen);
        return await getClient<PrismaClient>().post.create({ data });
    };
    const createList = (inputData: number | Partial<Prisma.PostCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => create(data)));
    };
    const createForConnect = (inputData: Partial<Prisma.PostCreateInput> = {}) => create(inputData).then(pickForConnect);
    return {
        _factoryFor: "Post" as const,
        build,
        buildList,
        buildCreateInput: build,
        pickForConnect,
        create,
        createList,
        createForConnect,
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
    defaultData?: Resolver<CategoryFactoryDefineInput, BuildDataOptions>;
};
function autoGenerateCategoryScalarsOrEnums({ seq }: {
    readonly seq: number;
}): CategoryScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "Category", fieldName: "id", isId: true, isUnique: false, seq }),
        name: scalarFieldValueGenerator.String({ modelName: "Category", fieldName: "name", isId: false, isUnique: false, seq })
    };
}
function defineCategoryFactoryInternal({ defaultData: defaultDataResolver }: CategoryFactoryDefineOptions) {
    const seqKey = {};
    const getSeq = () => getSequenceCounter(seqKey);
    const screen = createScreener("Category", modelFieldDefinitions);
    const build = async (inputData: Partial<Prisma.CategoryCreateInput> = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateCategoryScalarsOrEnums({ seq });
        const resolveValue = normalizeResolver<CategoryFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
        const defaultAssociations = {};
        const data: Prisma.CategoryCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const buildList = (inputData: number | Partial<Prisma.CategoryCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => build(data)));
    };
    const pickForConnect = (inputData: Category) => ({
        id: inputData.id
    });
    const create = async (inputData: Partial<Prisma.CategoryCreateInput> = {}) => {
        const data = await build(inputData).then(screen);
        return await getClient<PrismaClient>().category.create({ data });
    };
    const createList = (inputData: number | Partial<Prisma.CategoryCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => create(data)));
    };
    const createForConnect = (inputData: Partial<Prisma.CategoryCreateInput> = {}) => create(inputData).then(pickForConnect);
    return {
        _factoryFor: "Category" as const,
        build,
        buildList,
        buildCreateInput: build,
        pickForConnect,
        create,
        createList,
        createForConnect,
    };
}
export function defineCategoryFactory(args: CategoryFactoryDefineOptions = {}) {
    return defineCategoryFactoryInternal(args);
}
