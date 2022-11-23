import { Prisma } from "@prisma/client";
import { Resolver } from "@quramy/prisma-fabbrica/lib/helpers";
export { initialize } from "@quramy/prisma-fabbrica";
type UserFactoryDefineInput = {
    id?: string;
    name?: string;
    posts?: Prisma.PostCreateNestedManyWithoutAuthorInput;
};
type UserFactoryDefineOptions = {
    defaultData?: Resolver<UserFactoryDefineInput>;
};
export declare function defineUserFactory(args?: UserFactoryDefineOptions): {
    _factoryFor: "User";
    buildCreateInput: (inputData?: Partial<Prisma.UserCreateInput>) => Promise<Prisma.UserCreateInput>;
    create: (inputData?: Partial<Prisma.UserCreateInput>) => Promise<import(".prisma/client").User>;
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
export declare function definePostFactory(args: PostFactoryDefineOptions): {
    _factoryFor: "Post";
    buildCreateInput: (inputData?: Partial<Prisma.PostCreateInput>) => Promise<Prisma.PostCreateInput>;
    create: (inputData?: Partial<Prisma.PostCreateInput>) => Promise<import(".prisma/client").Post>;
};
