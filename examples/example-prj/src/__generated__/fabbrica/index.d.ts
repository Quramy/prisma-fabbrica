import type { User } from "@prisma/client";
import type { LoginLog } from "@prisma/client";
import type { Post } from "@prisma/client";
import type { Comment } from "@prisma/client";
import type { Category } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type { Resolver } from "@quramy/prisma-fabbrica/lib/internal";
export { resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";
type BuildDataOptions<TTransients extends Record<string, unknown>> = {
    readonly seq: number;
} & TTransients;
type CallbackDefineOptions<TCreated, TCreateInput, TTransients extends Record<string, unknown>> = {
    onAfterBuild?: (createInput: TCreateInput, transientFields: TTransients) => void | PromiseLike<void>;
    onBeforeCreate?: (createInput: TCreateInput, transientFields: TTransients) => void | PromiseLike<void>;
    onAfterCreate?: (created: TCreated, transientFields: TTransients) => void | PromiseLike<void>;
};
export declare const initialize: (options: import("@quramy/prisma-fabbrica/lib/initialize").InitializeOptions) => void;
type UserFactoryDefineInput = {
    id?: string;
    email?: string;
    name?: string;
    updatedAt?: Date;
    createdAt?: Date;
    posts?: Prisma.PostCreateNestedManyWithoutAuthorInput;
    comments?: Prisma.CommentCreateNestedManyWithoutAuthorInput;
};
type UserTransientFields = Record<string, unknown> & Partial<Record<keyof UserFactoryDefineInput, never>>;
type UserFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<User, Prisma.UserCreateInput, TTransients>;
type UserFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: UserFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<User, Prisma.UserCreateInput, TTransients>;
type UserTraitKeys<TOptions extends UserFactoryDefineOptions<any>> = keyof TOptions["traits"];
export interface UserFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "User";
    build(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput>;
    buildList(list: readonly Partial<Prisma.UserCreateInput & TTransients>[]): PromiseLike<Prisma.UserCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput[]>;
    pickForConnect(inputData: User): Pick<User, "id">;
    create(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<User>;
    createList(list: readonly Partial<Prisma.UserCreateInput & TTransients>[]): PromiseLike<User[]>;
    createList(count: number, item?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<User[]>;
    createForConnect(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Pick<User, "id">>;
}
export interface UserFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends UserFactoryDefineOptions<TTransients> = UserFactoryDefineOptions<TTransients>> extends UserFactoryInterfaceWithoutTraits<TTransients> {
    use(name: UserTraitKeys<TOptions>, ...names: readonly UserTraitKeys<TOptions>[]): UserFactoryInterfaceWithoutTraits<TTransients>;
}
interface UserFactoryBuilder {
    <TOptions extends UserFactoryDefineOptions>(options?: TOptions): UserFactoryInterface<{}, TOptions>;
    withTransientFields: <TTransients extends UserTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends UserFactoryDefineOptions<TTransients>>(options?: TOptions) => UserFactoryInterface<TTransients, TOptions>;
}
/**
 * Define factory for {@link User} model.
 *
 * @param options
 * @returns factory {@link UserFactoryInterface}
 */
export declare const defineUserFactory: UserFactoryBuilder;
type LoginLogFactoryDefineInput = {
    id?: string;
    userId?: string;
    clientId?: string;
    createdAt?: Date;
};
type LoginLogTransientFields = Record<string, unknown> & Partial<Record<keyof LoginLogFactoryDefineInput, never>>;
type LoginLogFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<LoginLogFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<LoginLog, Prisma.LoginLogCreateInput, TTransients>;
type LoginLogFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<LoginLogFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: LoginLogFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<LoginLog, Prisma.LoginLogCreateInput, TTransients>;
type LoginLogTraitKeys<TOptions extends LoginLogFactoryDefineOptions<any>> = keyof TOptions["traits"];
export interface LoginLogFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "LoginLog";
    build(inputData?: Partial<Prisma.LoginLogCreateInput & TTransients>): PromiseLike<Prisma.LoginLogCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.LoginLogCreateInput & TTransients>): PromiseLike<Prisma.LoginLogCreateInput>;
    buildList(list: readonly Partial<Prisma.LoginLogCreateInput & TTransients>[]): PromiseLike<Prisma.LoginLogCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.LoginLogCreateInput & TTransients>): PromiseLike<Prisma.LoginLogCreateInput[]>;
    pickForConnect(inputData: LoginLog): Pick<LoginLog, "id">;
    create(inputData?: Partial<Prisma.LoginLogCreateInput & TTransients>): PromiseLike<LoginLog>;
    createList(list: readonly Partial<Prisma.LoginLogCreateInput & TTransients>[]): PromiseLike<LoginLog[]>;
    createList(count: number, item?: Partial<Prisma.LoginLogCreateInput & TTransients>): PromiseLike<LoginLog[]>;
    createForConnect(inputData?: Partial<Prisma.LoginLogCreateInput & TTransients>): PromiseLike<Pick<LoginLog, "id">>;
}
export interface LoginLogFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends LoginLogFactoryDefineOptions<TTransients> = LoginLogFactoryDefineOptions<TTransients>> extends LoginLogFactoryInterfaceWithoutTraits<TTransients> {
    use(name: LoginLogTraitKeys<TOptions>, ...names: readonly LoginLogTraitKeys<TOptions>[]): LoginLogFactoryInterfaceWithoutTraits<TTransients>;
}
interface LoginLogFactoryBuilder {
    <TOptions extends LoginLogFactoryDefineOptions>(options?: TOptions): LoginLogFactoryInterface<{}, TOptions>;
    withTransientFields: <TTransients extends LoginLogTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends LoginLogFactoryDefineOptions<TTransients>>(options?: TOptions) => LoginLogFactoryInterface<TTransients, TOptions>;
}
/**
 * Define factory for {@link LoginLog} model.
 *
 * @param options
 * @returns factory {@link LoginLogFactoryInterface}
 */
export declare const defineLoginLogFactory: LoginLogFactoryBuilder;
type PostauthorFactory = {
    _factoryFor: "User";
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
type PostTransientFields = Record<string, unknown> & Partial<Record<keyof PostFactoryDefineInput, never>>;
type PostFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<PostFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Post, Prisma.PostCreateInput, TTransients>;
type PostFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData: Resolver<PostFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: PostFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Post, Prisma.PostCreateInput, TTransients>;
type PostTraitKeys<TOptions extends PostFactoryDefineOptions<any>> = keyof TOptions["traits"];
export interface PostFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Post";
    build(inputData?: Partial<Prisma.PostCreateInput & TTransients>): PromiseLike<Prisma.PostCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PostCreateInput & TTransients>): PromiseLike<Prisma.PostCreateInput>;
    buildList(list: readonly Partial<Prisma.PostCreateInput & TTransients>[]): PromiseLike<Prisma.PostCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.PostCreateInput & TTransients>): PromiseLike<Prisma.PostCreateInput[]>;
    pickForConnect(inputData: Post): Pick<Post, "id">;
    create(inputData?: Partial<Prisma.PostCreateInput & TTransients>): PromiseLike<Post>;
    createList(list: readonly Partial<Prisma.PostCreateInput & TTransients>[]): PromiseLike<Post[]>;
    createList(count: number, item?: Partial<Prisma.PostCreateInput & TTransients>): PromiseLike<Post[]>;
    createForConnect(inputData?: Partial<Prisma.PostCreateInput & TTransients>): PromiseLike<Pick<Post, "id">>;
}
export interface PostFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends PostFactoryDefineOptions<TTransients> = PostFactoryDefineOptions<TTransients>> extends PostFactoryInterfaceWithoutTraits<TTransients> {
    use(name: PostTraitKeys<TOptions>, ...names: readonly PostTraitKeys<TOptions>[]): PostFactoryInterfaceWithoutTraits<TTransients>;
}
interface PostFactoryBuilder {
    <TOptions extends PostFactoryDefineOptions>(options: TOptions): PostFactoryInterface<{}, TOptions>;
    withTransientFields: <TTransients extends PostTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends PostFactoryDefineOptions<TTransients>>(options: TOptions) => PostFactoryInterface<TTransients, TOptions>;
}
/**
 * Define factory for {@link Post} model.
 *
 * @param options
 * @returns factory {@link PostFactoryInterface}
 */
