import { Prisma } from "@prisma/client";
import { getClient } from "@quramy/prisma-fabbrica";
import scalarFieldValueGenerator from "@quramy/prisma-fabbrica/lib/scalar/gen";
type Resolver<T extends Record<string, unknown>> = T | (() => T) | (() => PromiseLike<T>);
async function resolveValue<T extends Record<string, unknown>>(resolver: Resolver<T>) {
    const fn = typeof resolver === "function" ? resolver : () => Promise.resolve(resolver);
    return (await fn()) as T;
}
const defineFnMap = new Map<unknown, (options: any) => unknown>();
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
function defineUserFactory({ defaultData: defaultDataResolver }: UserFactoryDefineOptions) {
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
function definePostFactory({ defaultData: defaultDataResolver }: PostFactoryDefineOptions) {
    const create = async (inputData: Partial<Prisma.PostCreateInput> = {}) => {
        const requiredScalarData = autoGenratePostScalars();
        const defaultData = await resolveValue(defaultDataResolver);
        const data = { ...requiredScalarData, ...defaultData, ...inputData };
        return await getClient().post.create({ data });
    };
    return { create };
}
defineFnMap.set("User", defineUserFactory);
defineFnMap.set("Post", definePostFactory);
export function defineFactory(name: "User", options: UserFactoryDefineOptions): ReturnType<typeof defineUserFactory>;
export function defineFactory(name: "Post", options: PostFactoryDefineOptions): ReturnType<typeof definePostFactory>;
export function defineFactory(name: unknown, options: unknown): unknown {
    const defineFn = defineFnMap.get(name);
    if (!defineFn)
        throw new Error("Invalid model name");
    return defineFn(options);
}
