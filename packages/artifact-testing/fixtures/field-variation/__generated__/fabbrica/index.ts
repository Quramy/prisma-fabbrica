import type { User } from "../client";
import type { ComplexIdModel } from "../client";
import type { FieldTypePatternModel } from "../client";
import type { NoPkModel } from "../client";
import type { Role } from "../client";
import type { Status } from "../client";
import type { Prisma, PrismaClient } from "../client";
import { createInitializer, createScreener, getScalarFieldValueGenerator, normalizeResolver, normalizeList, getSequenceCounter, createCallbackChain, synthesize, } from "@quramy/prisma-fabbrica/lib/internal";
import type { ModelWithFields, Resolver, } from "@quramy/prisma-fabbrica/lib/internal";
export { resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";

type BuildDataOptions<TTransients extends Record<string, unknown>> = {
    readonly seq: number;
} & TTransients;

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
        fields: []
    }, {
        name: "ComplexIdModel",
        fields: []
    }, {
        name: "FieldTypePatternModel",
        fields: []
    }, {
        name: "NoPkModel",
        fields: []
    }, {
        name: "UnsupportedModel",
        fields: []
    }];

type UserScalarOrEnumFields = {
    id: string;
    role: Role;
};

type UserFactoryDefineInput = {
    id?: string;
    role?: Role;
    roleDefault?: Role;
    roles?: Prisma.UserCreaterolesInput | Array<Role>;
    status?: Status | null;
};

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
    buildList(inputData: number | readonly Partial<Prisma.UserCreateInput & TTransients>[]): PromiseLike<Prisma.UserCreateInput[]>;
    pickForConnect(inputData: User): Pick<User, "id">;
    create(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<User>;
    createList(inputData: number | readonly Partial<Prisma.UserCreateInput & TTransients>[]): PromiseLike<User[]>;
    createForConnect(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Pick<User, "id">>;
}

export interface UserFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends UserFactoryDefineOptions<TTransients> = UserFactoryDefineOptions<TTransients>> extends UserFactoryInterfaceWithoutTraits<TTransients> {
    use(name: UserTraitKeys<TOptions>, ...names: readonly UserTraitKeys<TOptions>[]): UserFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateUserScalarsOrEnums({ seq }: {
    readonly seq: number;
}): UserScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
        role: "USER"
    };
}

function defineUserFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends UserFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): UserFactoryInterface<TTransients, TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly UserTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("User", modelFieldDefinitions);
        const handleAfterBuild = createCallbackChain([
            onAfterBuild,
            ...traitKeys.map(traitKey => traitsDefs[traitKey].onAfterBuild),
        ]);
        const handleBeforeCreate = createCallbackChain([
            ...traitKeys.slice().reverse().map(traitKey => traitsDefs[traitKey].onBeforeCreate),
            onBeforeCreate,
        ]);
        const handleAfterCreate = createCallbackChain([
            onAfterCreate,
            ...traitKeys.map(traitKey => traitsDefs[traitKey].onAfterCreate),
        ]);
        const build = async (inputData: Partial<Prisma.UserCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateUserScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<UserFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const transientFields = synthesize(defaultTransientFieldValues, inputData);
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
            const defaultAssociations = {};
            const data: Prisma.UserCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.UserCreateInput & TTransients>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: User) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.UserCreateInput & TTransients> = {}) => {
            const data = await build(inputData).then(screen);
            const transientFields = synthesize(defaultTransientFieldValues, inputData);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().user.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (inputData: number | readonly Partial<Prisma.UserCreateInput & TTransients>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
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
    <TOptions extends UserFactoryDefineOptions>(options?: TOptions): UserFactoryInterface<{}, TOptions>;
    withTransientFields: <TTransients extends Record<string, unknown>>(defaultTransientFieldValues: TTransients) => <TOptions extends UserFactoryDefineOptions<TTransients>>(options?: TOptions) => UserFactoryInterface<TTransients, TOptions>;
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

type ComplexIdModelScalarOrEnumFields = {
    firstName: string;
    lastName: string;
};

type ComplexIdModelFactoryDefineInput = {
    firstName?: string;
    lastName?: string;
};

type ComplexIdModelFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<ComplexIdModelFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<ComplexIdModel, Prisma.ComplexIdModelCreateInput, TTransients>;

type ComplexIdModelFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<ComplexIdModelFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: ComplexIdModelFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<ComplexIdModel, Prisma.ComplexIdModelCreateInput, TTransients>;

type ComplexIdModelTraitKeys<TOptions extends ComplexIdModelFactoryDefineOptions<any>> = keyof TOptions["traits"];

export interface ComplexIdModelFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "ComplexIdModel";
    build(inputData?: Partial<Prisma.ComplexIdModelCreateInput & TTransients>): PromiseLike<Prisma.ComplexIdModelCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.ComplexIdModelCreateInput & TTransients>): PromiseLike<Prisma.ComplexIdModelCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.ComplexIdModelCreateInput & TTransients>[]): PromiseLike<Prisma.ComplexIdModelCreateInput[]>;
    pickForConnect(inputData: ComplexIdModel): Pick<ComplexIdModel, "firstName" | "lastName">;
    create(inputData?: Partial<Prisma.ComplexIdModelCreateInput & TTransients>): PromiseLike<ComplexIdModel>;
    createList(inputData: number | readonly Partial<Prisma.ComplexIdModelCreateInput & TTransients>[]): PromiseLike<ComplexIdModel[]>;
    createForConnect(inputData?: Partial<Prisma.ComplexIdModelCreateInput & TTransients>): PromiseLike<Pick<ComplexIdModel, "firstName" | "lastName">>;
}

