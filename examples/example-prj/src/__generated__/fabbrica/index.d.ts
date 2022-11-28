import { User } from "@prisma/client";
import { Post } from "@prisma/client";
import { Comment } from "@prisma/client";
import { Category } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Resolver } from "@quramy/prisma-fabbrica/lib/helpers";
export { initialize, resetSequence } from "@quramy/prisma-fabbrica";
type BuildDataOptions = {
    readonly seq: number;
};
type UserFactoryDefineInput = {
    id?: string;
    email?: string;
    name?: string;
    posts?: Prisma.PostCreateNestedManyWithoutAuthorInput;
    comments?: Prisma.CommentCreateNestedManyWithoutAuthorInput;
    updatedAt?: Date;
    createdAt?: Date;
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
    comments?: Prisma.CommentCreateNestedManyWithoutPostInput;
    categories?: Prisma.CategoryCreateNestedManyWithoutPostsInput;
    updatedAt?: Date;
    createdAt?: Date;
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
type CommentpostFactory = {
    _factoryFor: "Post";
    build: () => PromiseLike<Prisma.PostCreateNestedOneWithoutCommentsInput["create"]>;
};
type CommentauthorFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutCommentsInput["create"]>;
};
type CommentFactoryDefineInput = {
    id?: string;
    body?: string;
    post: CommentpostFactory | Prisma.PostCreateNestedOneWithoutCommentsInput;
    author: CommentauthorFactory | Prisma.UserCreateNestedOneWithoutCommentsInput;
    updatedAt?: Date;
    createdAt?: Date;
};
type CommentFactoryDefineOptions = {
    defaultData: Resolver<CommentFactoryDefineInput, BuildDataOptions>;
};
export declare function defineCommentFactory(args: CommentFactoryDefineOptions): {
    _factoryFor: "Comment";
    build: (inputData?: Partial<Prisma.CommentCreateInput>) => Promise<Prisma.CommentCreateInput>;
    buildList: (inputData: number | Partial<Prisma.CommentCreateInput>[]) => Promise<Prisma.CommentCreateInput[]>;
    buildCreateInput: (inputData?: Partial<Prisma.CommentCreateInput>) => Promise<Prisma.CommentCreateInput>;
    pickForConnect: (inputData: Comment) => {
        id: string;
    };
    create: (inputData?: Partial<Prisma.CommentCreateInput>) => Promise<Comment>;
    createList: (inputData: number | Partial<Prisma.CommentCreateInput>[]) => Promise<Comment[]>;
    createForConnect: (inputData?: Partial<Prisma.CommentCreateInput>) => Promise<{
        id: string;
    }>;
};
type CategoryFactoryDefineInput = {
    id?: string;
    name?: string;
    posts?: Prisma.PostCreateNestedManyWithoutCategoriesInput;
};
type CategoryFactoryDefineOptions = {
    defaultData?: Resolver<CategoryFactoryDefineInput, BuildDataOptions>;
};
export declare function defineCategoryFactory(args?: CategoryFactoryDefineOptions): {
    _factoryFor: "Category";
    build: (inputData?: Partial<Prisma.CategoryCreateInput>) => Promise<Prisma.CategoryCreateInput>;
    buildList: (inputData: number | Partial<Prisma.CategoryCreateInput>[]) => Promise<Prisma.CategoryCreateInput[]>;
    buildCreateInput: (inputData?: Partial<Prisma.CategoryCreateInput>) => Promise<Prisma.CategoryCreateInput>;
    pickForConnect: (inputData: Category) => {
        id: string;
    };
    create: (inputData?: Partial<Prisma.CategoryCreateInput>) => Promise<Category>;
    createList: (inputData: number | Partial<Prisma.CategoryCreateInput>[]) => Promise<Category[]>;
    createForConnect: (inputData?: Partial<Prisma.CategoryCreateInput>) => Promise<{
        id: string;
    }>;
};
