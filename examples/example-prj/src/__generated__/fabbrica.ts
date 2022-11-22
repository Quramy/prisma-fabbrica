import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
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
type PostauthorFactory = {
    _factoryFor: "User";
    buildCreateInput: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPostsInput["create"]>;
};
type PostFactoryDefineInput = {
    id?: string;
    title?: string;
    author: PostauthorFactory | Prisma.UserCreateNestedOneWithoutPostsInput;
};
type PostFactoryDefineOptions = {
    defaultData: Resolver<PostFactoryDefineInput>;
};
function isPostauthorFactory(x: PostauthorFactory | Prisma.UserCreateNestedOneWithoutPostsInput): x is PostauthorFactory {
    return (x as any)._factoryFor === "User";
}
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
        const defaultAssociations = {
            author: isPostauthorFactory(defaultData.author) ? {
                create: await defaultData.author.buildCreateInput()
            } : defaultData.author
        };
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
export function definePostFactory(args: PostFactoryDefineOptions) {
    return definePostFactoryInternal(args);
}
