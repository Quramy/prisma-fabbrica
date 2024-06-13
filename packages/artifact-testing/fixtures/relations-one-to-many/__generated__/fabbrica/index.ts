import type { User } from "../client";
import type { Post } from "../client";
import type { Review } from "../client";
import type { Prisma, PrismaClient } from "../client";
import { createInitializer, createScreener, getScalarFieldValueGenerator, normalizeResolver, normalizeList, getSequenceCounter, createCallbackChain, synthesize, } from "@quramy/prisma-fabbrica/lib/internal";
import type { ModelWithFields, Resolver, } from "@quramy/prisma-fabbrica/lib/internal";
export { resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";

type BuildDataOptions<TTransients extends Record<string, unknown>> = {
    readonly seq: number;
} & TTransients;

type CallbackDefineOptions<TCreated, TCreateInput, TTransients extends Record<string, unknown>> = {
    onAfterBuild?: (createInput: TCreateInput, transientFields: TTransients) => void | PromiseLike<void>;
    onBeforeCreate?: (createInput: TCreateInput, transientFields: TTransients) => void | PromiseLike<void>;
    onAfterCreate?: (created: TCreated, transientFields: TTransients) => void | PromiseLike<void>;
};

const initializer = createInitializer();

const { getClient } = initializer;

export const { initialize } = initializer;

const modelFieldDefinitions: ModelWithFields[] = [{
        name: "User",
        fields: [{
                name: "posts",
                type: "Post",
                relationName: "PostToUser"
            }, {
                name: "reviews",
                type: "Review",
                relationName: "ReviewToUser"
            }]
    }, {
        name: "Post",
        fields: [{
                name: "author",
                type: "User",
                relationName: "PostToUser"
            }, {
                name: "reviews",
                type: "Review",
                relationName: "PostToReview"
            }]
    }, {
        name: "Review",
        fields: [{
                name: "post",
                type: "Post",
                relationName: "PostToReview"
            }, {
                name: "reviewer",
                type: "User",
                relationName: "ReviewToUser"
            }]
    }];

type UserScalarOrEnumFields = {
    id: string;
    name: string;
};

type UserFactoryDefineInput = {
    id?: string;
    name?: string;
    posts?: Prisma.PostCreateNestedManyWithoutAuthorInput;
    reviews?: Prisma.ReviewCreateNestedManyWithoutReviewerInput;
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

type UserTraitKeys<TOptions extends UserFactoryDefineOptions<any>> = keyof TOptions["traits"];

export interface UserFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "User";
    build(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.UserCreateInput & TTransients>[]): PromiseLike<Prisma.UserCreateInput[]>;
    pickForConnect(inputData: User): Pick<User, "id">;
    create(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<User>;
    createList(inputData: number | readonly Partial<Prisma.UserCreateInput & TTransients>[]): PromiseLike<User[]>;
    createForConnect(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Pick<User, "id">>;
}

export interface UserFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends UserFactoryDefineOptions<TTransients> = UserFactoryDefineOptions<TTransients>> extends UserFactoryInterfaceWithoutTraits<TTransients> {
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

function defineUserFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends UserFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): UserFactoryInterface<TTransients, TOptions> {
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
        const build = async (inputData: Partial<Prisma.UserCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateUserScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<UserFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const [transientFields, filteredInputData] = synthesize(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<UserFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {};
            const data: Prisma.UserCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.UserCreateInput & TTransients>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: User) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.UserCreateInput & TTransients> = {}) => {
            const [transientFields] = synthesize(defaultTransientFieldValues, inputData);
            const data = await build(inputData).then(screen);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().user.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (inputData: number | readonly Partial<Prisma.UserCreateInput & TTransients>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.UserCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
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

type PostScalarOrEnumFields = {
    id: string;
    title: string;
};

type PostauthorFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPostsInput["create"]>;
};

type PostFactoryDefineInput = {
    id?: string;
    title?: string;
    author?: PostauthorFactory | Prisma.UserCreateNestedOneWithoutPostsInput;
    reviews?: Prisma.ReviewCreateNestedManyWithoutPostInput;
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

function isPostauthorFactory(x: PostauthorFactory | Prisma.UserCreateNestedOneWithoutPostsInput | undefined): x is PostauthorFactory {
    return (x as any)?._factoryFor === "User";
}

type PostTraitKeys<TOptions extends PostFactoryDefineOptions<any>> = keyof TOptions["traits"];

export interface PostFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Post";
    build(inputData?: Partial<Prisma.PostCreateInput & TTransients>): PromiseLike<Prisma.PostCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PostCreateInput & TTransients>): PromiseLike<Prisma.PostCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PostCreateInput & TTransients>[]): PromiseLike<Prisma.PostCreateInput[]>;
    pickForConnect(inputData: Post): Pick<Post, "id">;
    create(inputData?: Partial<Prisma.PostCreateInput & TTransients>): PromiseLike<Post>;
    createList(inputData: number | readonly Partial<Prisma.PostCreateInput & TTransients>[]): PromiseLike<Post[]>;
    createForConnect(inputData?: Partial<Prisma.PostCreateInput & TTransients>): PromiseLike<Pick<Post, "id">>;
}

export interface PostFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends PostFactoryDefineOptions<TTransients> = PostFactoryDefineOptions<TTransients>> extends PostFactoryInterfaceWithoutTraits<TTransients> {
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

function definePostFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends PostFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): PostFactoryInterface<TTransients, TOptions> {
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
        const build = async (inputData: Partial<Prisma.PostCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePostScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<PostFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const [transientFields, filteredInputData] = synthesize(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<PostFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {
                author: isPostauthorFactory(defaultData.author) ? {
                    create: await defaultData.author.build()
                } : defaultData.author
            };
            const data: Prisma.PostCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.PostCreateInput & TTransients>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: Post) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.PostCreateInput & TTransients> = {}) => {
            const [transientFields] = synthesize(defaultTransientFieldValues, inputData);
            const data = await build(inputData).then(screen);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().post.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (inputData: number | readonly Partial<Prisma.PostCreateInput & TTransients>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.PostCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
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

type ReviewScalarOrEnumFields = {
    id: string;
    body: string;
};

type ReviewpostFactory = {
    _factoryFor: "Post";
    build: () => PromiseLike<Prisma.PostCreateNestedOneWithoutReviewsInput["create"]>;
};

type ReviewreviewerFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutReviewsInput["create"]>;
};

type ReviewFactoryDefineInput = {
    id?: string;
    body?: string;
    post: ReviewpostFactory | Prisma.PostCreateNestedOneWithoutReviewsInput;
    reviewer: ReviewreviewerFactory | Prisma.UserCreateNestedOneWithoutReviewsInput;
};

type ReviewFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<ReviewFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Review, Prisma.ReviewCreateInput, TTransients>;

type ReviewFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData: Resolver<ReviewFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: ReviewFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Review, Prisma.ReviewCreateInput, TTransients>;

function isReviewpostFactory(x: ReviewpostFactory | Prisma.PostCreateNestedOneWithoutReviewsInput | undefined): x is ReviewpostFactory {
    return (x as any)?._factoryFor === "Post";
}

function isReviewreviewerFactory(x: ReviewreviewerFactory | Prisma.UserCreateNestedOneWithoutReviewsInput | undefined): x is ReviewreviewerFactory {
    return (x as any)?._factoryFor === "User";
}

type ReviewTraitKeys<TOptions extends ReviewFactoryDefineOptions<any>> = keyof TOptions["traits"];

export interface ReviewFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Review";
    build(inputData?: Partial<Prisma.ReviewCreateInput & TTransients>): PromiseLike<Prisma.ReviewCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.ReviewCreateInput & TTransients>): PromiseLike<Prisma.ReviewCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.ReviewCreateInput & TTransients>[]): PromiseLike<Prisma.ReviewCreateInput[]>;
    pickForConnect(inputData: Review): Pick<Review, "id">;
    create(inputData?: Partial<Prisma.ReviewCreateInput & TTransients>): PromiseLike<Review>;
    createList(inputData: number | readonly Partial<Prisma.ReviewCreateInput & TTransients>[]): PromiseLike<Review[]>;
    createForConnect(inputData?: Partial<Prisma.ReviewCreateInput & TTransients>): PromiseLike<Pick<Review, "id">>;
}

export interface ReviewFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends ReviewFactoryDefineOptions<TTransients> = ReviewFactoryDefineOptions<TTransients>> extends ReviewFactoryInterfaceWithoutTraits<TTransients> {
    use(name: ReviewTraitKeys<TOptions>, ...names: readonly ReviewTraitKeys<TOptions>[]): ReviewFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateReviewScalarsOrEnums({ seq }: {
    readonly seq: number;
}): ReviewScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "Review", fieldName: "id", isId: true, isUnique: false, seq }),
        body: getScalarFieldValueGenerator().String({ modelName: "Review", fieldName: "body", isId: false, isUnique: false, seq })
    };
}

function defineReviewFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends ReviewFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): ReviewFactoryInterface<TTransients, TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly ReviewTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Review", modelFieldDefinitions);
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
        const build = async (inputData: Partial<Prisma.ReviewCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateReviewScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<ReviewFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver);
            const [transientFields, filteredInputData] = synthesize(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<ReviewFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {
                post: isReviewpostFactory(defaultData.post) ? {
                    create: await defaultData.post.build()
                } : defaultData.post,
                reviewer: isReviewreviewerFactory(defaultData.reviewer) ? {
                    create: await defaultData.reviewer.build()
                } : defaultData.reviewer
            };
            const data: Prisma.ReviewCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.ReviewCreateInput & TTransients>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: Review) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.ReviewCreateInput & TTransients> = {}) => {
            const [transientFields] = synthesize(defaultTransientFieldValues, inputData);
            const data = await build(inputData).then(screen);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().review.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (inputData: number | readonly Partial<Prisma.ReviewCreateInput & TTransients>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.ReviewCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "Review" as const,
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
    const useTraits = (name: ReviewTraitKeys<TOptions>, ...names: readonly ReviewTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface ReviewFactoryBuilder {
    <TOptions extends ReviewFactoryDefineOptions>(options: TOptions): ReviewFactoryInterface<{}, TOptions>;
    withTransientFields: <TTransients extends Record<string, unknown>>(defaultTransientFieldValues: TTransients) => <TOptions extends ReviewFactoryDefineOptions<TTransients>>(options: TOptions) => ReviewFactoryInterface<TTransients, TOptions>;
}

/**
 * Define factory for {@link Review} model.
 *
 * @param options
 * @returns factory {@link ReviewFactoryInterface}
 */
export const defineReviewFactory = (<TOptions extends ReviewFactoryDefineOptions>(options: TOptions): ReviewFactoryInterface<TOptions> => {
    return defineReviewFactoryInternal(options, {});
}) as ReviewFactoryBuilder;

defineReviewFactory.withTransientFields = defaultTransientFieldValues => options => defineReviewFactoryInternal(options, defaultTransientFieldValues);
