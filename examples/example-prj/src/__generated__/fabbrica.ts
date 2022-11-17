import { Prisma } from "@prisma/client";
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
    const create = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const requiredScalarData = autoGenrateUserScalars();
        const defaultData = await resolveValue(defaultDataResolver);
        const data = { ...requiredScalarData, ...defaultData, ...inputData };
        return await getClient().user.create({ data });
    };
    return { create };
}
type PostScalarFields = {
    id: string;
    title: string;
};
type PostFactoryDefineInput = {
    id?: string;
    title?: string;
    author: Prisma.UserCreateNestedOneWithoutPostsInput;
};
type PostFactoryDefineOptions = {
    defaultData: Resolver<PostFactoryDefineInput>;
};
function autoGenratePostScalars(): PostScalarFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "Post", fieldName: "id", isId: true, isUnique: false }),
        title: scalarFieldValueGenerator.String({ modelName: "Post", fieldName: "title", isId: false, isUnique: false })
    };
}
export function definePostFactory({ defaultData: defaultDataResolver }: PostFactoryDefineOptions) {
    const create = async (inputData: Partial<Prisma.PostCreateInput> = {}) => {
        const requiredScalarData = autoGenratePostScalars();
        const defaultData = await resolveValue(defaultDataResolver);
        const data = { ...requiredScalarData, ...defaultData, ...inputData };
        return await getClient().post.create({ data });
    };
    return { create };
}
