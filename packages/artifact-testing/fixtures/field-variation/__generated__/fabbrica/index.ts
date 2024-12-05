import type { EnumModel } from "../client";
import type { ComplexIdModel } from "../client";
import type { FieldTypePatternModel } from "../client";
import type { NoPkModel } from "../client";
import type { SampleEnum } from "../client";
import type { Prisma, PrismaClient } from "../client";
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
        name: "EnumModel",
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

type EnumModelScalarOrEnumFields = {
    id: string;
    requiredEnum: SampleEnum;
};

type EnumModelFactoryDefineInput = {
    id?: string;
    requiredEnum?: SampleEnum;
    requiredEnumWithDefault?: SampleEnum;
    optionalEnum?: SampleEnum | null;
    enumerableEnum?: Prisma.EnumModelCreateenumerableEnumInput | Array<SampleEnum>;
};

type EnumModelTransientFields = Record<string, unknown> & Partial<Record<keyof EnumModelFactoryDefineInput, never>>;

type EnumModelFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<EnumModelFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<EnumModel, Prisma.EnumModelCreateInput, TTransients>;

type EnumModelFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<EnumModelFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: TraitName]: EnumModelFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<EnumModel, Prisma.EnumModelCreateInput, TTransients>;

type EnumModelTraitKeys<TOptions extends EnumModelFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;

export interface EnumModelFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "EnumModel";
    build(inputData?: Partial<Prisma.EnumModelCreateInput & TTransients>): PromiseLike<Prisma.EnumModelCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.EnumModelCreateInput & TTransients>): PromiseLike<Prisma.EnumModelCreateInput>;
    buildList(list: readonly Partial<Prisma.EnumModelCreateInput & TTransients>[]): PromiseLike<Prisma.EnumModelCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.EnumModelCreateInput & TTransients>): PromiseLike<Prisma.EnumModelCreateInput[]>;
    pickForConnect(inputData: EnumModel): Pick<EnumModel, "id">;
    create(inputData?: Partial<Prisma.EnumModelCreateInput & TTransients>): PromiseLike<EnumModel>;
    createList(list: readonly Partial<Prisma.EnumModelCreateInput & TTransients>[]): PromiseLike<EnumModel[]>;
    createList(count: number, item?: Partial<Prisma.EnumModelCreateInput & TTransients>): PromiseLike<EnumModel[]>;
    createForConnect(inputData?: Partial<Prisma.EnumModelCreateInput & TTransients>): PromiseLike<Pick<EnumModel, "id">>;
}

export interface EnumModelFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends EnumModelFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): EnumModelFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateEnumModelScalarsOrEnums({ seq }: {
    readonly seq: number;
}): EnumModelScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "EnumModel", fieldName: "id", isId: true, isUnique: false, seq }),
        requiredEnum: "HOGE"
    };
}

function defineEnumModelFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends EnumModelFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): EnumModelFactoryInterface<TTransients, EnumModelTraitKeys<TOptions>> {
    const getFactoryWithTraits = (traitKeys: readonly EnumModelTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("EnumModel", modelFieldDefinitions);
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
        const build = async (inputData: Partial<Prisma.EnumModelCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateEnumModelScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<EnumModelFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const [transientFields, filteredInputData] = destructure(defaultTransientFieldValues, inputData);
            const resolverInput = { seq, ...transientFields };
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<EnumModelFactoryDefineInput>, BuildDataOptions<TTransients>>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue(resolverInput);
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue(resolverInput));
            const defaultAssociations = {} as Prisma.EnumModelCreateInput;
            const data: Prisma.EnumModelCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.EnumModelCreateInput & TTransients>>(...args).map(data => build(data)));
        const pickForConnect = (inputData: EnumModel) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.EnumModelCreateInput & TTransients> = {}) => {
            const [transientFields] = destructure(defaultTransientFieldValues, inputData);
            const data = await build(inputData).then(screen);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().enumModel.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.EnumModelCreateInput & TTransients>>(...args).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.EnumModelCreateInput & TTransients> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "EnumModel" as const,
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
    const useTraits = (name: EnumModelTraitKeys<TOptions>, ...names: readonly EnumModelTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

interface EnumModelFactoryBuilder {
    <TOptions extends EnumModelFactoryDefineOptions>(options?: TOptions): EnumModelFactoryInterface<{}, EnumModelTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends EnumModelTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends EnumModelFactoryDefineOptions<TTransients>>(options?: TOptions) => EnumModelFactoryInterface<TTransients, EnumModelTraitKeys<TOptions>>;
}

/**
 * Define factory for {@link EnumModel} model.
 *
 * @param options
 * @returns factory {@link EnumModelFactoryInterface}
 */
export const defineEnumModelFactory = (<TOptions extends EnumModelFactoryDefineOptions>(options?: TOptions): EnumModelFactoryInterface<TOptions> => {
    return defineEnumModelFactoryInternal(options ?? {}, {});
}) as EnumModelFactoryBuilder;

defineEnumModelFactory.withTransientFields = defaultTransientFieldValues => options => defineEnumModelFactoryInternal(options ?? {}, defaultTransientFieldValues);

type ComplexIdModelScalarOrEnumFields = {
    firstName: string;
    lastName: string;
};

type ComplexIdModelFactoryDefineInput = {
    firstName?: string;
    lastName?: string;
};

type ComplexIdModelTransientFields = Record<string, unknown> & Partial<Record<keyof ComplexIdModelFactoryDefineInput, never>>;

type ComplexIdModelFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<ComplexIdModelFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<ComplexIdModel, Prisma.ComplexIdModelCreateInput, TTransients>;

type ComplexIdModelFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<ComplexIdModelFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: TraitName]: ComplexIdModelFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<ComplexIdModel, Prisma.ComplexIdModelCreateInput, TTransients>;

type ComplexIdModelTraitKeys<TOptions extends ComplexIdModelFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;

export interface ComplexIdModelFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "ComplexIdModel";
    build(inputData?: Partial<Prisma.ComplexIdModelCreateInput & TTransients>): PromiseLike<Prisma.ComplexIdModelCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.ComplexIdModelCreateInput & TTransients>): PromiseLike<Prisma.ComplexIdModelCreateInput>;
    buildList(list: readonly Partial<Prisma.ComplexIdModelCreateInput & TTransients>[]): PromiseLike<Prisma.ComplexIdModelCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.ComplexIdModelCreateInput & TTransients>): PromiseLike<Prisma.ComplexIdModelCreateInput[]>;
    pickForConnect(inputData: ComplexIdModel): Pick<ComplexIdModel, "firstName" | "lastName">;
    create(inputData?: Partial<Prisma.ComplexIdModelCreateInput & TTransients>): PromiseLike<ComplexIdModel>;
    createList(list: readonly Partial<Prisma.ComplexIdModelCreateInput & TTransients>[]): PromiseLike<ComplexIdModel[]>;
    createList(count: number, item?: Partial<Prisma.ComplexIdModelCreateInput & TTransients>): PromiseLike<ComplexIdModel[]>;
    createForConnect(inputData?: Partial<Prisma.ComplexIdModelCreateInput & TTransients>): PromiseLike<Pick<ComplexIdModel, "firstName" | "lastName">>;
}

export interface ComplexIdModelFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends ComplexIdModelFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): ComplexIdModelFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateComplexIdModelScalarsOrEnums({ seq }: {
    readonly seq: number;
}): ComplexIdModelScalarOrEnumFields {
    return {
        firstName: getScalarFieldValueGenerator().String({ modelName: "ComplexIdModel", fieldName: "firstName", isId: true, isUnique: false, seq }),
        lastName: getScalarFieldValueGenerator().String({ modelName: "ComplexIdModel", fieldName: "lastName", isId: true, isUnique: false, seq })
    };
}

function defineComplexIdModelFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends ComplexIdModelFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): ComplexIdModelFactoryInterface<TTransients, ComplexIdModelTraitKeys<TOptions>> {
    const getFactoryWithTraits = (traitKeys: readonly ComplexIdModelTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("ComplexIdModel", modelFieldDefinitions);
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
        const build = async (inputData: Partial<Prisma.ComplexIdModelCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateComplexIdModelScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<ComplexIdModelFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const [transientFields, filteredInputData] = destructure(defaultTransientFieldValues, inputData);
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
            const defaultAssociations = {} as Prisma.ComplexIdModelCreateInput;
            const data: Prisma.ComplexIdModelCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.ComplexIdModelCreateInput & TTransients>>(...args).map(data => build(data)));
        const pickForConnect = (inputData: ComplexIdModel) => ({
            firstName: inputData.firstName,
            lastName: inputData.lastName
        });
        const create = async (inputData: Partial<Prisma.ComplexIdModelCreateInput & TTransients> = {}) => {
            const [transientFields] = destructure(defaultTransientFieldValues, inputData);
            const data = await build(inputData).then(screen);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().complexIdModel.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.ComplexIdModelCreateInput & TTransients>>(...args).map(data => create(data)));
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
    <TOptions extends ComplexIdModelFactoryDefineOptions>(options?: TOptions): ComplexIdModelFactoryInterface<{}, ComplexIdModelTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends ComplexIdModelTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends ComplexIdModelFactoryDefineOptions<TTransients>>(options?: TOptions) => ComplexIdModelFactoryInterface<TTransients, ComplexIdModelTraitKeys<TOptions>>;
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

type FieldTypePatternModelTransientFields = Record<string, unknown> & Partial<Record<keyof FieldTypePatternModelFactoryDefineInput, never>>;

type FieldTypePatternModelFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<FieldTypePatternModelFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<FieldTypePatternModel, Prisma.FieldTypePatternModelCreateInput, TTransients>;

type FieldTypePatternModelFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<FieldTypePatternModelFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: TraitName]: FieldTypePatternModelFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<FieldTypePatternModel, Prisma.FieldTypePatternModelCreateInput, TTransients>;

type FieldTypePatternModelTraitKeys<TOptions extends FieldTypePatternModelFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;

export interface FieldTypePatternModelFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "FieldTypePatternModel";
    build(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>): PromiseLike<Prisma.FieldTypePatternModelCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>): PromiseLike<Prisma.FieldTypePatternModelCreateInput>;
    buildList(list: readonly Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>[]): PromiseLike<Prisma.FieldTypePatternModelCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>): PromiseLike<Prisma.FieldTypePatternModelCreateInput[]>;
    pickForConnect(inputData: FieldTypePatternModel): Pick<FieldTypePatternModel, "id">;
    create(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>): PromiseLike<FieldTypePatternModel>;
    createList(list: readonly Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>[]): PromiseLike<FieldTypePatternModel[]>;
    createList(count: number, item?: Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>): PromiseLike<FieldTypePatternModel[]>;
    createForConnect(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>): PromiseLike<Pick<FieldTypePatternModel, "id">>;
}

export interface FieldTypePatternModelFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends FieldTypePatternModelFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): FieldTypePatternModelFactoryInterfaceWithoutTraits<TTransients>;
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

function defineFieldTypePatternModelFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends FieldTypePatternModelFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): FieldTypePatternModelFactoryInterface<TTransients, FieldTypePatternModelTraitKeys<TOptions>> {
    const getFactoryWithTraits = (traitKeys: readonly FieldTypePatternModelTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("FieldTypePatternModel", modelFieldDefinitions);
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
        const build = async (inputData: Partial<Prisma.FieldTypePatternModelCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateFieldTypePatternModelScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<FieldTypePatternModelFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const [transientFields, filteredInputData] = destructure(defaultTransientFieldValues, inputData);
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
            const defaultAssociations = {} as Prisma.FieldTypePatternModelCreateInput;
            const data: Prisma.FieldTypePatternModelCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>>(...args).map(data => build(data)));
        const pickForConnect = (inputData: FieldTypePatternModel) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.FieldTypePatternModelCreateInput & TTransients> = {}) => {
            const [transientFields] = destructure(defaultTransientFieldValues, inputData);
            const data = await build(inputData).then(screen);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().fieldTypePatternModel.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.FieldTypePatternModelCreateInput & TTransients>>(...args).map(data => create(data)));
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
    <TOptions extends FieldTypePatternModelFactoryDefineOptions>(options?: TOptions): FieldTypePatternModelFactoryInterface<{}, FieldTypePatternModelTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends FieldTypePatternModelTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends FieldTypePatternModelFactoryDefineOptions<TTransients>>(options?: TOptions) => FieldTypePatternModelFactoryInterface<TTransients, FieldTypePatternModelTraitKeys<TOptions>>;
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

type NoPkModelTransientFields = Record<string, unknown> & Partial<Record<keyof NoPkModelFactoryDefineInput, never>>;

type NoPkModelFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<NoPkModelFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<NoPkModel, Prisma.NoPkModelCreateInput, TTransients>;

type NoPkModelFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<NoPkModelFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: TraitName]: NoPkModelFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<NoPkModel, Prisma.NoPkModelCreateInput, TTransients>;

