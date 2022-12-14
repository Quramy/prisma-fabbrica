import type { User } from "@prisma/client";
import type { Post } from "@prisma/client";
import type { Comment } from "@prisma/client";
import type { Category } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Resolver } from "@quramy/prisma-fabbrica/lib/internal";
export { initialize, resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";
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
interface UserFactoryInterface {
    readonly _factoryFor: "User";
    build(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Prisma.UserCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Prisma.UserCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.UserCreateInput>[]): PromiseLike<Prisma.UserCreateInput[]>;
    pickForConnect(inputData: User): Pick<User, "id">;
    create(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<User>;
    createList(inputData: number | readonly Partial<Prisma.UserCreateInput>[]): PromiseLike<User[]>;
    createForConnect(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Pick<User, "id">>;
}
/**
 * Define factory for {@link User} model.
 *
 * @param options
 * @returns factory {@link UserFactoryInterface}
 */
export declare function defineUserFactory(options?: UserFactoryDefineOptions): UserFactoryInterface;
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
interface PostFactoryInterface {
    readonly _factoryFor: "Post";
    build(inputData?: Partial<Prisma.PostCreateInput>): PromiseLike<Prisma.PostCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PostCreateInput>): PromiseLike<Prisma.PostCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PostCreateInput>[]): PromiseLike<Prisma.PostCreateInput[]>;
    pickForConnect(inputData: Post): Pick<Post, "id">;
    create(inputData?: Partial<Prisma.PostCreateInput>): PromiseLike<Post>;
    createList(inputData: number | readonly Partial<Prisma.PostCreateInput>[]): PromiseLike<Post[]>;
    createForConnect(inputData?: Partial<Prisma.PostCreateInput>): PromiseLike<Pick<Post, "id">>;
}
/**
 * Define factory for {@link Post} model.
 *
 * @param options
 * @returns factory {@link PostFactoryInterface}
 */
export declare function definePostFactory(options: PostFactoryDefineOptions): PostFactoryInterface;
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
interface CommentFactoryInterface {
    readonly _factoryFor: "Comment";
    build(inputData?: Partial<Prisma.CommentCreateInput>): PromiseLike<Prisma.CommentCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.CommentCreateInput>): PromiseLike<Prisma.CommentCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.CommentCreateInput>[]): PromiseLike<Prisma.CommentCreateInput[]>;
    pickForConnect(inputData: Comment): Pick<Comment, "id">;
    create(inputData?: Partial<Prisma.CommentCreateInput>): PromiseLike<Comment>;
    createList(inputData: number | readonly Partial<Prisma.CommentCreateInput>[]): PromiseLike<Comment[]>;
    createForConnect(inputData?: Partial<Prisma.CommentCreateInput>): PromiseLike<Pick<Comment, "id">>;
}
/**
 * Define factory for {@link Comment} model.
 *
 * @param options
 * @returns factory {@link CommentFactoryInterface}
 */
export declare function defineCommentFactory(options: CommentFactoryDefineOptions): CommentFactoryInterface;
type CategoryFactoryDefineInput = {
    id?: string;
    name?: string;
    posts?: Prisma.PostCreateNestedManyWithoutCategoriesInput;
};
type CategoryFactoryDefineOptions = {
    defaultData?: Resolver<CategoryFactoryDefineInput, BuildDataOptions>;
};
interface CategoryFactoryInterface {
    readonly _factoryFor: "Category";
    build(inputData?: Partial<Prisma.CategoryCreateInput>): PromiseLike<Prisma.CategoryCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.CategoryCreateInput>): PromiseLike<Prisma.CategoryCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.CategoryCreateInput>[]): PromiseLike<Prisma.CategoryCreateInput[]>;
    pickForConnect(inputData: Category): Pick<Category, "id">;
    create(inputData?: Partial<Prisma.CategoryCreateInput>): PromiseLike<Category>;
    createList(inputData: number | readonly Partial<Prisma.CategoryCreateInput>[]): PromiseLike<Category[]>;
    createForConnect(inputData?: Partial<Prisma.CategoryCreateInput>): PromiseLike<Pick<Category, "id">>;
}
/**
 * Define factory for {@link Category} model.
 *
 * @param options
 * @returns factory {@link CategoryFactoryInterface}
 */
export declare function defineCategoryFactory(options?: CategoryFactoryDefineOptions): CategoryFactoryInterface;
