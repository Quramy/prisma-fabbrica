import type { User } from "../client/client.js";
import type { LoginLog } from "../client/client.js";
import type { Post } from "../client/client.js";
import type { Comment } from "../client/client.js";
import type { Category } from "../client/client.js";
import type { Prisma, PrismaClient } from "../client/client.js";
import { createInitializer, createScreener, getScalarFieldValueGenerator, normalizeResolver, normalizeList, getSequenceCounter, createCallbackChain, destructure } from "@quramy/prisma-fabbrica/lib/internal";
import type { ModelWithFields, Resolver, } from "@quramy/prisma-fabbrica/lib/internal";
export { resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";

type BuildDataOptions<TTransients extends Record<string, unknown>> = {
    readonly seq: number;
} & TTransients;

type TraitName = string | symbol;

type CallbackDefineOptions<TCreated, TCreateInput, TTransients extends Record<string, unknown>> = {
    onAfterBuild?: (createInput: TCreateInput, transientFields: TTransients) => void | PromiseLike<void>;
    onBeforeCreate?: (createInput: TCreateInput, transientFields: TTransients) => void | PromiseLike<void>;
    onAfterCreate?: (created: TCreated, transientFields: TTransients) => void | PromiseLike<void>;
};

const initializer = createInitializer();

const { getClient } = initializer;

export const { initialize } = initializer;

const modelFieldDefinitions: ModelWithFields[] = [{
        name: "User",
        fields: [{
                name: "posts",
                type: "Post",
                relationName: "PostToUser"
            }, {
                name: "comments",
                type: "Comment",
                relationName: "CommentToUser"
            }]
    }, {
        name: "LoginLog",
        fields: []
    }, {
        name: "Post",
        fields: [{
                name: "author",
                type: "User",
                relationName: "PostToUser"
            }, {
                name: "comments",
                type: "Comment",
                relationName: "CommentToPost"
            }, {
                name: "categories",
                type: "Category",
                relationName: "CategoryToPost"
            }]
    }, {
        name: "Comment",
        fields: [{
                name: "post",
                type: "Post",
                relationName: "CommentToPost"
            }, {
                name: "author",
                type: "User",
                relationName: "CommentToUser"
            }]
    }, {
        name: "Category",
        fields: [{
                name: "posts",
                type: "Post",
                relationName: "CategoryToPost"
            }]
    }];

type UserScalarOrEnumFields = {
    id: string;
    email: string;
    name: string;
};

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
        [traitName: TraitName]: UserFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<User, Prisma.UserCreateInput, TTransients>;

type UserTraitKeys<TOptions extends UserFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;

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

export interface UserFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends UserFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): UserFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateUserScalarsOrEnums({ seq }: {
    readonly seq: number;
}): UserScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
        email: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "email", isId: false, isUnique: true, seq }),
        name: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "name", isId: false, isUnique: false, seq })
    };
}

function defineUserFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends UserFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): UserFactoryInterface<TTransients, UserTraitKeys<TOptions>> {
    const getFactoryWithTraits = (traitKeys: readonly UserTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("User", modelFieldDefinitions);
        const handleAfterBuild = createCallbackChain([
            onAfterBuild,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterBuild),
        ]);
        const handleBeforeCreate = createCallbackChain([
            ...traitKeys.slice().reverse().map(traitKey => traitsDefs[traitKey]?.onBeforeCreate),
            onBeforeCreate,
        ]);
        const handleAfterCreate = createCallbackChain([
            onAfterCreate,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterCreate),
        ]);
        const build = async (inputData: Partial<Prisma.UserCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateUserScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<UserFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const [transientFields, filteredInputData] = destructure(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<UserFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {} as Prisma.UserCreateInput;
            const data: Prisma.UserCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.UserCreateInput & TTransients>>(...args).map(data => build(data)));
        const pickForConnect = (inputData: User) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.UserCreateInput & TTransients> = {}) => {
            const data = await build({ ...inputData }).then(screen);
            const [transientFields] = destructure(defaultTransientFieldValues, inputData);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().user.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.UserCreateInput & TTransients>>(...args).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.UserCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "User" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: UserTraitKeys<TOptions>, ...names: readonly UserTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface UserFactoryBuilder {
    <TOptions extends UserFactoryDefineOptions>(options?: TOptions): UserFactoryInterface<{}, UserTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends UserTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends UserFactoryDefineOptions<TTransients>>(options?: TOptions) => UserFactoryInterface<TTransients, UserTraitKeys<TOptions>>;
}

/**
 * Define factory for {@link User} model.
 *
 * @param options
 * @returns factory {@link UserFactoryInterface}
 */
export const defineUserFactory = (<TOptions extends UserFactoryDefineOptions>(options?: TOptions): UserFactoryInterface<TOptions> => {
    return defineUserFactoryInternal(options ?? {}, {});
}) as UserFactoryBuilder;

defineUserFactory.withTransientFields = defaultTransientFieldValues => options => defineUserFactoryInternal(options ?? {}, defaultTransientFieldValues);

type LoginLogScalarOrEnumFields = {
    userId: string;
    clientId: string;
};

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
        [traitName: TraitName]: LoginLogFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<LoginLog, Prisma.LoginLogCreateInput, TTransients>;

type LoginLogTraitKeys<TOptions extends LoginLogFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;

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

export interface LoginLogFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends LoginLogFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): LoginLogFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateLoginLogScalarsOrEnums({ seq }: {
    readonly seq: number;
}): LoginLogScalarOrEnumFields {
    return {
        userId: getScalarFieldValueGenerator().String({ modelName: "LoginLog", fieldName: "userId", isId: false, isUnique: false, seq }),
        clientId: getScalarFieldValueGenerator().String({ modelName: "LoginLog", fieldName: "clientId", isId: false, isUnique: false, seq })
    };
}

function defineLoginLogFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends LoginLogFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): LoginLogFactoryInterface<TTransients, LoginLogTraitKeys<TOptions>> {
    const getFactoryWithTraits = (traitKeys: readonly LoginLogTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("LoginLog", modelFieldDefinitions);
        const handleAfterBuild = createCallbackChain([
            onAfterBuild,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterBuild),
        ]);
        const handleBeforeCreate = createCallbackChain([
            ...traitKeys.slice().reverse().map(traitKey => traitsDefs[traitKey]?.onBeforeCreate),
            onBeforeCreate,
        ]);
        const handleAfterCreate = createCallbackChain([
            onAfterCreate,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterCreate),
        ]);
        const build = async (inputData: Partial<Prisma.LoginLogCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateLoginLogScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<LoginLogFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const [transientFields, filteredInputData] = destructure(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<LoginLogFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {} as Prisma.LoginLogCreateInput;
            const data: Prisma.LoginLogCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.LoginLogCreateInput & TTransients>>(...args).map(data => build(data)));
        const pickForConnect = (inputData: LoginLog) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.LoginLogCreateInput & TTransients> = {}) => {
            const data = await build({ ...inputData }).then(screen);
            const [transientFields] = destructure(defaultTransientFieldValues, inputData);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().loginLog.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.LoginLogCreateInput & TTransients>>(...args).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.LoginLogCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "LoginLog" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: LoginLogTraitKeys<TOptions>, ...names: readonly LoginLogTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface LoginLogFactoryBuilder {
    <TOptions extends LoginLogFactoryDefineOptions>(options?: TOptions): LoginLogFactoryInterface<{}, LoginLogTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends LoginLogTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends LoginLogFactoryDefineOptions<TTransients>>(options?: TOptions) => LoginLogFactoryInterface<TTransients, LoginLogTraitKeys<TOptions>>;
}

/**
 * Define factory for {@link LoginLog} model.
 *
 * @param options
 * @returns factory {@link LoginLogFactoryInterface}
 */
export const defineLoginLogFactory = (<TOptions extends LoginLogFactoryDefineOptions>(options?: TOptions): LoginLogFactoryInterface<TOptions> => {
    return defineLoginLogFactoryInternal(options ?? {}, {});
}) as LoginLogFactoryBuilder;

defineLoginLogFactory.withTransientFields = defaultTransientFieldValues => options => defineLoginLogFactoryInternal(options ?? {}, defaultTransientFieldValues);

type PostScalarOrEnumFields = {
    id: string;
    title: string;
};

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

function isPostauthorFactory(x: PostauthorFactory | Prisma.UserCreateNestedOneWithoutPostsInput | undefined): x is PostauthorFactory {
    return (x as any)?._factoryFor === "User";
}

type PostTraitKeys<TOptions extends PostFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;

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

export interface PostFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends PostFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): PostFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGeneratePostScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PostScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "Post", fieldName: "id", isId: true, isUnique: false, seq }),
        title: getScalarFieldValueGenerator().String({ modelName: "Post", fieldName: "title", isId: false, isUnique: false, seq })
    };
}

function definePostFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends PostFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): PostFactoryInterface<TTransients, PostTraitKeys<TOptions>> {
    const getFactoryWithTraits = (traitKeys: readonly PostTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Post", modelFieldDefinitions);
        const handleAfterBuild = createCallbackChain([
            onAfterBuild,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterBuild),
        ]);
        const handleBeforeCreate = createCallbackChain([
            ...traitKeys.slice().reverse().map(traitKey => traitsDefs[traitKey]?.onBeforeCreate),
            onBeforeCreate,
        ]);
        const handleAfterCreate = createCallbackChain([
            onAfterCreate,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterCreate),
        ]);
        const build = async (inputData: Partial<Prisma.PostCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePostScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<PostFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver);
            const [transientFields, filteredInputData] = destructure(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<PostFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {
                author: isPostauthorFactory(defaultData.author) ? {
                    create: await defaultData.author.build()
                } : defaultData.author
            } as Prisma.PostCreateInput;
            const data: Prisma.PostCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.PostCreateInput & TTransients>>(...args).map(data => build(data)));
        const pickForConnect = (inputData: Post) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.PostCreateInput & TTransients> = {}) => {
            const data = await build({ ...inputData }).then(screen);
            const [transientFields] = destructure(defaultTransientFieldValues, inputData);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().post.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.PostCreateInput & TTransients>>(...args).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.PostCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "Post" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: PostTraitKeys<TOptions>, ...names: readonly PostTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface PostFactoryBuilder {
    <TOptions extends PostFactoryDefineOptions>(options: TOptions): PostFactoryInterface<{}, PostTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends PostTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends PostFactoryDefineOptions<TTransients>>(options: TOptions) => PostFactoryInterface<TTransients, PostTraitKeys<TOptions>>;
}

/**
 * Define factory for {@link Post} model.
 *
 * @param options
 * @returns factory {@link PostFactoryInterface}
 */
export const definePostFactory = (<TOptions extends PostFactoryDefineOptions>(options: TOptions): PostFactoryInterface<TOptions> => {
    return definePostFactoryInternal(options, {});
}) as PostFactoryBuilder;

definePostFactory.withTransientFields = defaultTransientFieldValues => options => definePostFactoryInternal(options, defaultTransientFieldValues);

type CommentScalarOrEnumFields = {
    id: string;
    body: string;
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

function isCommentpostFactory(x: CommentpostFactory | Prisma.PostCreateNestedOneWithoutCommentsInput | undefined): x is CommentpostFactory {
    return (x as any)?._factoryFor === "Post";
}

function isCommentauthorFactory(x: CommentauthorFactory | Prisma.UserCreateNestedOneWithoutCommentsInput | undefined): x is CommentauthorFactory {
    return (x as any)?._factoryFor === "User";
}

type CommentTraitKeys<TOptions extends CommentFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;

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

export interface CommentFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends CommentFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): CommentFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateCommentScalarsOrEnums({ seq }: {
    readonly seq: number;
}): CommentScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "Comment", fieldName: "id", isId: true, isUnique: false, seq }),
        body: getScalarFieldValueGenerator().String({ modelName: "Comment", fieldName: "body", isId: false, isUnique: false, seq })
    };
}

function defineCommentFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends CommentFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): CommentFactoryInterface<TTransients, CommentTraitKeys<TOptions>> {
    const getFactoryWithTraits = (traitKeys: readonly CommentTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Comment", modelFieldDefinitions);
        const handleAfterBuild = createCallbackChain([
            onAfterBuild,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterBuild),
        ]);
        const handleBeforeCreate = createCallbackChain([
            ...traitKeys.slice().reverse().map(traitKey => traitsDefs[traitKey]?.onBeforeCreate),
            onBeforeCreate,
        ]);
        const handleAfterCreate = createCallbackChain([
            onAfterCreate,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterCreate),
        ]);
        const build = async (inputData: Partial<Prisma.CommentCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateCommentScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<CommentFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver);
            const [transientFields, filteredInputData] = destructure(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<CommentFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {
                post: isCommentpostFactory(defaultData.post) ? {
                    create: await defaultData.post.build()
                } : defaultData.post,
                author: isCommentauthorFactory(defaultData.author) ? {
                    create: await defaultData.author.build()
                } : defaultData.author
            } as Prisma.CommentCreateInput;
            const data: Prisma.CommentCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.CommentCreateInput & TTransients>>(...args).map(data => build(data)));
        const pickForConnect = (inputData: Comment) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.CommentCreateInput & TTransients> = {}) => {
            const data = await build({ ...inputData }).then(screen);
            const [transientFields] = destructure(defaultTransientFieldValues, inputData);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().comment.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.CommentCreateInput & TTransients>>(...args).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.CommentCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "Comment" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: CommentTraitKeys<TOptions>, ...names: readonly CommentTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface CommentFactoryBuilder {
    <TOptions extends CommentFactoryDefineOptions>(options: TOptions): CommentFactoryInterface<{}, CommentTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends CommentTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends CommentFactoryDefineOptions<TTransients>>(options: TOptions) => CommentFactoryInterface<TTransients, CommentTraitKeys<TOptions>>;
}

/**
 * Define factory for {@link Comment} model.
 *
 * @param options
 * @returns factory {@link CommentFactoryInterface}
 */
export const defineCommentFactory = (<TOptions extends CommentFactoryDefineOptions>(options: TOptions): CommentFactoryInterface<TOptions> => {
    return defineCommentFactoryInternal(options, {});
}) as CommentFactoryBuilder;

defineCommentFactory.withTransientFields = defaultTransientFieldValues => options => defineCommentFactoryInternal(options, defaultTransientFieldValues);

type CategoryScalarOrEnumFields = {
    id: string;
    name: string;
};

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
        [traitName: TraitName]: CategoryFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Category, Prisma.CategoryCreateInput, TTransients>;

type CategoryTraitKeys<TOptions extends CategoryFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;

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

export interface CategoryFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends CategoryFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): CategoryFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateCategoryScalarsOrEnums({ seq }: {
    readonly seq: number;
}): CategoryScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "Category", fieldName: "id", isId: true, isUnique: false, seq }),
        name: getScalarFieldValueGenerator().String({ modelName: "Category", fieldName: "name", isId: false, isUnique: true, seq })
    };
}

function defineCategoryFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends CategoryFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): CategoryFactoryInterface<TTransients, CategoryTraitKeys<TOptions>> {
    const getFactoryWithTraits = (traitKeys: readonly CategoryTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Category", modelFieldDefinitions);
        const handleAfterBuild = createCallbackChain([
            onAfterBuild,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterBuild),
        ]);
        const handleBeforeCreate = createCallbackChain([
            ...traitKeys.slice().reverse().map(traitKey => traitsDefs[traitKey]?.onBeforeCreate),
            onBeforeCreate,
        ]);
        const handleAfterCreate = createCallbackChain([
            onAfterCreate,
            ...traitKeys.map(traitKey => traitsDefs[traitKey]?.onAfterCreate),
        ]);
        const build = async (inputData: Partial<Prisma.CategoryCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateCategoryScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<CategoryFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const [transientFields, filteredInputData] = destructure(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<CategoryFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {} as Prisma.CategoryCreateInput;
            const data: Prisma.CategoryCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.CategoryCreateInput & TTransients>>(...args).map(data => build(data)));
        const pickForConnect = (inputData: Category) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.CategoryCreateInput & TTransients> = {}) => {
            const data = await build({ ...inputData }).then(screen);
            const [transientFields] = destructure(defaultTransientFieldValues, inputData);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().category.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.CategoryCreateInput & TTransients>>(...args).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.CategoryCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "Category" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: CategoryTraitKeys<TOptions>, ...names: readonly CategoryTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface CategoryFactoryBuilder {
    <TOptions extends CategoryFactoryDefineOptions>(options?: TOptions): CategoryFactoryInterface<{}, CategoryTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends CategoryTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends CategoryFactoryDefineOptions<TTransients>>(options?: TOptions) => CategoryFactoryInterface<TTransients, CategoryTraitKeys<TOptions>>;
}

/**
 * Define factory for {@link Category} model.
 *
 * @param options
 * @returns factory {@link CategoryFactoryInterface}
 */
export const defineCategoryFactory = (<TOptions extends CategoryFactoryDefineOptions>(options?: TOptions): CategoryFactoryInterface<TOptions> => {
    return defineCategoryFactoryInternal(options ?? {}, {});
}) as CategoryFactoryBuilder;

defineCategoryFactory.withTransientFields = defaultTransientFieldValues => options => defineCategoryFactoryInternal(options ?? {}, defaultTransientFieldValues);
