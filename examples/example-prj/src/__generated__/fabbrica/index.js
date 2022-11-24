"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.definePostFactory = exports.defineUserFactory = exports.initialize = void 0;
const clientHolder_1 = require("@quramy/prisma-fabbrica/lib/clientHolder");
const gen_1 = __importDefault(require("@quramy/prisma-fabbrica/lib/scalar/gen"));
const helpers_1 = require("@quramy/prisma-fabbrica/lib/helpers");
var prisma_fabbrica_1 = require("@quramy/prisma-fabbrica");
Object.defineProperty(exports, "initialize", { enumerable: true, get: function () { return prisma_fabbrica_1.initialize; } });
function autoGenerateUserScalarsOrEnums() {
    return {
        id: gen_1.default.String({ modelName: "User", fieldName: "id", isId: true, isUnique: false }),
        name: gen_1.default.String({ modelName: "User", fieldName: "name", isId: false, isUnique: false })
    };
}
function defineUserFactoryInternal({ defaultData: defaultDataResolver }) {
    const buildCreateInput = async (inputData = {}) => {
        const requiredScalarData = autoGenerateUserScalarsOrEnums();
        const defaultData = await (0, helpers_1.resolveValue)(defaultDataResolver ?? {});
        const defaultAssociations = {};
        const data = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const pickForConnect = (inputData) => ({
        id: inputData.id
    });
    const create = async (inputData = {}) => {
        const data = await buildCreateInput(inputData);
        return await (0, clientHolder_1.getClient)().user.create({ data });
    };
    const createForConnect = (inputData = {}) => create(inputData).then(pickForConnect);
    return {
        _factoryFor: "User",
        buildCreateInput,
        pickForConnect,
        create,
        createForConnect,
    };
}
function defineUserFactory(args = {}) {
    return defineUserFactoryInternal(args);
}
exports.defineUserFactory = defineUserFactory;
function isPostauthorFactory(x) {
    return x?._factoryFor === "User";
}
function autoGeneratePostScalarsOrEnums() {
    return {
        id: gen_1.default.String({ modelName: "Post", fieldName: "id", isId: true, isUnique: false }),
        title: gen_1.default.String({ modelName: "Post", fieldName: "title", isId: false, isUnique: false })
    };
}
function definePostFactoryInternal({ defaultData: defaultDataResolver }) {
    const buildCreateInput = async (inputData = {}) => {
        const requiredScalarData = autoGeneratePostScalarsOrEnums();
        const defaultData = await (0, helpers_1.resolveValue)(defaultDataResolver ?? {});
        const defaultAssociations = {
            author: isPostauthorFactory(defaultData.author) ? {
                create: await defaultData.author.buildCreateInput()
            } : defaultData.author
        };
        const data = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const pickForConnect = (inputData) => ({
        id: inputData.id
    });
    const create = async (inputData = {}) => {
        const data = await buildCreateInput(inputData);
        return await (0, clientHolder_1.getClient)().post.create({ data });
    };
    const createForConnect = (inputData = {}) => create(inputData).then(pickForConnect);
    return {
        _factoryFor: "Post",
        buildCreateInput,
        pickForConnect,
        create,
        createForConnect,
    };
}
function definePostFactory(args) {
    return definePostFactoryInternal(args);
}
exports.definePostFactory = definePostFactory;
//# sourceMappingURL=index.js.map