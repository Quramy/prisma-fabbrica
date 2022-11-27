import { User } from "./../client";
import { ComplexIdModel } from "./../client";
import { Role } from "./../client";
import { Prisma } from "./../client";
import type { PrismaClient } from "./../client";
import { getClient } from "@quramy/prisma-fabbrica/lib/clientHolder";
import { ModelWithFields, createScreener } from "@quramy/prisma-fabbrica/lib/relations";
import scalarFieldValueGenerator from "@quramy/prisma-fabbrica/lib/scalar/gen";
import { Resolver, normalizeResolver, getSequenceCounter } from "@quramy/prisma-fabbrica/lib/helpers";
export { initialize, resetSequence } from "@quramy/prisma-fabbrica";
type BuildDataOptions = {
    readonly seq: number;
};
const modelFieldDefinitions: ModelWithFields[] = [{
        name: "User",
        fields: []
    }, {
        name: "ComplexIdModel",
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
type UserFactoryTraitOptions = {
    data: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions>;
};
type UserFactoryDefineOptions = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions>;
    traits?: Record<string, UserFactoryTraitOptions>;
};
function autoGenerateUserScalarsOrEnums({ seq }: {
    readonly seq: number;
}): UserScalarOrEnumFields {
    return {
        id: scalarFieldValueGenerator.String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
        role: "USER"
    };
}
function defineUserFactoryInternal<TOptions extends UserFactoryDefineOptions, TTraitKey extends keyof TOptions["traits"]>({ defaultData: defaultDataResolver }: TOptions) {
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
export function defineUserFactory<TOptions extends UserFactoryDefineOptions, TTraitKey extends keyof TOptions["traits"]>(args?: TOptions) {
    return defineUserFactoryInternal<TOptions, TTraitKey>(args ?? ({} as TOptions));
}
type ComplexIdModelScalarOrEnumFields = {
    firstName: string;
    lastName: string;
};
type ComplexIdModelFactoryDefineInput = {
    firstName?: string;
    lastName?: string;
};
type ComplexIdModelFactoryTraitOptions = {
    data: Resolver<Partial<ComplexIdModelFactoryDefineInput>, BuildDataOptions>;
};
type ComplexIdModelFactoryDefineOptions = {
    defaultData?: Resolver<ComplexIdModelFactoryDefineInput, BuildDataOptions>;
    traits?: Record<string, ComplexIdModelFactoryTraitOptions>;
};
function autoGenerateComplexIdModelScalarsOrEnums({ seq }: {
    readonly seq: number;
}): ComplexIdModelScalarOrEnumFields {
    return {
        firstName: scalarFieldValueGenerator.String({ modelName: "ComplexIdModel", fieldName: "firstName", isId: true, isUnique: false, seq }),
        lastName: scalarFieldValueGenerator.String({ modelName: "ComplexIdModel", fieldName: "lastName", isId: true, isUnique: false, seq })
    };
}
function defineComplexIdModelFactoryInternal<TOptions extends ComplexIdModelFactoryDefineOptions, TTraitKey extends keyof TOptions["traits"]>({ defaultData: defaultDataResolver }: TOptions) {
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
export function defineComplexIdModelFactory<TOptions extends ComplexIdModelFactoryDefineOptions, TTraitKey extends keyof TOptions["traits"]>(args?: TOptions) {
    return defineComplexIdModelFactoryInternal<TOptions, TTraitKey>(args ?? ({} as TOptions));
}
