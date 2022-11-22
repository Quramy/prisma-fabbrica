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
    posts?: Prisma.PostCreateNestedManyWithoutAuthorInput;
    reviews?: Prisma.ReviewCreateNestedManyWithoutReviewerInput;
};
type UserFactoryDefineOptions = {
    defaultData?: Resolver<UserFactoryDefineInput>;
};
function autoGenrateUserScalarsOrEnums(): UserScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "id", isId: true, isUnique: false }),
        name: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "name", isId: false, isUnique: false })
    };
}
function defineUserFactoryInternal({ defaultData: defaultDataResolver }: UserFactoryDefineOptions) {
    const buildCreateInput = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const requiredScalarData = autoGenrateUserScalarsOrEnums();
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
type PostScalarOrEnumFields = {
    id: string;
    title: string;
};
type PostFactoryDefineInput = {
    id?: string;
    title?: string;
    author?: Prisma.UserCreateNestedOneWithoutPostsInput;
    reviews?: Prisma.ReviewCreateNestedManyWithoutPostInput;
};
type PostFactoryDefineOptions = {
    defaultData?: Resolver<PostFactoryDefineInput>;
};
function autoGenratePostScalarsOrEnums(): PostScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "Post", fieldName: "id", isId: true, isUnique: false }),
        title: scalarFieldValueGenerator.String({ modelName: "Post", fieldName: "title", isId: false, isUnique: false })
    };
}
function definePostFactoryInternal({ defaultData: defaultDataResolver }: PostFactoryDefineOptions) {
    const buildCreateInput = async (inputData: Partial<Prisma.PostCreateInput> = {}) => {
        const requiredScalarData = autoGenratePostScalarsOrEnums();
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
type ReviewScalarOrEnumFields = {
    id: string;
    body: string;
};
type ReviewpostFactory = {
    _factoryFor: "Post";
    buildCreateInput: () => PromiseLike<Prisma.PostCreateNestedOneWithoutReviewsInput["create"]>;
};
type ReviewreviewerFactory = {
    _factoryFor: "User";
    buildCreateInput: () => PromiseLike<Prisma.UserCreateNestedOneWithoutReviewsInput["create"]>;
};
type ReviewFactoryDefineInput = {
    id?: string;
    body?: string;
    post: ReviewpostFactory | Prisma.PostCreateNestedOneWithoutReviewsInput;
    reviewer: ReviewreviewerFactory | Prisma.UserCreateNestedOneWithoutReviewsInput;
};
type ReviewFactoryDefineOptions = {
    defaultData: Resolver<ReviewFactoryDefineInput>;
};
function isReviewpostFactory(x: ReviewpostFactory | Prisma.PostCreateNestedOneWithoutReviewsInput): x is ReviewpostFactory {
    return (x as any)._factoryFor === "Post";
}
function isReviewreviewerFactory(x: ReviewreviewerFactory | Prisma.UserCreateNestedOneWithoutReviewsInput): x is ReviewreviewerFactory {
    return (x as any)._factoryFor === "User";
}
function autoGenrateReviewScalarsOrEnums(): ReviewScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "Review", fieldName: "id", isId: true, isUnique: false }),
        body: scalarFieldValueGenerator.String({ modelName: "Review", fieldName: "body", isId: false, isUnique: false })
    };
}
function defineReviewFactoryInternal({ defaultData: defaultDataResolver }: ReviewFactoryDefineOptions) {
    const buildCreateInput = async (inputData: Partial<Prisma.ReviewCreateInput> = {}) => {
        const requiredScalarData = autoGenrateReviewScalarsOrEnums();
        const defaultData = await resolveValue(defaultDataResolver ?? {});
        const defaultAssociations = {
            post: isReviewpostFactory(defaultData.post) ? {
                create: await defaultData.post.buildCreateInput()
            } : defaultData.post,
            reviewer: isReviewreviewerFactory(defaultData.reviewer) ? {
                create: await defaultData.reviewer.buildCreateInput()
            } : defaultData.reviewer
        };
        const data: Prisma.ReviewCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const create = async (inputData: Partial<Prisma.ReviewCreateInput> = {}) => {
        const data = await buildCreateInput(inputData);
        return await getClient<PrismaClient>().review.create({ data });
    };
    return {
        _factoryFor: "Review" as const,
        buildCreateInput,
        create,
    };
}
export function defineReviewFactory(args: ReviewFactoryDefineOptions) {
    return defineReviewFactoryInternal(args);
}
