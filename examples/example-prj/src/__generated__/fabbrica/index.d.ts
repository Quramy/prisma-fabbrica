import type { User } from "@prisma/client";
import type { Post } from "@prisma/client";
import type { Comment } from "@prisma/client";
import type { Category } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Resolver } from "@quramy/prisma-fabbrica/lib/internal";
export { resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";
type BuildDataOptions = {
    readonly seq: number;
};
type CallbackDefineOptions<TCreated, TCreateInput> = {
    onAfterBuild?: (createInput: TCreateInput) => void | PromiseLike<void>;
    onBeforeCreate?: (createInput: TCreateInput) => void | PromiseLike<void>;
    onAfterCreate?: (created: TCreated) => void | PromiseLike<void>;
};
export declare const initialize: (options: import("@quramy/prisma-fabbrica/lib/initialize").InitializeOptions) => void;
declare const factoryFor: unique symbol;
type UserFactoryDefineInput = {
    id?: string;
    email?: string;
    name?: string;
    updatedAt?: Date;
    createdAt?: Date;
    posts?: Prisma.PostCreateNestedManyWithoutAuthorInput;
    comments?: Prisma.CommentCreateNestedManyWithoutAuthorInput;
};
type UserFactoryTrait = {
    data?: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions>;
} & CallbackDefineOptions<User, Prisma.UserCreateInput>;
type UserFactoryDefineOptions = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: UserFactoryTrait;
    };
} & CallbackDefineOptions<User, Prisma.UserCreateInput>;
type UserTraitKeys<TOptions extends UserFactoryDefineOptions> = keyof TOptions["traits"];
export interface UserFactoryInterfaceWithoutTraits {
    readonly [factoryFor]: "User";
    build(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Prisma.UserCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Prisma.UserCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.UserCreateInput>[]): PromiseLike<Prisma.UserCreateInput[]>;
    pickForConnect(inputData: User): Pick<User, "id">;
    create(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<User>;
    createList(inputData: number | readonly Partial<Prisma.UserCreateInput>[]): PromiseLike<User[]>;
    createForConnect(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Pick<User, "id">>;
}
export interface UserFactoryInterface<TOptions extends UserFactoryDefineOptions = UserFactoryDefineOptions> extends UserFactoryInterfaceWithoutTraits {
    use(name: UserTraitKeys<TOptions>, ...names: readonly UserTraitKeys<TOptions>[]): UserFactoryInterfaceWithoutTraits;
}
/**
 * Define factory for {@link User} model.
 *
 * @param options
 * @returns factory {@link UserFactoryInterface}
 */
export declare function defineUserFactory<TOptions extends UserFactoryDefineOptions>(options?: TOptions): UserFactoryInterface<TOptions>;
type PostauthorFactory = {
    [factoryFor]: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPostsInput["create"]>;
};
type PostFactoryDefineInput = {
    id?: string;
    title?: string;
    updatedAt?: Date;
    createdAt?: Date;
    author: PostauthorFactory | Prisma.UserCreateNestedOneWithoutPostsInput;
    comments?: Prisma.CommentCreateNestedManyWithoutPostInput;
    categories?: Prisma.CategoryCreateNestedManyWithoutPostsInput;
};
type PostFactoryTrait = {
    data?: Resolver<Partial<PostFactoryDefineInput>, BuildDataOptions>;
} & CallbackDefineOptions<Post, Prisma.PostCreateInput>;
type PostFactoryDefineOptions = {
    defaultData: Resolver<PostFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: PostFactoryTrait;
    };
} & CallbackDefineOptions<Post, Prisma.PostCreateInput>;
type PostTraitKeys<TOptions extends PostFactoryDefineOptions> = keyof TOptions["traits"];
export interface PostFactoryInterfaceWithoutTraits {
    readonly [factoryFor]: "Post";
    build(inputData?: Partial<Prisma.PostCreateInput>): PromiseLike<Prisma.PostCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PostCreateInput>): PromiseLike<Prisma.PostCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PostCreateInput>[]): PromiseLike<Prisma.PostCreateInput[]>;
    pickForConnect(inputData: Post): Pick<Post, "id">;
    create(inputData?: Partial<Prisma.PostCreateInput>): PromiseLike<Post>;
    createList(inputData: number | readonly Partial<Prisma.PostCreateInput>[]): PromiseLike<Post[]>;
    createForConnect(inputData?: Partial<Prisma.PostCreateInput>): PromiseLike<Pick<Post, "id">>;
}
export interface PostFactoryInterface<TOptions extends PostFactoryDefineOptions = PostFactoryDefineOptions> extends PostFactoryInterfaceWithoutTraits {
    use(name: PostTraitKeys<TOptions>, ...names: readonly PostTraitKeys<TOptions>[]): PostFactoryInterfaceWithoutTraits;
}
/**
 * Define factory for {@link Post} model.
 *
 * @param options
 * @returns factory {@link PostFactoryInterface}
 */