type NoPkModelTraitKeys<TOptions extends NoPkModelFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;

export interface NoPkModelFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "NoPkModel";
    build(inputData?: Partial<Prisma.NoPkModelCreateInput & TTransients>): PromiseLike<Prisma.NoPkModelCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.NoPkModelCreateInput & TTransients>): PromiseLike<Prisma.NoPkModelCreateInput>;
    buildList(list: readonly Partial<Prisma.NoPkModelCreateInput & TTransients>[]): PromiseLike<Prisma.NoPkModelCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.NoPkModelCreateInput & TTransients>): PromiseLike<Prisma.NoPkModelCreateInput[]>;
    pickForConnect(inputData: NoPkModel): Pick<NoPkModel, "id">;
    create(inputData?: Partial<Prisma.NoPkModelCreateInput & TTransients>): PromiseLike<NoPkModel>;
    createList(list: readonly Partial<Prisma.NoPkModelCreateInput & TTransients>[]): PromiseLike<NoPkModel[]>;
    createList(count: number, item?: Partial<Prisma.NoPkModelCreateInput & TTransients>): PromiseLike<NoPkModel[]>;
    createForConnect(inputData?: Partial<Prisma.NoPkModelCreateInput & TTransients>): PromiseLike<Pick<NoPkModel, "id">>;
}

export interface NoPkModelFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends NoPkModelFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): NoPkModelFactoryInterfaceWithoutTraits<TTransients>;
}

function autoGenerateNoPkModelScalarsOrEnums({ seq }: {
    readonly seq: number;
}): NoPkModelScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().Int({ modelName: "NoPkModel", fieldName: "id", isId: false, isUnique: true, seq })
    };
}

function defineNoPkModelFactoryInternal<TTransients extends Record<string, unknown>, TOptions extends NoPkModelFactoryDefineOptions<TTransients>>({ defaultData: defaultDataResolver, onAfterBuild, onBeforeCreate, onAfterCreate, traits: traitsDefs = {} }: TOptions, defaultTransientFieldValues: TTransients): NoPkModelFactoryInterface<TTransients, NoPkModelTraitKeys<TOptions>> {
    const getFactoryWithTraits = (traitKeys: readonly NoPkModelTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("NoPkModel", modelFieldDefinitions);
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
        const build = async (inputData: Partial<Prisma.NoPkModelCreateInput & TTransients> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateNoPkModelScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<NoPkModelFactoryDefineInput, BuildDataOptions<any>>(defaultDataResolver ?? {});
            const [transientFields, filteredInputData] = destructure(defaultTransientFieldValues, inputData);
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
            const defaultAssociations = {} as Prisma.NoPkModelCreateInput;
            const data: Prisma.NoPkModelCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...filteredInputData };
            await handleAfterBuild(data, transientFields);
            return data;
        };
        const buildList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.NoPkModelCreateInput & TTransients>>(...args).map(data => build(data)));
        const pickForConnect = (inputData: NoPkModel) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.NoPkModelCreateInput & TTransients> = {}) => {
            const [transientFields] = destructure(defaultTransientFieldValues, inputData);
            const data = await build(inputData).then(screen);
            await handleBeforeCreate(data, transientFields);
            const createdData = await getClient<PrismaClient>().noPkModel.create({ data });
            await handleAfterCreate(createdData, transientFields);
            return createdData;
        };
        const createList = (...args: unknown[]) => Promise.all(normalizeList<Partial<Prisma.NoPkModelCreateInput & TTransients>>(...args).map(data => create(data)));
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
    <TOptions extends NoPkModelFactoryDefineOptions>(options?: TOptions): NoPkModelFactoryInterface<{}, NoPkModelTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends NoPkModelTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends NoPkModelFactoryDefineOptions<TTransients>>(options?: TOptions) => NoPkModelFactoryInterface<TTransients, NoPkModelTraitKeys<TOptions>>;
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