export interface ComplexIdModelFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends ComplexIdModelFactoryDefineOptions<TTransients> = ComplexIdModelFactoryDefineOptions<TTransients>> extends ComplexIdModelFactoryInterfaceWithoutTraits<TTransients> {
    use(name: ComplexIdModelTraitKeys<TOptions>, ...names: readonly ComplexIdModelTraitKeys<TOptions>[]): ComplexIdModelFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateComplexIdModelScalarsOrEnums({ seq }: {
    readonly seq: number;
}): ComplexIdModelScalarOrEnumFields {
    return {
        firstName: getScalarFieldValueGenerator().String({ modelName: "ComplexIdModel", fieldName: "firstName", isId: true, isUnique: false, seq }),
        lastName: getScalarFieldValueGenerator().String({ modelName: "ComplexIdModel", fieldName: "lastName", isId: true, isUnique: false, seq })
    };
}

function defineComplexIdModelFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends ComplexIdModelFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): ComplexIdModelFactoryInterface<TTransients, TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly ComplexIdModelTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("ComplexIdModel", modelFieldDefinitions);
        const handleAfterBuild = createCallbackChain([
            onAfterBuild,
            ...traitKeys.map(traitKey => traitsDefs[traitKey].onAfterBuild),
        ]);
        const handleBeforeCreate = createCallbackChain([
            ...traitKeys.slice().reverse().map(traitKey => traitsDefs[traitKey].onBeforeCreate),
            onBeforeCreate,
        ]);
        const handleAfterCreate = createCallbackChain([
            onAfterCreate,
            ...traitKeys.map(traitKey => traitsDefs[traitKey].onAfterCreate),
        ]);
        const build = async (inputData: Partial<Prisma.ComplexIdModelCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateComplexIdModelScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<ComplexIdModelFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const transientFields = synthesize(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<ComplexIdModelFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {};
            const data: Prisma.ComplexIdModelCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.ComplexIdModelCreateInput & TTransients>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: ComplexIdModel) => ({
            firstName: inputData.firstName,
            lastName: inputData.lastName
        });
        const create = async (inputData: Partial<Prisma.ComplexIdModelCreateInput & TTransients> = {}) => {
            const data = await build(inputData).then(screen);
            const transientFields = synthesize(defaultTransientFieldValues, inputData);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().complexIdModel.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (inputData: number | readonly Partial<Prisma.ComplexIdModelCreateInput & TTransients>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.ComplexIdModelCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "ComplexIdModel" as const,
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
    const useTraits = (name: ComplexIdModelTraitKeys<TOptions>, ...names: readonly ComplexIdModelTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface ComplexIdModelFactoryBuilder {
    <TOptions extends ComplexIdModelFactoryDefineOptions>(options?: TOptions): ComplexIdModelFactoryInterface<{}, TOptions>;
    withTransientFields: <TTransients extends Record<string, unknown>>(defaultTransientFieldValues: TTransients) => <TOptions extends ComplexIdModelFactoryDefineOptions<TTransients>>(options?: TOptions) => ComplexIdModelFactoryInterface<TTransients, TOptions>;
}

/**
 * Define factory for {@link ComplexIdModel} model.
 *
 * @param options
 * @returns factory {@link ComplexIdModelFactoryInterface}
 */
export const defineComplexIdModelFactory = (<TOptions extends ComplexIdModelFactoryDefineOptions>(options?: TOptions): ComplexIdModelFactoryInterface<TOptions> => {
    return defineComplexIdModelFactoryInternal(options ?? {}, {});
}) as ComplexIdModelFactoryBuilder;

defineComplexIdModelFactory.withTransientFields = defaultTransientFieldValues => options => defineComplexIdModelFactoryInternal(options ?? {}, defaultTransientFieldValues);

type FieldTypePatternModelScalarOrEnumFields = {
    id: number;
    requiredInt: number;
    requiredStr: string;
    requiredBool: boolean;
    requiredFlaot: number;
    requiredDecimal: (Prisma.Decimal | Prisma.DecimalJsLike | string);
    requiredJson: Prisma.JsonNullValueInput | Prisma.InputJsonValue;
    requriedBytes: Buffer;
    requiredBigInt: (bigint | number);
};

type FieldTypePatternModelFactoryDefineInput = {
    id?: number;
    requiredInt?: number;
    nullableInt?: number | null;
    enumerableInt?: Prisma.FieldTypePatternModelCreateenumerableIntInput | Array<number>;
    requiredStr?: string;
    nullableStr?: string | null;
    enumerableStr?: Prisma.FieldTypePatternModelCreateenumerableStrInput | Array<string>;
    requiredBool?: boolean;
    nullableBool?: boolean | null;
    requiredFlaot?: number;
    nullableFloat?: number | null;
    requiredDecimal?: (Prisma.Decimal | Prisma.DecimalJsLike | string);
    nullableDecimal?: (Prisma.Decimal | Prisma.DecimalJsLike | string) | null;
    requiredJson?: Prisma.JsonNullValueInput | Prisma.InputJsonValue;
    nullableJson?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
    requriedBytes?: Buffer;
    nullableBytes?: Buffer | null;
    requiredBigInt?: (bigint | number);
    nullableBigInt?: (bigint | number) | null;
};

type FieldTypePatternModelFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<FieldTypePatternModelFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<FieldTypePatternModel, Prisma.FieldTypePatternModelCreateInput, TTransients>;

type FieldTypePatternModelFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<FieldTypePatternModelFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: FieldTypePatternModelFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<FieldTypePatternModel, Prisma.FieldTypePatternModelCreateInput, TTransients>;

type FieldTypePatternModelTraitKeys<TOptions extends FieldTypePatternModelFactoryDefineOptions<any>> = keyof TOptions["traits"];

export interface FieldTypePatternModelFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "FieldTypePatternModel";
    build(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>): PromiseLike<Prisma.FieldTypePatternModelCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>): PromiseLike<Prisma.FieldTypePatternModelCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>[]): PromiseLike<Prisma.FieldTypePatternModelCreateInput[]>;
    pickForConnect(inputData: FieldTypePatternModel): Pick<FieldTypePatternModel, "id">;
    create(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>): PromiseLike<FieldTypePatternModel>;
    createList(inputData: number | readonly Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>[]): PromiseLike<FieldTypePatternModel[]>;
    createForConnect(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>): PromiseLike<Pick<FieldTypePatternModel, "id">>;
}

export interface FieldTypePatternModelFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends FieldTypePatternModelFactoryDefineOptions<TTransients> = FieldTypePatternModelFactoryDefineOptions<TTransients>> extends FieldTypePatternModelFactoryInterfaceWithoutTraits<TTransients> {
    use(name: FieldTypePatternModelTraitKeys<TOptions>, ...names: readonly FieldTypePatternModelTraitKeys<TOptions>[]): FieldTypePatternModelFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateFieldTypePatternModelScalarsOrEnums({ seq }: {
    readonly seq: number;
}): FieldTypePatternModelScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().Int({ modelName: "FieldTypePatternModel", fieldName: "id", isId: true, isUnique: false, seq }),
        requiredInt: getScalarFieldValueGenerator().Int({ modelName: "FieldTypePatternModel", fieldName: "requiredInt", isId: false, isUnique: false, seq }),
        requiredStr: getScalarFieldValueGenerator().String({ modelName: "FieldTypePatternModel", fieldName: "requiredStr", isId: false, isUnique: false, seq }),
        requiredBool: getScalarFieldValueGenerator().Boolean({ modelName: "FieldTypePatternModel", fieldName: "requiredBool", isId: false, isUnique: false, seq }),
        requiredFlaot: getScalarFieldValueGenerator().Float({ modelName: "FieldTypePatternModel", fieldName: "requiredFlaot", isId: false, isUnique: false, seq }),
        requiredDecimal: getScalarFieldValueGenerator().Decimal({ modelName: "FieldTypePatternModel", fieldName: "requiredDecimal", isId: false, isUnique: false, seq }),
        requiredJson: getScalarFieldValueGenerator().Json({ modelName: "FieldTypePatternModel", fieldName: "requiredJson", isId: false, isUnique: false, seq }),
        requriedBytes: getScalarFieldValueGenerator().Bytes({ modelName: "FieldTypePatternModel", fieldName: "requriedBytes", isId: false, isUnique: false, seq }),
        requiredBigInt: getScalarFieldValueGenerator().BigInt({ modelName: "FieldTypePatternModel", fieldName: "requiredBigInt", isId: false, isUnique: false, seq })
    };
}

function defineFieldTypePatternModelFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends FieldTypePatternModelFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): FieldTypePatternModelFactoryInterface<TTransients, TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly FieldTypePatternModelTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("FieldTypePatternModel", modelFieldDefinitions);
        const handleAfterBuild = createCallbackChain([
            onAfterBuild,
            ...traitKeys.map(traitKey => traitsDefs[traitKey].onAfterBuild),
        ]);
        const handleBeforeCreate = createCallbackChain([
            ...traitKeys.slice().reverse().map(traitKey => traitsDefs[traitKey].onBeforeCreate),
            onBeforeCreate,
        ]);
        const handleAfterCreate = createCallbackChain([
            onAfterCreate,
            ...traitKeys.map(traitKey => traitsDefs[traitKey].onAfterCreate),
        ]);
        const build = async (inputData: Partial<Prisma.FieldTypePatternModelCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateFieldTypePatternModelScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<FieldTypePatternModelFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const transientFields = synthesize(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<FieldTypePatternModelFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {};
            const data: Prisma.FieldTypePatternModelCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: FieldTypePatternModel) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.FieldTypePatternModelCreateInput & TTransients> = {}) => {
            const data = await build(inputData).then(screen);
            const transientFields = synthesize(defaultTransientFieldValues, inputData);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().fieldTypePatternModel.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (inputData: number | readonly Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.FieldTypePatternModelCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "FieldTypePatternModel" as const,
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
    const useTraits = (name: FieldTypePatternModelTraitKeys<TOptions>, ...names: readonly FieldTypePatternModelTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface FieldTypePatternModelFactoryBuilder {
    <TOptions extends FieldTypePatternModelFactoryDefineOptions>(options?: TOptions): FieldTypePatternModelFactoryInterface<{}, TOptions>;
    withTransientFields: <TTransients extends Record<string, unknown>>(defaultTransientFieldValues: TTransients) => <TOptions extends FieldTypePatternModelFactoryDefineOptions<TTransients>>(options?: TOptions) => FieldTypePatternModelFactoryInterface<TTransients, TOptions>;
}

/**
 * Define factory for {@link FieldTypePatternModel} model.
 *
 * @param options
 * @returns factory {@link FieldTypePatternModelFactoryInterface}
 */
export const defineFieldTypePatternModelFactory = (<TOptions extends FieldTypePatternModelFactoryDefineOptions>(options?: TOptions): FieldTypePatternModelFactoryInterface<TOptions> => {
    return defineFieldTypePatternModelFactoryInternal(options ?? {}, {});
}) as FieldTypePatternModelFactoryBuilder;

defineFieldTypePatternModelFactory.withTransientFields = defaultTransientFieldValues => options => defineFieldTypePatternModelFactoryInternal(options ?? {}, defaultTransientFieldValues);

type NoPkModelScalarOrEnumFields = {
    id: number;
};

type NoPkModelFactoryDefineInput = {
    id?: number;
};

type NoPkModelFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<NoPkModelFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<NoPkModel, Prisma.NoPkModelCreateInput, TTransients>;

type NoPkModelFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<NoPkModelFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: NoPkModelFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<NoPkModel, Prisma.NoPkModelCreateInput, TTransients>;

type NoPkModelTraitKeys<TOptions extends NoPkModelFactoryDefineOptions<any>> = keyof TOptions["traits"];

export interface NoPkModelFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "NoPkModel";
    build(inputData?: Partial<Prisma.NoPkModelCreateInput & TTransients>): PromiseLike<Prisma.NoPkModelCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.NoPkModelCreateInput & TTransients>): PromiseLike<Prisma.NoPkModelCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.NoPkModelCreateInput & TTransients>[]): PromiseLike<Prisma.NoPkModelCreateInput[]>;
    pickForConnect(inputData: NoPkModel): Pick<NoPkModel, "id">;
    create(inputData?: Partial<Prisma.NoPkModelCreateInput & TTransients>): PromiseLike<NoPkModel>;
    createList(inputData: number | readonly Partial<Prisma.NoPkModelCreateInput & TTransients>[]): PromiseLike<NoPkModel[]>;
    createForConnect(inputData?: Partial<Prisma.NoPkModelCreateInput & TTransients>): PromiseLike<Pick<NoPkModel, "id">>;
}

