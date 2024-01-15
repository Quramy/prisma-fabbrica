import type { User } from "../client";
import type { ComplexIdModel } from "../client";
import type { FieldTypePatternModel } from "../client";
import type { NoPkModel } from "../client";
import type { Role } from "../client";
import type { Status } from "../client";
import { Prisma } from "../client";
import type { PrismaClient } from "../client";
import { createInitializer, ModelWithFields, createScreener, getScalarFieldValueGenerator, Resolver, normalizeResolver, normalizeList, getSequenceCounter, } from "@quramy/prisma-fabbrica/lib/internal";
export { resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";

type BuildDataOptions = {
    readonly seq: number;
};

const initializer = createInitializer();

const { getClient } = initializer;

export const { initialize, reset } = initializer;

const factoryFor = Symbol("factoryFor");

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

type UserFactoryDefineOptions = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

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

function autoGenerateUserScalarsOrEnums({ seq }: {
    readonly seq: number;
}): UserScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
        role: "USER"
    };
}

function defineUserFactoryInternal<TOptions extends UserFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): UserFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly UserTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("User", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateUserScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<UserFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<UserFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {};
            const data: Prisma.UserCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.UserCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: User) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().user.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.UserCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.UserCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            [factoryFor]: "User" as const,
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

/**
 * Define factory for {@link User} model.
 *
 * @param options
 * @returns factory {@link UserFactoryInterface}
 */
export function defineUserFactory<TOptions extends UserFactoryDefineOptions>(options?: TOptions): UserFactoryInterface<TOptions> {
    return defineUserFactoryInternal(options ?? {});
}

type ComplexIdModelScalarOrEnumFields = {
    firstName: string;
    lastName: string;
};

type ComplexIdModelFactoryDefineInput = {
    firstName?: string;
    lastName?: string;
};

type ComplexIdModelFactoryDefineOptions = {
    defaultData?: Resolver<ComplexIdModelFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<ComplexIdModelFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

type ComplexIdModelTraitKeys<TOptions extends ComplexIdModelFactoryDefineOptions> = keyof TOptions["traits"];

export interface ComplexIdModelFactoryInterfaceWithoutTraits {
    readonly [factoryFor]: "ComplexIdModel";
    build(inputData?: Partial<Prisma.ComplexIdModelCreateInput>): PromiseLike<Prisma.ComplexIdModelCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.ComplexIdModelCreateInput>): PromiseLike<Prisma.ComplexIdModelCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.ComplexIdModelCreateInput>[]): PromiseLike<Prisma.ComplexIdModelCreateInput[]>;
    pickForConnect(inputData: ComplexIdModel): Pick<ComplexIdModel, "firstName" | "lastName">;
    create(inputData?: Partial<Prisma.ComplexIdModelCreateInput>): PromiseLike<ComplexIdModel>;
    createList(inputData: number | readonly Partial<Prisma.ComplexIdModelCreateInput>[]): PromiseLike<ComplexIdModel[]>;
    createForConnect(inputData?: Partial<Prisma.ComplexIdModelCreateInput>): PromiseLike<Pick<ComplexIdModel, "firstName" | "lastName">>;
}

export interface ComplexIdModelFactoryInterface<TOptions extends ComplexIdModelFactoryDefineOptions = ComplexIdModelFactoryDefineOptions> extends ComplexIdModelFactoryInterfaceWithoutTraits {
    use(name: ComplexIdModelTraitKeys<TOptions>, ...names: readonly ComplexIdModelTraitKeys<TOptions>[]): ComplexIdModelFactoryInterfaceWithoutTraits;
}

function autoGenerateComplexIdModelScalarsOrEnums({ seq }: {
    readonly seq: number;
}): ComplexIdModelScalarOrEnumFields {
    return {
        firstName: getScalarFieldValueGenerator().String({ modelName: "ComplexIdModel", fieldName: "firstName", isId: true, isUnique: false, seq }),
        lastName: getScalarFieldValueGenerator().String({ modelName: "ComplexIdModel", fieldName: "lastName", isId: true, isUnique: false, seq })
    };
}

function defineComplexIdModelFactoryInternal<TOptions extends ComplexIdModelFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): ComplexIdModelFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly ComplexIdModelTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("ComplexIdModel", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.ComplexIdModelCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateComplexIdModelScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<ComplexIdModelFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<ComplexIdModelFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {};
            const data: Prisma.ComplexIdModelCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.ComplexIdModelCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: ComplexIdModel) => ({
            firstName: inputData.firstName,
            lastName: inputData.lastName
        });
        const create = async (inputData: Partial<Prisma.ComplexIdModelCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().complexIdModel.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.ComplexIdModelCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.ComplexIdModelCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            [factoryFor]: "ComplexIdModel" as const,
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

/**
 * Define factory for {@link ComplexIdModel} model.
 *
 * @param options
 * @returns factory {@link ComplexIdModelFactoryInterface}
 */
export function defineComplexIdModelFactory<TOptions extends ComplexIdModelFactoryDefineOptions>(options?: TOptions): ComplexIdModelFactoryInterface<TOptions> {
    return defineComplexIdModelFactoryInternal(options ?? {});
}

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

type FieldTypePatternModelFactoryDefineOptions = {
    defaultData?: Resolver<FieldTypePatternModelFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<FieldTypePatternModelFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

type FieldTypePatternModelTraitKeys<TOptions extends FieldTypePatternModelFactoryDefineOptions> = keyof TOptions["traits"];

export interface FieldTypePatternModelFactoryInterfaceWithoutTraits {
    readonly [factoryFor]: "FieldTypePatternModel";
    build(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput>): PromiseLike<Prisma.FieldTypePatternModelCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput>): PromiseLike<Prisma.FieldTypePatternModelCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.FieldTypePatternModelCreateInput>[]): PromiseLike<Prisma.FieldTypePatternModelCreateInput[]>;
    pickForConnect(inputData: FieldTypePatternModel): Pick<FieldTypePatternModel, "id">;
    create(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput>): PromiseLike<FieldTypePatternModel>;
    createList(inputData: number | readonly Partial<Prisma.FieldTypePatternModelCreateInput>[]): PromiseLike<FieldTypePatternModel[]>;
    createForConnect(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput>): PromiseLike<Pick<FieldTypePatternModel, "id">>;
}

