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
function autoGenrateUserScalarsOrEnums() {
    return {
        id: gen_1.default.String({ modelName: "User", fieldName: "id", isId: true, isUnique: false }),
        name: gen_1.default.String({ modelName: "User", fieldName: "name", isId: false, isUnique: false })
    };
}
function defineUserFactoryInternal({ defaultData: defaultDataResolver }) {
    const buildCreateInput = async (inputData = {}) => {
        const requiredScalarData = autoGenrateUserScalarsOrEnums();
        const defaultData = await (0, helpers_1.resolveValue)(defaultDataResolver ?? {});
        const defaultAssociations = {};
        const data = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const create = async (inputData = {}) => {
        const data = await buildCreateInput(inputData);
        return await (0, clientHolder_1.getClient)().user.create({ data });
    };
    return {
        _factoryFor: "User",
        buildCreateInput,
        create,
    };
}
function defineUserFactory(args = {}) {
    return defineUserFactoryInternal(args);
}
exports.defineUserFactory = defineUserFactory;
function isPostauthorFactory(x) {
    return x._factoryFor === "User";
}
function autoGenratePostScalarsOrEnums() {
    return {
        id: gen_1.default.String({ modelName: "Post", fieldName: "id", isId: true, isUnique: false }),
        title: gen_1.default.String({ modelName: "Post", fieldName: "title", isId: false, isUnique: false })
    };
}
function definePostFactoryInternal({ defaultData: defaultDataResolver }) {
    const buildCreateInput = async (inputData = {}) => {
        const requiredScalarData = autoGenratePostScalarsOrEnums();
        const defaultData = await (0, helpers_1.resolveValue)(defaultDataResolver ?? {});
        const defaultAssociations = {
            author: isPostauthorFactory(defaultData.author) ? {
                create: await defaultData.author.buildCreateInput()
            } : defaultData.author
        };
        const data = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const create = async (inputData = {}) => {
        const data = await buildCreateInput(inputData);
        return await (0, clientHolder_1.getClient)().post.create({ data });
    };
    return {
        _factoryFor: "Post",
        buildCreateInput,
        create,
    };
}
function definePostFactory(args) {
    return definePostFactoryInternal(args);
}
exports.definePostFactory = definePostFactory;
