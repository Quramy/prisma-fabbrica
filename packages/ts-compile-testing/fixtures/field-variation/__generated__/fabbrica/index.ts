import { User } from "./../client";
import { ComplexIdModel } from "./../client";
import { Role } from "./../client";
import { Prisma } from "./../client";
import type { PrismaClient } from "./../client";
import { getClient } from "@quramy/prisma-fabbrica/lib/clientHolder";
import scalarFieldValueGenerator from "@quramy/prisma-fabbrica/lib/scalar/gen";
import { Resolver, normalizeResolver, getSequenceCounter } from "@quramy/prisma-fabbrica/lib/helpers";
export { initialize, resetSequence } from "@quramy/prisma-fabbrica";
type BuildDataOptions = {
    readonly seq: number;
};
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
    const buildCreateInput = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateUserScalarsOrEnums({ seq });
        const resolveValue = normalizeResolver<UserFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
        const defaultAssociations = {};
        const data: Prisma.UserCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const pickForConnect = (inputData: User) => ({
        id: inputData.id
    });
    const create = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
        const data = await buildCreateInput(inputData);
        return await getClient<PrismaClient>().user.create({ data });
    };
    const createForConnect = (inputData: Partial<Prisma.UserCreateInput> = {}) => create(inputData).then(pickForConnect);
    return {
        _factoryFor: "User" as const,
        buildCreateInput,
        pickForConnect,
        create,
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
    const buildCreateInput = async (inputData: Partial<Prisma.ComplexIdModelCreateInput> = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateComplexIdModelScalarsOrEnums({ seq });
        const resolveValue = normalizeResolver<ComplexIdModelFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
        const defaultAssociations = {};
        const data: Prisma.ComplexIdModelCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const pickForConnect = (inputData: ComplexIdModel) => ({
        firstName: inputData.firstName,
        lastName: inputData.lastName
    });
    const create = async (inputData: Partial<Prisma.ComplexIdModelCreateInput> = {}) => {
        const data = await buildCreateInput(inputData);
        return await getClient<PrismaClient>().complexIdModel.create({ data });
    };
    const createForConnect = (inputData: Partial<Prisma.ComplexIdModelCreateInput> = {}) => create(inputData).then(pickForConnect);
    return {
        _factoryFor: "ComplexIdModel" as const,
        buildCreateInput,
        pickForConnect,
        create,
        createForConnect,
    };
}
export function defineComplexIdModelFactory(args: ComplexIdModelFactoryDefineOptions = {}) {
    return defineComplexIdModelFactoryInternal(args);
}
