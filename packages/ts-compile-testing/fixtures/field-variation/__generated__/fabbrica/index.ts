import { User } from "./../client";
import { ComplexIdModel } from "./../client";
import { FieldTypePatternModel } from "./../client";
import { NoPkModel } from "./../client";
import { Role } from "./../client";
import { Prisma } from "./../client";
import type { PrismaClient } from "./../client";
import { getClient, ModelWithFields, createScreener, scalarFieldValueGenerator, Resolver, normalizeResolver, getSequenceCounter, } from "@quramy/prisma-fabbrica/lib/internal";
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
function autoGenerateUserScalarsOrEnums({ seq }: {
    readonly seq: number;
}): UserScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
        role: "USER"
    };
}
function defineUserFactoryInternal({ defaultData: defaultDataResolver }: UserFactoryDefineOptions) {
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
    const buildList = (inputData: number | Partial<Prisma.UserCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => build(data)));
    };
    const pickForConnect = (inputData: User) => ({
        id: inputData.id
    });
    const create = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const data = await build(inputData).then(screen);
        return await getClient<PrismaClient>().user.create({ data });
    };
    const createList = (inputData: number | Partial<Prisma.UserCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => create(data)));
    };
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
export function defineUserFactory(args: UserFactoryDefineOptions = {}) {
    return defineUserFactoryInternal(args);
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
function autoGenerateComplexIdModelScalarsOrEnums({ seq }: {
    readonly seq: number;
}): ComplexIdModelScalarOrEnumFields {
    return {
        firstName: scalarFieldValueGenerator.String({ modelName: "ComplexIdModel", fieldName: "firstName", isId: true, isUnique: false, seq }),
        lastName: scalarFieldValueGenerator.String({ modelName: "ComplexIdModel", fieldName: "lastName", isId: true, isUnique: false, seq })
    };
}
function defineComplexIdModelFactoryInternal({ defaultData: defaultDataResolver }: ComplexIdModelFactoryDefineOptions) {
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
    const buildList = (inputData: number | Partial<Prisma.ComplexIdModelCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => build(data)));
    };
    const pickForConnect = (inputData: ComplexIdModel) => ({
        firstName: inputData.firstName,
        lastName: inputData.lastName
    });
    const create = async (inputData: Partial<Prisma.ComplexIdModelCreateInput> = {}) => {
        const data = await build(inputData).then(screen);
        return await getClient<PrismaClient>().complexIdModel.create({ data });
    };
    const createList = (inputData: number | Partial<Prisma.ComplexIdModelCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => create(data)));
    };
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
export function defineComplexIdModelFactory(args: ComplexIdModelFactoryDefineOptions = {}) {
    return defineComplexIdModelFactoryInternal(args);
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
function defineFieldTypePatternModelFactoryInternal({ defaultData: defaultDataResolver }: FieldTypePatternModelFactoryDefineOptions) {
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
    const buildList = (inputData: number | Partial<Prisma.FieldTypePatternModelCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => build(data)));
    };
    const pickForConnect = (inputData: FieldTypePatternModel) => ({
        id: inputData.id
    });
    const create = async (inputData: Partial<Prisma.FieldTypePatternModelCreateInput> = {}) => {
        const data = await build(inputData).then(screen);
        return await getClient<PrismaClient>().fieldTypePatternModel.create({ data });
    };
    const createList = (inputData: number | Partial<Prisma.FieldTypePatternModelCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => create(data)));
    };
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
export function defineFieldTypePatternModelFactory(args: FieldTypePatternModelFactoryDefineOptions = {}) {
    return defineFieldTypePatternModelFactoryInternal(args);
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
function autoGenerateNoPkModelScalarsOrEnums({ seq }: {
    readonly seq: number;
}): NoPkModelScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.Int({ modelName: "NoPkModel", fieldName: "id", isId: false, isUnique: true, seq })
    };
}
function defineNoPkModelFactoryInternal({ defaultData: defaultDataResolver }: NoPkModelFactoryDefineOptions) {
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
    const buildList = (inputData: number | Partial<Prisma.NoPkModelCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => build(data)));
    };
    const pickForConnect = (inputData: NoPkModel) => ({
        id: inputData.id
    });
    const create = async (inputData: Partial<Prisma.NoPkModelCreateInput> = {}) => {
        const data = await build(inputData).then(screen);
        return await getClient<PrismaClient>().noPkModel.create({ data });
    };
    const createList = (inputData: number | Partial<Prisma.NoPkModelCreateInput>[]) => {
        const list = typeof inputData === "number" ? [...new Array(inputData).keys()].map(() => ({})) : inputData;
        return Promise.all(list.map(data => create(data)));
    };
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
export function defineNoPkModelFactory(args: NoPkModelFactoryDefineOptions = {}) {
    return defineNoPkModelFactoryInternal(args);
}
