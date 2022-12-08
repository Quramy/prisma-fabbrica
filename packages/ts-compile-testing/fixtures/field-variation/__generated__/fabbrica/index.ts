import { User } from "./../client";
import { ComplexIdModel } from "./../client";
import { FieldTypePatternModel } from "./../client";
import { NoPkModel } from "./../client";
import { Role } from "./../client";
import { Prisma } from "./../client";
import type { PrismaClient } from "./../client";
import { getClient, ModelWithFields, createScreener, scalarFieldValueGenerator, Resolver, normalizeResolver, normalizeList, getSequenceCounter, } from "@quramy/prisma-fabbrica/lib/internal";
export { initialize, resetSequence } from "@quramy/prisma-fabbrica/lib/internal";
type BuildDataOptions = {
    readonly seq: number;
};
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
    }];
type UserScalarOrEnumFields = {
    id: string;
    role: Role;
};
type UserFactoryDefineInput = {
    id?: string;
    role?: Role;
    roleDefault?: Role;
    roles?: Prisma.UserCreaterolesInput | Prisma.Enumerable<Role>;
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
function autoGenerateUserScalarsOrEnums({ seq }: {
    readonly seq: number;
}): UserScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
        role: "USER"
    };
}
function defineUserFactoryInternal({ defaultData: defaultDataResolver }: UserFactoryDefineOptions): UserFactoryInterface {
    const seqKey = {};
    const getSeq = () => getSequenceCounter(seqKey);
    const screen = createScreener("User", modelFieldDefinitions);
    const build = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateUserScalarsOrEnums({ seq });
        const resolveValue = normalizeResolver<UserFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
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
        _factoryFor: "User" as const,
        build,
        buildList,
        buildCreateInput: build,
        pickForConnect,
        create,
        createList,
        createForConnect,
    };
}
/**
 * Define factory for {@link User} model.
 *
 * @params options
 * @returns factory {@link UserFactoryInterface}
 */
export function defineUserFactory(options: UserFactoryDefineOptions = {}): UserFactoryInterface {
    return defineUserFactoryInternal(options);
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
};
interface ComplexIdModelFactoryInterface {
    readonly _factoryFor: "ComplexIdModel";
    build(inputData?: Partial<Prisma.ComplexIdModelCreateInput>): PromiseLike<Prisma.ComplexIdModelCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.ComplexIdModelCreateInput>): PromiseLike<Prisma.ComplexIdModelCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.ComplexIdModelCreateInput>[]): PromiseLike<Prisma.ComplexIdModelCreateInput[]>;
    pickForConnect(inputData: ComplexIdModel): Pick<ComplexIdModel, "firstName" | "lastName">;
    create(inputData?: Partial<Prisma.ComplexIdModelCreateInput>): PromiseLike<ComplexIdModel>;
    createList(inputData: number | readonly Partial<Prisma.ComplexIdModelCreateInput>[]): PromiseLike<ComplexIdModel[]>;
    createForConnect(inputData?: Partial<Prisma.ComplexIdModelCreateInput>): PromiseLike<Pick<ComplexIdModel, "firstName" | "lastName">>;
}
function autoGenerateComplexIdModelScalarsOrEnums({ seq }: {
    readonly seq: number;
}): ComplexIdModelScalarOrEnumFields {
    return {
        firstName: scalarFieldValueGenerator.String({ modelName: "ComplexIdModel", fieldName: "firstName", isId: true, isUnique: false, seq }),
        lastName: scalarFieldValueGenerator.String({ modelName: "ComplexIdModel", fieldName: "lastName", isId: true, isUnique: false, seq })
    };
}
function defineComplexIdModelFactoryInternal({ defaultData: defaultDataResolver }: ComplexIdModelFactoryDefineOptions): ComplexIdModelFactoryInterface {
    const seqKey = {};
    const getSeq = () => getSequenceCounter(seqKey);
    const screen = createScreener("ComplexIdModel", modelFieldDefinitions);
    const build = async (inputData: Partial<Prisma.ComplexIdModelCreateInput> = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateComplexIdModelScalarsOrEnums({ seq });
        const resolveValue = normalizeResolver<ComplexIdModelFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
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
        _factoryFor: "ComplexIdModel" as const,
        build,
        buildList,
        buildCreateInput: build,
        pickForConnect,
        create,
        createList,
        createForConnect,
    };
}
/**
 * Define factory for {@link ComplexIdModel} model.
 *
 * @params options
 * @returns factory {@link ComplexIdModelFactoryInterface}
 */
