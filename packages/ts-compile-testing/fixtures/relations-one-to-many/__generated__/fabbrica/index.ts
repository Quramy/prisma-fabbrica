import { User } from "./../client";
import { Post } from "./../client";
import { Review } from "./../client";
import { Prisma } from "./../client";
import type { PrismaClient } from "./../client";
import { getClient } from "@quramy/prisma-fabbrica/lib/clientHolder";
import { ModelWithFields, createScreener } from "@quramy/prisma-fabbrica/lib/relations";
import scalarFieldValueGenerator from "@quramy/prisma-fabbrica/lib/scalar/gen";
import { Resolver, normalizeResolver, getSequenceCounter } from "@quramy/prisma-fabbrica/lib/helpers";
export { initialize, resetSequence } from "@quramy/prisma-fabbrica";
type BuildDataOptions = {
    readonly seq: number;
};
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
type UserFactoryTraitOptions = {
    data: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions>;
};
type UserFactoryDefineOptions = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions>;
    traits?: Record<string, UserFactoryTraitOptions>;
};
function autoGenerateUserScalarsOrEnums({ seq }: {
    readonly seq: number;
}): UserScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
        name: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "name", isId: false, isUnique: false, seq })
    };
}
function defineUserFactoryInternal<TOptions extends UserFactoryDefineOptions, TTraitKey extends keyof TOptions["traits"]>({ defaultData: defaultDataResolver }: TOptions) {
    const seqKey = {};
    const getSeq = () => getSequenceCounter(seqKey);
    const screen = createScreener("User", modelFieldDefinitions);
    const build = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateUserScalarsOrEnums({ seq });
        const resolveValue = normalizeResolver<UserFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
        const defaultAssociations = {};
        const data: Prisma.UserCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const buildList = (inputData: number | Partial<Prisma.UserCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => build(data)));
    };
    const pickForConnect = (inputData: User) => ({
        id: inputData.id
    });
    const create = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const data = await build(inputData).then(screen);
        return await getClient<PrismaClient>().user.create({ data });
    };
    const createList = (inputData: number | Partial<Prisma.UserCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => create(data)));
    };
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
export function defineUserFactory<TOptions extends UserFactoryDefineOptions, TTraitKey extends keyof TOptions["traits"]>(args?: TOptions) {
    return defineUserFactoryInternal<TOptions, TTraitKey>(args ?? ({} as TOptions));
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
type PostFactoryTraitOptions = {
    data: Resolver<Partial<PostFactoryDefineInput>, BuildDataOptions>;
};
type PostFactoryDefineOptions = {
    defaultData?: Resolver<PostFactoryDefineInput, BuildDataOptions>;
    traits?: Record<string, PostFactoryTraitOptions>;
};
function isPostauthorFactory(x: PostauthorFactory | Prisma.UserCreateNestedOneWithoutPostsInput | undefined): x is PostauthorFactory {
    return (x as any)?._factoryFor === "User";
}
function autoGeneratePostScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PostScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "Post", fieldName: "id", isId: true, isUnique: false, seq }),
        title: scalarFieldValueGenerator.String({ modelName: "Post", fieldName: "title", isId: false, isUnique: false, seq })
    };
}
function definePostFactoryInternal<TOptions extends PostFactoryDefineOptions, TTraitKey extends keyof TOptions["traits"]>({ defaultData: defaultDataResolver }: TOptions) {
    const seqKey = {};
    const getSeq = () => getSequenceCounter(seqKey);
    const screen = createScreener("Post", modelFieldDefinitions);
    const build = async (inputData: Partial<Prisma.PostCreateInput> = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGeneratePostScalarsOrEnums({ seq });
        const resolveValue = normalizeResolver<PostFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
        const defaultAssociations = {
            author: isPostauthorFactory(defaultData.author) ? {
                create: await defaultData.author.build()
            } : defaultData.author
        };
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
export function definePostFactory<TOptions extends PostFactoryDefineOptions, TTraitKey extends keyof TOptions["traits"]>(args?: TOptions) {
    return definePostFactoryInternal<TOptions, TTraitKey>(args ?? ({} as TOptions));
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
type ReviewFactoryTraitOptions = {
    data: Resolver<Partial<ReviewFactoryDefineInput>, BuildDataOptions>;
};
type ReviewFactoryDefineOptions = {
    defaultData: Resolver<ReviewFactoryDefineInput, BuildDataOptions>;
    traits?: ReviewFactoryTraitOptions;
};
function isReviewpostFactory(x: ReviewpostFactory | Prisma.PostCreateNestedOneWithoutReviewsInput | undefined): x is ReviewpostFactory {
    return (x as any)?._factoryFor === "Post";
}
function isReviewreviewerFactory(x: ReviewreviewerFactory | Prisma.UserCreateNestedOneWithoutReviewsInput | undefined): x is ReviewreviewerFactory {
    return (x as any)?._factoryFor === "User";
}
function autoGenerateReviewScalarsOrEnums({ seq }: {
    readonly seq: number;
}): ReviewScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "Review", fieldName: "id", isId: true, isUnique: false, seq }),
        body: scalarFieldValueGenerator.String({ modelName: "Review", fieldName: "body", isId: false, isUnique: false, seq })
    };
}
function defineReviewFactoryInternal<TOptions extends ReviewFactoryDefineOptions, TTraitKey extends keyof TOptions["traits"]>({ defaultData: defaultDataResolver }: TOptions) {
    const seqKey = {};
    const getSeq = () => getSequenceCounter(seqKey);
    const screen = createScreener("Review", modelFieldDefinitions);
    const build = async (inputData: Partial<Prisma.ReviewCreateInput> = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateReviewScalarsOrEnums({ seq });
        const resolveValue = normalizeResolver<ReviewFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
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
    const buildList = (inputData: number | Partial<Prisma.ReviewCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => build(data)));
    };
    const pickForConnect = (inputData: Review) => ({
        id: inputData.id
    });
    const create = async (inputData: Partial<Prisma.ReviewCreateInput> = {}) => {
        const data = await build(inputData).then(screen);
        return await getClient<PrismaClient>().review.create({ data });
    };
    const createList = (inputData: number | Partial<Prisma.ReviewCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => create(data)));
    };
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
}
export function defineReviewFactory<TOptions extends ReviewFactoryDefineOptions, TTraitKey extends keyof TOptions["traits"]>(args: TOptions) {
    return defineReviewFactoryInternal<TOptions, TTraitKey>(args);
}