export interface NoPkModelFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TOptions extends NoPkModelFactoryDefineOptions<TTransients> = NoPkModelFactoryDefineOptions<TTransients>> extends NoPkModelFactoryInterfaceWithoutTraits<TTransients> {
    use(name: NoPkModelTraitKeys<TOptions>, ...names: readonly NoPkModelTraitKeys<TOptions>[]): NoPkModelFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateNoPkModelScalarsOrEnums({ seq }: {
    readonly seq: number;
}): NoPkModelScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().Int({ modelName: "NoPkModel", fieldName: "id", isId: false, isUnique: true, seq })
    };
}

function defineNoPkModelFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends NoPkModelFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): NoPkModelFactoryInterface<TTransients, TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly NoPkModelTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("NoPkModel", modelFieldDefinitions);
        const handleAfterBuild = createCallbackChain([
            onAfterBuild,
            ...traitKeys.map(traitKey => traitsDefs[traitKey].onAfterBuild),
        ]);
        const handleBeforeCreate = createCallbackChain([
            ...traitKeys.slice().reverse().map(traitKey => traitsDefs[traitKey].onBeforeCreate),
            onBeforeCreate,
        ]);
        const handleAfterCreate = createCallbackChain([
            onAfterCreate,
            ...traitKeys.map(traitKey => traitsDefs[traitKey].onAfterCreate),
        ]);
        const build = async (inputData: Partial<Prisma.NoPkModelCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateNoPkModelScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<NoPkModelFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const transientFields = synthesize(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<NoPkModelFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {};
            const data: Prisma.NoPkModelCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.NoPkModelCreateInput & TTransients>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: NoPkModel) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.NoPkModelCreateInput & TTransients> = {}) => {
            const data = await build(inputData).then(screen);
            const transientFields = synthesize(defaultTransientFieldValues, inputData);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().noPkModel.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (inputData: number | readonly Partial<Prisma.NoPkModelCreateInput & TTransients>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.NoPkModelCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "NoPkModel" as const,
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
    const useTraits = (name: NoPkModelTraitKeys<TOptions>, ...names: readonly NoPkModelTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface NoPkModelFactoryBuilder {
    <TOptions extends NoPkModelFactoryDefineOptions>(options?: TOptions): NoPkModelFactoryInterface<{}, TOptions>;
    withTransientFields: <TTransients extends Record<string, unknown>>(defaultTransientFieldValues: TTransients) => <TOptions extends NoPkModelFactoryDefineOptions<TTransients>>(options?: TOptions) => NoPkModelFactoryInterface<TTransients, TOptions>;
}

/**
 * Define factory for {@link NoPkModel} model.
 *
 * @param options
 * @returns factory {@link NoPkModelFactoryInterface}
 */
export const defineNoPkModelFactory = (<TOptions extends NoPkModelFactoryDefineOptions>(options?: TOptions): NoPkModelFactoryInterface<TOptions> => {
    return defineNoPkModelFactoryInternal(options ?? {}, {});
}) as NoPkModelFactoryBuilder;

defineNoPkModelFactory.withTransientFields = defaultTransientFieldValues => options => defineNoPkModelFactoryInternal(options ?? {}, defaultTransientFieldValues);