export function defineComplexIdModelFactory(options: ComplexIdModelFactoryDefineOptions = {}): ComplexIdModelFactoryInterface {
    return defineComplexIdModelFactoryInternal(options);
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
    enumerableInt?: Prisma.FieldTypePatternModelCreateenumerableIntInput | Prisma.Enumerable<number>;
    requiredStr?: string;
    nullableStr?: string | null;
    enumerableStr?: Prisma.FieldTypePatternModelCreateenumerableStrInput | Prisma.Enumerable<string>;
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
};
interface FieldTypePatternModelFactoryInterface {
    readonly _factoryFor: "FieldTypePatternModel";
    build(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput>): PromiseLike<Prisma.FieldTypePatternModelCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput>): PromiseLike<Prisma.FieldTypePatternModelCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.FieldTypePatternModelCreateInput>[]): PromiseLike<Prisma.FieldTypePatternModelCreateInput[]>;
    pickForConnect(inputData: FieldTypePatternModel): Pick<FieldTypePatternModel, "id">;
    create(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput>): PromiseLike<FieldTypePatternModel>;
    createList(inputData: number | readonly Partial<Prisma.FieldTypePatternModelCreateInput>[]): PromiseLike<FieldTypePatternModel[]>;
    createForConnect(inputData?: Partial<Prisma.FieldTypePatternModelCreateInput>): PromiseLike<Pick<FieldTypePatternModel, "id">>;
}
function autoGenerateFieldTypePatternModelScalarsOrEnums({ seq }: {
    readonly seq: number;
}): FieldTypePatternModelScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.Int({ modelName: "FieldTypePatternModel", fieldName: "id", isId: true, isUnique: false, seq }),
        requiredInt: scalarFieldValueGenerator.Int({ modelName: "FieldTypePatternModel", fieldName: "requiredInt", isId: false, isUnique: false, seq }),
        requiredStr: scalarFieldValueGenerator.String({ modelName: "FieldTypePatternModel", fieldName: "requiredStr", isId: false, isUnique: false, seq }),
        requiredBool: scalarFieldValueGenerator.Boolean({ modelName: "FieldTypePatternModel", fieldName: "requiredBool", isId: false, isUnique: false, seq }),
        requiredFlaot: scalarFieldValueGenerator.Float({ modelName: "FieldTypePatternModel", fieldName: "requiredFlaot", isId: false, isUnique: false, seq }),
        requiredDecimal: scalarFieldValueGenerator.Decimal({ modelName: "FieldTypePatternModel", fieldName: "requiredDecimal", isId: false, isUnique: false, seq }),
        requiredJson: scalarFieldValueGenerator.Json({ modelName: "FieldTypePatternModel", fieldName: "requiredJson", isId: false, isUnique: false, seq }),
        requriedBytes: scalarFieldValueGenerator.Bytes({ modelName: "FieldTypePatternModel", fieldName: "requriedBytes", isId: false, isUnique: false, seq }),
        requiredBigInt: scalarFieldValueGenerator.BigInt({ modelName: "FieldTypePatternModel", fieldName: "requiredBigInt", isId: false, isUnique: false, seq })
    };
}
function defineFieldTypePatternModelFactoryInternal({ defaultData: defaultDataResolver }: FieldTypePatternModelFactoryDefineOptions): FieldTypePatternModelFactoryInterface {
    const seqKey = {};
    const getSeq = () => getSequenceCounter(seqKey);
    const screen = createScreener("FieldTypePatternModel", modelFieldDefinitions);
    const build = async (inputData: Partial<Prisma.FieldTypePatternModelCreateInput> = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateFieldTypePatternModelScalarsOrEnums({ seq });
        const resolveValue = normalizeResolver<FieldTypePatternModelFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
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
        _factoryFor: "FieldTypePatternModel" as const,
        build,
        buildList,
        buildCreateInput: build,
        pickForConnect,
        create,
        createList,
        createForConnect,
    };
}
/**
 * Define factory for {@link FieldTypePatternModel} model.
 *
 * @params options
 * @returns factory {@link FieldTypePatternModelFactoryInterface}
 */
export function defineFieldTypePatternModelFactory(options: FieldTypePatternModelFactoryDefineOptions = {}): FieldTypePatternModelFactoryInterface {
    return defineFieldTypePatternModelFactoryInternal(options);
}
type NoPkModelScalarOrEnumFields = {
    id: number;
};
type NoPkModelFactoryDefineInput = {
    id?: number;
};
type NoPkModelFactoryDefineOptions = {
    defaultData?: Resolver<NoPkModelFactoryDefineInput, BuildDataOptions>;
};
interface NoPkModelFactoryInterface {
    readonly _factoryFor: "NoPkModel";
    build(inputData?: Partial<Prisma.NoPkModelCreateInput>): PromiseLike<Prisma.NoPkModelCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.NoPkModelCreateInput>): PromiseLike<Prisma.NoPkModelCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.NoPkModelCreateInput>[]): PromiseLike<Prisma.NoPkModelCreateInput[]>;
    pickForConnect(inputData: NoPkModel): Pick<NoPkModel, "id">;
    create(inputData?: Partial<Prisma.NoPkModelCreateInput>): PromiseLike<NoPkModel>;
    createList(inputData: number | readonly Partial<Prisma.NoPkModelCreateInput>[]): PromiseLike<NoPkModel[]>;
    createForConnect(inputData?: Partial<Prisma.NoPkModelCreateInput>): PromiseLike<Pick<NoPkModel, "id">>;
}
function autoGenerateNoPkModelScalarsOrEnums({ seq }: {
    readonly seq: number;
}): NoPkModelScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.Int({ modelName: "NoPkModel", fieldName: "id", isId: false, isUnique: true, seq })
    };
}
function defineNoPkModelFactoryInternal({ defaultData: defaultDataResolver }: NoPkModelFactoryDefineOptions): NoPkModelFactoryInterface {
    const seqKey = {};
    const getSeq = () => getSequenceCounter(seqKey);
    const screen = createScreener("NoPkModel", modelFieldDefinitions);
    const build = async (inputData: Partial<Prisma.NoPkModelCreateInput> = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateNoPkModelScalarsOrEnums({ seq });
        const resolveValue = normalizeResolver<NoPkModelFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
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
        _factoryFor: "NoPkModel" as const,
        build,
        buildList,
        buildCreateInput: build,
        pickForConnect,
        create,
        createList,
        createForConnect,
    };
}
/**
 * Define factory for {@link NoPkModel} model.
 *
 * @params options
 * @returns factory {@link NoPkModelFactoryInterface}
 */
export function defineNoPkModelFactory(options: NoPkModelFactoryDefineOptions = {}): NoPkModelFactoryInterface {
    return defineNoPkModelFactoryInternal(options);
}
