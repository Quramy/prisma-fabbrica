import { Prisma, User, Post } from "@prisma/client";
import { getClient } from "@quramy/prisma-fabbrica";
import scalarFieldValueGenerator from "@quramy/prisma-fabbrica/lib/scalar/gen";
import { Resolver, resolveValue } from "@quramy/prisma-fabbrica/lib/helpers";
type UserScalarFields = {
    id: string;
    name: string;
};
type UserFactoryDefineInput = {
    id?: string;
    name?: string;
    posts?: Prisma.PostCreateNestedManyWithoutAuthorInput;
};
type UserFactoryDefineOptions = {
    defaultData: Resolver<UserFactoryDefineInput>;
};
function autoGenrateUserScalars(): UserScalarFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "id", isId: true, isUnique: false }),
        name: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "name", isId: false, isUnique: false })
    };
}
export function defineUserFactory({ defaultData: defaultDataResolver }: UserFactoryDefineOptions) {
    const buildCreateInput = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const requiredScalarData = autoGenrateUserScalars();
        const defaultData = await resolveValue(defaultDataResolver);
        const data = { ...requiredScalarData, ...defaultData, ...inputData };
        return data
    }
    const create = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const data = await buildCreateInput(inputData)
        return await getClient().user.create({ data });
    };
    const pickForConnect = (created: User ) => {
      return {
        id: created.id,
      }
    }
    const createForConnect = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const data = await buildCreateInput(inputData)
        const created = await getClient().user.create({ data });
        return pickForConnect(created)
    };
    return {
      _factoryFor: "User" as const,
      buildCreateInput,
      pickForConnect,
      create,
      createForConnect,
    };
}

type PostScalarFields = {
    id: string;
    title: string;
};
type PostAuthorFactory = {
    _factoryFor: "User",
    buildCreateInput: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPostsInput["create"]>
};
type PostFactoryDefineInput = {
    id?: string;
    title?: string;
    author: PostAuthorFactory | Prisma.UserCreateNestedOneWithoutPostsInput;
};
type PostFactoryDefineOptions = {
    defaultData: Resolver<PostFactoryDefineInput>;
};
function isPostAuthorFactory(author: PostAuthorFactory | Prisma.UserCreateNestedOneWithoutPostsInput): author is PostAuthorFactory {
    return (author as any)._factoryFor === "User"
}
function autoGenratePostScalars(): PostScalarFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "Post", fieldName: "id", isId: true, isUnique: false }),
        title: scalarFieldValueGenerator.String({ modelName: "Post", fieldName: "title", isId: false, isUnique: false })
    };
}
export function definePostFactory({ defaultData: defaultDataResolver }: PostFactoryDefineOptions) {
    const buildCreateInput = async (inputData: Partial<Prisma.PostCreateInput> = {}) => {
        const requiredScalarData = autoGenratePostScalars();
        const defaultData = await resolveValue(defaultDataResolver);
        const author = isPostAuthorFactory(defaultData.author) ? { create: (await defaultData.author.buildCreateInput()) } : defaultData.author
        const defaultAssociations = { author: author }
        const data = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data
    }
    const pickForConnect = (created: Post) => {
      return {
        id: created.id,
      }
    }
    const create = async (inputData: Partial<Prisma.PostCreateInput> = {}) => {
        const data = await buildCreateInput(inputData)
        return await getClient().post.create({ data });
    };
    const createForConnect = async (inputData: Partial<Prisma.PostCreateInput> = {}) => {
        const data = await buildCreateInput(inputData)
        const created = await getClient().post.create({ data });
        return pickForConnect(created)
    };
    return {
        _factoryFor: "Post" as const,
        buildCreateInput,
        pickForConnect,
        create,
        createForConnect,
    };
}