export declare const definePostFactory: PostFactoryBuilder;
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
    updatedAt?: Date;
    createdAt?: Date;
    post: CommentpostFactory | Prisma.PostCreateNestedOneWithoutCommentsInput;
    author: CommentauthorFactory | Prisma.UserCreateNestedOneWithoutCommentsInput;
};
type CommentTransientFields = Record<string, unknown> & Partial<Record<keyof CommentFactoryDefineInput, never>>;
type CommentFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<CommentFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Comment, Prisma.CommentCreateInput, TTransients>;
type CommentFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData: Resolver<CommentFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: CommentFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Comment, Prisma.CommentCreateInput, TTransients>;
type CommentTraitKeys<TOptions extends CommentFactoryDefineOptions<any>> = keyof TOptions["traits"];
export interface CommentFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Comment";
    build(inputData?: Partial<Prisma.CommentCreateInput & TTransients>): PromiseLike<Prisma.CommentCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.CommentCreateInput & TTransients>): PromiseLike<Prisma.CommentCreateInput>;
    buildList(list: readonly Partial<Prisma.CommentCreateInput & TTransients>[]): PromiseLike<Prisma.CommentCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.CommentCreateInput & TTransients>): PromiseLike<Prisma.CommentCreateInput[]>;
    pickForConnect(inputData: Comment): Pick<Comment, "id">;
    create(inputData?: Partial<Prisma.CommentCreateInput & TTransients>): PromiseLike<Comment>;
    createList(list: readonly Partial<Prisma.CommentCreateInput & TTransients>[]): PromiseLike<Comment[]>;
    createList(count: number, item?: Partial<Prisma.CommentCreateInput & TTransients>): PromiseLike<Comment[]>;
    createForConnect(inputData?: Partial<Prisma.CommentCreateInput & TTransients>): PromiseLike<Pick<Comment, "id">>;
}
export interface CommentFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends CommentFactoryDefineOptions<TTransients> = CommentFactoryDefineOptions<TTransients>> extends CommentFactoryInterfaceWithoutTraits<TTransients> {
    use(name: CommentTraitKeys<TOptions>, ...names: readonly CommentTraitKeys<TOptions>[]): CommentFactoryInterfaceWithoutTraits<TTransients>;
}
interface CommentFactoryBuilder {
    <TOptions extends CommentFactoryDefineOptions>(options: TOptions): CommentFactoryInterface<{}, TOptions>;
    withTransientFields: <TTransients extends CommentTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends CommentFactoryDefineOptions<TTransients>>(options: TOptions) => CommentFactoryInterface<TTransients, TOptions>;
}
/**
 * Define factory for {@link Comment} model.
 *
 * @param options
 * @returns factory {@link CommentFactoryInterface}
 */