export interface FieldTypePatternModelFactoryInterface<TOptions extends FieldTypePatternModelFactoryDefineOptions = FieldTypePatternModelFactoryDefineOptions> extends FieldTypePatternModelFactoryInterfaceWithoutTraits {
    use(name: FieldTypePatternModelTraitKeys<TOptions>, ...names: readonly FieldTypePatternModelTraitKeys<TOptions>[]): FieldTypePatternModelFactoryInterfaceWithoutTraits;
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

function defineFieldTypePatternModelFactoryInternal<TOptions extends FieldTypePatternModelFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): FieldTypePatternModelFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly FieldTypePatternModelTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("FieldTypePatternModel", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.FieldTypePatternModelCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateFieldTypePatternModelScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<FieldTypePatternModelFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<FieldTypePatternModelFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {};
            const data: Prisma.FieldTypePatternModelCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.FieldTypePatternModelCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: FieldTypePatternModel) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.FieldTypePatternModelCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().fieldTypePatternModel.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.FieldTypePatternModelCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.FieldTypePatternModelCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            [factoryFor]: "FieldTypePatternModel" as const,
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

/**
 * Define factory for {@link FieldTypePatternModel} model.
 *
 * @param options
 * @returns factory {@link FieldTypePatternModelFactoryInterface}
 */
export function defineFieldTypePatternModelFactory<TOptions extends FieldTypePatternModelFactoryDefineOptions>(options?: TOptions): FieldTypePatternModelFactoryInterface<TOptions> {
    return defineFieldTypePatternModelFactoryInternal(options ?? {});
}

type NoPkModelScalarOrEnumFields = {
    id: number;
};

type NoPkModelFactoryDefineInput = {
    id?: number;
};

type NoPkModelFactoryDefineOptions = {
    defaultData?: Resolver<NoPkModelFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<NoPkModelFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

type NoPkModelTraitKeys<TOptions extends NoPkModelFactoryDefineOptions> = keyof TOptions["traits"];

export interface NoPkModelFactoryInterfaceWithoutTraits {
    readonly [factoryFor]: "NoPkModel";
    build(inputData?: Partial<Prisma.NoPkModelCreateInput>): PromiseLike<Prisma.NoPkModelCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.NoPkModelCreateInput>): PromiseLike<Prisma.NoPkModelCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.NoPkModelCreateInput>[]): PromiseLike<Prisma.NoPkModelCreateInput[]>;
    pickForConnect(inputData: NoPkModel): Pick<NoPkModel, "id">;
    create(inputData?: Partial<Prisma.NoPkModelCreateInput>): PromiseLike<NoPkModel>;
    createList(inputData: number | readonly Partial<Prisma.NoPkModelCreateInput>[]): PromiseLike<NoPkModel[]>;
    createForConnect(inputData?: Partial<Prisma.NoPkModelCreateInput>): PromiseLike<Pick<NoPkModel, "id">>;
}

export interface NoPkModelFactoryInterface<TOptions extends NoPkModelFactoryDefineOptions = NoPkModelFactoryDefineOptions> extends NoPkModelFactoryInterfaceWithoutTraits {
    use(name: NoPkModelTraitKeys<TOptions>, ...names: readonly NoPkModelTraitKeys<TOptions>[]): NoPkModelFactoryInterfaceWithoutTraits;
}

function autoGenerateNoPkModelScalarsOrEnums({ seq }: {
    readonly seq: number;
}): NoPkModelScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().Int({ modelName: "NoPkModel", fieldName: "id", isId: false, isUnique: true, seq })
    };
}

function defineNoPkModelFactoryInternal<TOptions extends NoPkModelFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): NoPkModelFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly NoPkModelTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("NoPkModel", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.NoPkModelCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateNoPkModelScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<NoPkModelFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<NoPkModelFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {};
            const data: Prisma.NoPkModelCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.NoPkModelCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: NoPkModel) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.NoPkModelCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().noPkModel.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.NoPkModelCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.NoPkModelCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            [factoryFor]: "NoPkModel" as const,
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

/**
 * Define factory for {@link NoPkModel} model.
 *
 * @param options
 * @returns factory {@link NoPkModelFactoryInterface}
 */
export function defineNoPkModelFactory<TOptions extends NoPkModelFactoryDefineOptions>(options?: TOptions): NoPkModelFactoryInterface<TOptions> {
    return defineNoPkModelFactoryInternal(options ?? {});
}