export declare function definePostFactory<TOptions extends PostFactoryDefineOptions>(options: TOptions): PostFactoryInterface<TOptions>;
type CommentpostFactory = {
    [factoryFor]: "Post";
    build: () => PromiseLike<Prisma.PostCreateNestedOneWithoutCommentsInput["create"]>;
};
type CommentauthorFactory = {
    [factoryFor]: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutCommentsInput["create"]>;
};
type CommentFactoryDefineInput = {
    id?: string;
    body?: string;
    updatedAt?: Date;
    createdAt?: Date;
    post: CommentpostFactory | Prisma.PostCreateNestedOneWithoutCommentsInput;
    author: CommentauthorFactory | Prisma.UserCreateNestedOneWithoutCommentsInput;
};
type CommentFactoryTrait = {
    data?: Resolver<Partial<CommentFactoryDefineInput>, BuildDataOptions>;
} & CallbackDefineOptions<Comment, Prisma.CommentCreateInput>;
type CommentFactoryDefineOptions = {
    defaultData: Resolver<CommentFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: CommentFactoryTrait;
    };
} & CallbackDefineOptions<Comment, Prisma.CommentCreateInput>;
type CommentTraitKeys<TOptions extends CommentFactoryDefineOptions> = keyof TOptions["traits"];
export interface CommentFactoryInterfaceWithoutTraits {
    readonly [factoryFor]: "Comment";
    build(inputData?: Partial<Prisma.CommentCreateInput>): PromiseLike<Prisma.CommentCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.CommentCreateInput>): PromiseLike<Prisma.CommentCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.CommentCreateInput>[]): PromiseLike<Prisma.CommentCreateInput[]>;
    pickForConnect(inputData: Comment): Pick<Comment, "id">;
    create(inputData?: Partial<Prisma.CommentCreateInput>): PromiseLike<Comment>;
    createList(inputData: number | readonly Partial<Prisma.CommentCreateInput>[]): PromiseLike<Comment[]>;
    createForConnect(inputData?: Partial<Prisma.CommentCreateInput>): PromiseLike<Pick<Comment, "id">>;
}
export interface CommentFactoryInterface<TOptions extends CommentFactoryDefineOptions = CommentFactoryDefineOptions> extends CommentFactoryInterfaceWithoutTraits {
    use(name: CommentTraitKeys<TOptions>, ...names: readonly CommentTraitKeys<TOptions>[]): CommentFactoryInterfaceWithoutTraits;
}
/**
 * Define factory for {@link Comment} model.
 *
 * @param options
 * @returns factory {@link CommentFactoryInterface}
 */
export declare function defineCommentFactory<TOptions extends CommentFactoryDefineOptions>(options: TOptions): CommentFactoryInterface<TOptions>;
type CategoryFactoryDefineInput = {
    id?: string;
    name?: string;
    posts?: Prisma.PostCreateNestedManyWithoutCategoriesInput;
};
type CategoryFactoryTrait = {
    data?: Resolver<Partial<CategoryFactoryDefineInput>, BuildDataOptions>;
} & CallbackDefineOptions<Category, Prisma.CategoryCreateInput>;
type CategoryFactoryDefineOptions = {
    defaultData?: Resolver<CategoryFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: CategoryFactoryTrait;
    };
} & CallbackDefineOptions<Category, Prisma.CategoryCreateInput>;
type CategoryTraitKeys<TOptions extends CategoryFactoryDefineOptions> = keyof TOptions["traits"];
export interface CategoryFactoryInterfaceWithoutTraits {
    readonly [factoryFor]: "Category";
    build(inputData?: Partial<Prisma.CategoryCreateInput>): PromiseLike<Prisma.CategoryCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.CategoryCreateInput>): PromiseLike<Prisma.CategoryCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.CategoryCreateInput>[]): PromiseLike<Prisma.CategoryCreateInput[]>;
    pickForConnect(inputData: Category): Pick<Category, "id">;
    create(inputData?: Partial<Prisma.CategoryCreateInput>): PromiseLike<Category>;
    createList(inputData: number | readonly Partial<Prisma.CategoryCreateInput>[]): PromiseLike<Category[]>;
    createForConnect(inputData?: Partial<Prisma.CategoryCreateInput>): PromiseLike<Pick<Category, "id">>;
}
export interface CategoryFactoryInterface<TOptions extends CategoryFactoryDefineOptions = CategoryFactoryDefineOptions> extends CategoryFactoryInterfaceWithoutTraits {
    use(name: CategoryTraitKeys<TOptions>, ...names: readonly CategoryTraitKeys<TOptions>[]): CategoryFactoryInterfaceWithoutTraits;
}
/**
 * Define factory for {@link Category} model.
 *
 * @param options
 * @returns factory {@link CategoryFactoryInterface}
 */
export declare function defineCategoryFactory<TOptions extends CategoryFactoryDefineOptions>(options?: TOptions): CategoryFactoryInterface<TOptions>;