export declare const defineCommentFactory: CommentFactoryBuilder;
type CategoryFactoryDefineInput = {
    id?: string;
    name?: string;
    posts?: Prisma.PostCreateNestedManyWithoutCategoriesInput;
};
type CategoryTransientFields = Record<string, unknown> & Partial<Record<keyof CategoryFactoryDefineInput, never>>;
type CategoryFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<CategoryFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Category, Prisma.CategoryCreateInput, TTransients>;
type CategoryFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<CategoryFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: CategoryFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Category, Prisma.CategoryCreateInput, TTransients>;
type CategoryTraitKeys<TOptions extends CategoryFactoryDefineOptions<any>> = keyof TOptions["traits"];
export interface CategoryFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Category";
    build(inputData?: Partial<Prisma.CategoryCreateInput & TTransients>): PromiseLike<Prisma.CategoryCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.CategoryCreateInput & TTransients>): PromiseLike<Prisma.CategoryCreateInput>;
    buildList(list: readonly Partial<Prisma.CategoryCreateInput & TTransients>[]): PromiseLike<Prisma.CategoryCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.CategoryCreateInput & TTransients>): PromiseLike<Prisma.CategoryCreateInput[]>;
    pickForConnect(inputData: Category): Pick<Category, "id">;
    create(inputData?: Partial<Prisma.CategoryCreateInput & TTransients>): PromiseLike<Category>;
    createList(list: readonly Partial<Prisma.CategoryCreateInput & TTransients>[]): PromiseLike<Category[]>;
    createList(count: number, item?: Partial<Prisma.CategoryCreateInput & TTransients>): PromiseLike<Category[]>;
    createForConnect(inputData?: Partial<Prisma.CategoryCreateInput & TTransients>): PromiseLike<Pick<Category, "id">>;
}
export interface CategoryFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends CategoryFactoryDefineOptions<TTransients> = CategoryFactoryDefineOptions<TTransients>> extends CategoryFactoryInterfaceWithoutTraits<TTransients> {
    use(name: CategoryTraitKeys<TOptions>, ...names: readonly CategoryTraitKeys<TOptions>[]): CategoryFactoryInterfaceWithoutTraits<TTransients>;
}
interface CategoryFactoryBuilder {
    <TOptions extends CategoryFactoryDefineOptions>(options?: TOptions): CategoryFactoryInterface<{}, TOptions>;
    withTransientFields: <TTransients extends CategoryTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends CategoryFactoryDefineOptions<TTransients>>(options?: TOptions) => CategoryFactoryInterface<TTransients, TOptions>;
}
/**
 * Define factory for {@link Category} model.
 *
 * @param options
 * @returns factory {@link CategoryFactoryInterface}
 */
export declare const defineCategoryFactory: CategoryFactoryBuilder;
