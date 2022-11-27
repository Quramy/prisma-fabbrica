import { User } from "@prisma/client";
import { Post } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Resolver } from "@quramy/prisma-fabbrica/lib/helpers";
export { initialize, resetSequence } from "@quramy/prisma-fabbrica";
type BuildDataOptions = {
    readonly seq: number;
};
type UserFactoryDefineInput = {
    id?: string;
    name?: string;
    posts?: Prisma.PostCreateNestedManyWithoutAuthorInput;
};
type UserFactoryDefineOptions = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions>;
};
export declare function defineUserFactory(args?: UserFactoryDefineOptions): {
    _factoryFor: "User";
    build: (inputData?: Partial<Prisma.UserCreateInput>) => Promise<Prisma.UserCreateInput>;
    buildList: (inputData: number | Partial<Prisma.UserCreateInput>[]) => Promise<Prisma.UserCreateInput[]>;
    buildCreateInput: (inputData?: Partial<Prisma.UserCreateInput>) => Promise<Prisma.UserCreateInput>;
    pickForConnect: (inputData: User) => {
        id: string;
    };
    create: (inputData?: Partial<Prisma.UserCreateInput>) => Promise<User>;
    createList: (inputData: number | Partial<Prisma.UserCreateInput>[]) => Promise<User[]>;
    createForConnect: (inputData?: Partial<Prisma.UserCreateInput>) => Promise<{
        id: string;
    }>;
};
type PostauthorFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPostsInput["create"]>;
};
type PostFactoryDefineInput = {
    id?: string;
    title?: string;
    author: PostauthorFactory | Prisma.UserCreateNestedOneWithoutPostsInput;
};
type PostFactoryDefineOptions = {
    defaultData: Resolver<PostFactoryDefineInput, BuildDataOptions>;
};
export declare function definePostFactory(args: PostFactoryDefineOptions): {
    _factoryFor: "Post";
    build: (inputData?: Partial<Prisma.PostCreateInput>) => Promise<Prisma.PostCreateInput>;
    buildList: (inputData: number | Partial<Prisma.PostCreateInput>[]) => Promise<Prisma.PostCreateInput[]>;
    buildCreateInput: (inputData?: Partial<Prisma.PostCreateInput>) => Promise<Prisma.PostCreateInput>;
    pickForConnect: (inputData: Post) => {
        id: string;
    };
    create: (inputData?: Partial<Prisma.PostCreateInput>) => Promise<Post>;
    createList: (inputData: number | Partial<Prisma.PostCreateInput>[]) => Promise<Post[]>;
    createForConnect: (inputData?: Partial<Prisma.PostCreateInput>) => Promise<{
        id: string;
    }>;
};
