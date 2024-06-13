import type { Post } from "../client";
import type { Category } from "../client";
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

type PostFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<PostFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Post, Prisma.PostCreateInput, TTransients>;

type PostFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<PostFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: PostFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Post, Prisma.PostCreateInput, TTransients>;

type PostTraitKeys<TOptions extends PostFactoryDefineOptions<Record<string, unknown>>> = keyof TOptions["traits"];

export interface PostFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Post";
    build(inputData?: Partial<Prisma.PostCreateInput & TTransients>): PromiseLike<Prisma.PostCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PostCreateInput>): PromiseLike<Prisma.PostCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PostCreateInput>[]): PromiseLike<Prisma.PostCreateInput[]>;
    pickForConnect(inputData: Post): Pick<Post, "id">;
    create(inputData?: Partial<Prisma.PostCreateInput & TTransients>): PromiseLike<Post>;
    createList(inputData: number | readonly Partial<Prisma.PostCreateInput>[]): PromiseLike<Post[]>;
    createForConnect(inputData?: Partial<Prisma.PostCreateInput>): PromiseLike<Pick<Post, "id">>;
}

export interface PostFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends PostFactoryDefineOptions<any> = PostFactoryDefineOptions> extends PostFactoryInterfaceWithoutTraits<TTransients> {
    use(name: PostTraitKeys<TOptions>, ...names: readonly PostTraitKeys<TOptions>[]): PostFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGeneratePostScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PostScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "Post", fieldName: "id", isId: true, isUnique: false, seq }),
        title: getScalarFieldValueGenerator().String({ modelName: "Post", fieldName: "title", isId: false, isUnique: false, seq })
    };
}

function definePostFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends PostFactoryDefineOptions<any>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): PostFactoryInterface<TTransients, TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly PostTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Post", modelFieldDefinitions);
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
        const build = async (inputData: Partial<Prisma.PostCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePostScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<PostFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const transients = synthesize(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transients };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<PostFactoryDefineInput>, BuildDataOptions<any>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {};
            const data: Prisma.PostCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            await handleAfterBuild({ ...data, ...transients });
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.PostCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: Post) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.PostCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            await handleBeforeCreate(data);
            const createdData = await getClient<PrismaClient>().post.create({ data });
            await handleAfterCreate(createdData);
            return createdData;
        };
        const createList = (inputData: number | readonly Partial<Prisma.PostCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
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
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: PostTraitKeys<TOptions>, ...names: readonly PostTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface PostFactoryBuilder {
    <TOptions extends PostFactoryDefineOptions>(options?: TOptions): PostFactoryInterface<{}, TOptions>;
    withTransientFields: <TTransients extends Record<string, unknown>>(defaultTransientFieldValues: TTransients) => <TOptions extends PostFactoryDefineOptions<TTransients>>(options?: TOptions) => PostFactoryInterface<TTransients, TOptions>;
}

/**
 * Define factory for {@link Post} model.
 *
 * @param options
 * @returns factory {@link PostFactoryInterface}
 */
export const definePostFactory = (<TOptions extends PostFactoryDefineOptions>(options?: TOptions): PostFactoryInterface<TOptions> => {
    return definePostFactoryInternal(options ?? {}, {});
}) as PostFactoryBuilder;

definePostFactory.withTransientFields = defaultTransientFieldValues => options => definePostFactoryInternal(options ?? {}, defaultTransientFieldValues);

type CategoryScalarOrEnumFields = {
    id: string;
    name: string;
};

type CategoryFactoryDefineInput = {
    id?: string;
    name?: string;
    posts?: Prisma.PostCreateNestedManyWithoutCategoriesInput;
};

type CategoryFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<CategoryFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Category, Prisma.CategoryCreateInput, TTransients>;

type CategoryFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<CategoryFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: CategoryFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Category, Prisma.CategoryCreateInput, TTransients>;

type CategoryTraitKeys<TOptions extends CategoryFactoryDefineOptions<Record<string, unknown>>> = keyof TOptions["traits"];

export interface CategoryFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Category";
    build(inputData?: Partial<Prisma.CategoryCreateInput & TTransients>): PromiseLike<Prisma.CategoryCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.CategoryCreateInput>): PromiseLike<Prisma.CategoryCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.CategoryCreateInput>[]): PromiseLike<Prisma.CategoryCreateInput[]>;
    pickForConnect(inputData: Category): Pick<Category, "id">;
    create(inputData?: Partial<Prisma.CategoryCreateInput & TTransients>): PromiseLike<Category>;
    createList(inputData: number | readonly Partial<Prisma.CategoryCreateInput>[]): PromiseLike<Category[]>;
    createForConnect(inputData?: Partial<Prisma.CategoryCreateInput>): PromiseLike<Pick<Category, "id">>;
}

export interface CategoryFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends CategoryFactoryDefineOptions<any> = CategoryFactoryDefineOptions> extends CategoryFactoryInterfaceWithoutTraits<TTransients> {
    use(name: CategoryTraitKeys<TOptions>, ...names: readonly CategoryTraitKeys<TOptions>[]): CategoryFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateCategoryScalarsOrEnums({ seq }: {
    readonly seq: number;
}): CategoryScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "Category", fieldName: "id", isId: true, isUnique: false, seq }),
        name: getScalarFieldValueGenerator().String({ modelName: "Category", fieldName: "name", isId: false, isUnique: false, seq })
    };
}

function defineCategoryFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends CategoryFactoryDefineOptions<any>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): CategoryFactoryInterface<TTransients, TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly CategoryTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Category", modelFieldDefinitions);
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
        const build = async (inputData: Partial<Prisma.CategoryCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateCategoryScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<CategoryFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const transients = synthesize(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transients };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<CategoryFactoryDefineInput>, BuildDataOptions<any>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {};
            const data: Prisma.CategoryCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            await handleAfterBuild({ ...data, ...transients });
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.CategoryCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: Category) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.CategoryCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            await handleBeforeCreate(data);
            const createdData = await getClient<PrismaClient>().category.create({ data });
            await handleAfterCreate(createdData);
            return createdData;
        };
        const createList = (inputData: number | readonly Partial<Prisma.CategoryCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
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
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: CategoryTraitKeys<TOptions>, ...names: readonly CategoryTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface CategoryFactoryBuilder {
    <TOptions extends CategoryFactoryDefineOptions>(options?: TOptions): CategoryFactoryInterface<{}, TOptions>;
    withTransientFields: <TTransients extends Record<string, unknown>>(defaultTransientFieldValues: TTransients) => <TOptions extends CategoryFactoryDefineOptions<TTransients>>(options?: TOptions) => CategoryFactoryInterface<TTransients, TOptions>;
}

/**
 * Define factory for {@link Category} model.
 *
 * @param options
 * @returns factory {@link CategoryFactoryInterface}
 */
export const defineCategoryFactory = (<TOptions extends CategoryFactoryDefineOptions>(options?: TOptions): CategoryFactoryInterface<TOptions> => {
    return defineCategoryFactoryInternal(options ?? {}, {});
}) as CategoryFactoryBuilder;

defineCategoryFactory.withTransientFields = defaultTransientFieldValues => options => defineCategoryFactoryInternal(options ?? {}, defaultTransientFieldValues);
