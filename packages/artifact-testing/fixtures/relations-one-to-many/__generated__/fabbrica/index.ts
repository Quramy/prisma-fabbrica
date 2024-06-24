import type { User } from "../client";
import type { Post } from "../client";
import type { Review } from "../client";
import type { Prisma, PrismaClient } from "../client";
import { createInitializer, createScreener, getScalarFieldValueGenerator, normalizeResolver, normalizeList, getSequenceCounter, } from "@quramy/prisma-fabbrica/lib/internal";
import type { ModelWithFields, Resolver, } from "@quramy/prisma-fabbrica/lib/internal";
export { resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";

type BuildDataOptions = {
    readonly seq: number;
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

type UserFactoryDefineOptions = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

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
            const defaultAssociations = {};
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

type PostFactoryDefineOptions = {
    defaultData?: Resolver<PostFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<PostFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isPostauthorFactory(x: PostauthorFactory | Prisma.UserCreateNestedOneWithoutPostsInput | undefined): x is PostauthorFactory {
    return (x as any)?._factoryFor === "User";
}

type PostTraitKeys<TOptions extends PostFactoryDefineOptions> = keyof TOptions["traits"];

export interface PostFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "Post";
    build(inputData?: Partial<Prisma.PostCreateInput>): PromiseLike<Prisma.PostCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PostCreateInput>): PromiseLike<Prisma.PostCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PostCreateInput>[]): PromiseLike<Prisma.PostCreateInput[]>;
    pickForConnect(inputData: Post): Pick<Post, "id">;
    create(inputData?: Partial<Prisma.PostCreateInput>): PromiseLike<Post>;
    createList(inputData: number | readonly Partial<Prisma.PostCreateInput>[]): PromiseLike<Post[]>;
    createForConnect(inputData?: Partial<Prisma.PostCreateInput>): PromiseLike<Pick<Post, "id">>;
}

export interface PostFactoryInterface<TOptions extends PostFactoryDefineOptions = PostFactoryDefineOptions> extends PostFactoryInterfaceWithoutTraits {
    use(name: PostTraitKeys<TOptions>, ...names: readonly PostTraitKeys<TOptions>[]): PostFactoryInterfaceWithoutTraits;
}

function autoGeneratePostScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PostScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "Post", fieldName: "id", isId: true, isUnique: false, seq }),
        title: getScalarFieldValueGenerator().String({ modelName: "Post", fieldName: "title", isId: false, isUnique: false, seq })
    };
}

function definePostFactoryInternal<TOptions extends PostFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): PostFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly PostTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Post", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.PostCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePostScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<PostFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<PostFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                author: isPostauthorFactory(defaultData.author) ? {
                    create: await defaultData.author.build()
                } : defaultData.author
            };
            const data: Prisma.PostCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.PostCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: Post) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.PostCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().post.create({ data });
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

/**
 * Define factory for {@link Post} model.
 *
 * @param options
 * @returns factory {@link PostFactoryInterface}
 */
export function definePostFactory<TOptions extends PostFactoryDefineOptions>(options?: TOptions): PostFactoryInterface<TOptions> {
    return definePostFactoryInternal(options ?? {});
}

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

type ReviewFactoryDefineOptions = {
    defaultData: Resolver<ReviewFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<ReviewFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isReviewpostFactory(x: ReviewpostFactory | Prisma.PostCreateNestedOneWithoutReviewsInput | undefined): x is ReviewpostFactory {
    return (x as any)?._factoryFor === "Post";
}

function isReviewreviewerFactory(x: ReviewreviewerFactory | Prisma.UserCreateNestedOneWithoutReviewsInput | undefined): x is ReviewreviewerFactory {
    return (x as any)?._factoryFor === "User";
}

type ReviewTraitKeys<TOptions extends ReviewFactoryDefineOptions> = keyof TOptions["traits"];

export interface ReviewFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "Review";
    build(inputData?: Partial<Prisma.ReviewCreateInput>): PromiseLike<Prisma.ReviewCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.ReviewCreateInput>): PromiseLike<Prisma.ReviewCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.ReviewCreateInput>[]): PromiseLike<Prisma.ReviewCreateInput[]>;
    pickForConnect(inputData: Review): Pick<Review, "id">;
    create(inputData?: Partial<Prisma.ReviewCreateInput>): PromiseLike<Review>;
    createList(inputData: number | readonly Partial<Prisma.ReviewCreateInput>[]): PromiseLike<Review[]>;
    createForConnect(inputData?: Partial<Prisma.ReviewCreateInput>): PromiseLike<Pick<Review, "id">>;
}

export interface ReviewFactoryInterface<TOptions extends ReviewFactoryDefineOptions = ReviewFactoryDefineOptions> extends ReviewFactoryInterfaceWithoutTraits {
    use(name: ReviewTraitKeys<TOptions>, ...names: readonly ReviewTraitKeys<TOptions>[]): ReviewFactoryInterfaceWithoutTraits;
}

function autoGenerateReviewScalarsOrEnums({ seq }: {
    readonly seq: number;
}): ReviewScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "Review", fieldName: "id", isId: true, isUnique: false, seq }),
        body: getScalarFieldValueGenerator().String({ modelName: "Review", fieldName: "body", isId: false, isUnique: false, seq })
    };
}

function defineReviewFactoryInternal<TOptions extends ReviewFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): ReviewFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly ReviewTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Review", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.ReviewCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateReviewScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<ReviewFactoryDefineInput, BuildDataOptions>(defaultDataResolver);
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<ReviewFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                post: isReviewpostFactory(defaultData.post) ? {
                    create: await defaultData.post.build()
                } : defaultData.post,
                reviewer: isReviewreviewerFactory(defaultData.reviewer) ? {
                    create: await defaultData.reviewer.build()
                } : defaultData.reviewer
            };
            const data: Prisma.ReviewCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.ReviewCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: Review) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.ReviewCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().review.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.ReviewCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.ReviewCreateInput> = {}) => create(inputData).then(pickForConnect);
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

/**
 * Define factory for {@link Review} model.
 *
 * @param options
 * @returns factory {@link ReviewFactoryInterface}
 */
export function defineReviewFactory<TOptions extends ReviewFactoryDefineOptions>(options: TOptions): ReviewFactoryInterface<TOptions> {
    return defineReviewFactoryInternal(options);
}
