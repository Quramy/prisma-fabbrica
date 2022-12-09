"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineCategoryFactory = exports.defineCommentFactory = exports.definePostFactory = exports.defineUserFactory = exports.resetSequence = exports.initialize = void 0;
const internal_1 = require("@quramy/prisma-fabbrica/lib/internal");
var internal_2 = require("@quramy/prisma-fabbrica/lib/internal");
Object.defineProperty(exports, "initialize", { enumerable: true, get: function () { return internal_2.initialize; } });
Object.defineProperty(exports, "resetSequence", { enumerable: true, get: function () { return internal_2.resetSequence; } });
const modelFieldDefinitions = [{
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
function autoGenerateUserScalarsOrEnums({ seq }) {
    return {
        id: internal_1.scalarFieldValueGenerator.String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
        email: internal_1.scalarFieldValueGenerator.String({ modelName: "User", fieldName: "email", isId: false, isUnique: true, seq }),
        name: internal_1.scalarFieldValueGenerator.String({ modelName: "User", fieldName: "name", isId: false, isUnique: false, seq })
    };
}
function defineUserFactoryInternal({ defaultData: defaultDataResolver }) {
    const seqKey = {};
    const getSeq = () => (0, internal_1.getSequenceCounter)(seqKey);
    const screen = (0, internal_1.createScreener)("User", modelFieldDefinitions);
    const build = async (inputData = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateUserScalarsOrEnums({ seq });
        const resolveValue = (0, internal_1.normalizeResolver)(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
        const defaultAssociations = {};
        const data = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const buildList = (inputData) => Promise.all((0, internal_1.normalizeList)(inputData).map(data => build(data)));
    const pickForConnect = (inputData) => ({
        id: inputData.id
    });
    const create = async (inputData = {}) => {
        const data = await build(inputData).then(screen);
        return await (0, internal_1.getClient)().user.create({ data });
    };
    const createList = (inputData) => Promise.all((0, internal_1.normalizeList)(inputData).map(data => create(data)));
    const createForConnect = (inputData = {}) => create(inputData).then(pickForConnect);
    return {
        _factoryFor: "User",
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
 * @param options
 * @returns factory {@link UserFactoryInterface}
 */
function defineUserFactory(options = {}) {
    return defineUserFactoryInternal(options);
}
exports.defineUserFactory = defineUserFactory;
function isPostauthorFactory(x) {
    return x?._factoryFor === "User";
}
function autoGeneratePostScalarsOrEnums({ seq }) {
    return {
        id: internal_1.scalarFieldValueGenerator.String({ modelName: "Post", fieldName: "id", isId: true, isUnique: false, seq }),
        title: internal_1.scalarFieldValueGenerator.String({ modelName: "Post", fieldName: "title", isId: false, isUnique: false, seq })
    };
}
function definePostFactoryInternal({ defaultData: defaultDataResolver }) {
    const seqKey = {};
    const getSeq = () => (0, internal_1.getSequenceCounter)(seqKey);
    const screen = (0, internal_1.createScreener)("Post", modelFieldDefinitions);
    const build = async (inputData = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGeneratePostScalarsOrEnums({ seq });
        const resolveValue = (0, internal_1.normalizeResolver)(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
        const defaultAssociations = {
            author: isPostauthorFactory(defaultData.author) ? {
                create: await defaultData.author.build()
            } : defaultData.author
        };
        const data = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const buildList = (inputData) => Promise.all((0, internal_1.normalizeList)(inputData).map(data => build(data)));
    const pickForConnect = (inputData) => ({
        id: inputData.id
    });
    const create = async (inputData = {}) => {
        const data = await build(inputData).then(screen);
        return await (0, internal_1.getClient)().post.create({ data });
    };
    const createList = (inputData) => Promise.all((0, internal_1.normalizeList)(inputData).map(data => create(data)));
    const createForConnect = (inputData = {}) => create(inputData).then(pickForConnect);
    return {
        _factoryFor: "Post",
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
 * Define factory for {@link Post} model.
 *
 * @param options
 * @returns factory {@link PostFactoryInterface}
 */
function definePostFactory(options) {
    return definePostFactoryInternal(options);
}
exports.definePostFactory = definePostFactory;
function isCommentpostFactory(x) {
    return x?._factoryFor === "Post";
}
function isCommentauthorFactory(x) {
    return x?._factoryFor === "User";
}
function autoGenerateCommentScalarsOrEnums({ seq }) {
    return {
        id: internal_1.scalarFieldValueGenerator.String({ modelName: "Comment", fieldName: "id", isId: true, isUnique: false, seq }),
        body: internal_1.scalarFieldValueGenerator.String({ modelName: "Comment", fieldName: "body", isId: false, isUnique: false, seq })
    };
}
function defineCommentFactoryInternal({ defaultData: defaultDataResolver }) {
    const seqKey = {};
    const getSeq = () => (0, internal_1.getSequenceCounter)(seqKey);
    const screen = (0, internal_1.createScreener)("Comment", modelFieldDefinitions);
    const build = async (inputData = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateCommentScalarsOrEnums({ seq });
        const resolveValue = (0, internal_1.normalizeResolver)(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
        const defaultAssociations = {
            post: isCommentpostFactory(defaultData.post) ? {
                create: await defaultData.post.build()
            } : defaultData.post,
            author: isCommentauthorFactory(defaultData.author) ? {
                create: await defaultData.author.build()
            } : defaultData.author
        };
        const data = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const buildList = (inputData) => Promise.all((0, internal_1.normalizeList)(inputData).map(data => build(data)));
    const pickForConnect = (inputData) => ({
        id: inputData.id
    });
    const create = async (inputData = {}) => {
        const data = await build(inputData).then(screen);
        return await (0, internal_1.getClient)().comment.create({ data });
    };
    const createList = (inputData) => Promise.all((0, internal_1.normalizeList)(inputData).map(data => create(data)));
    const createForConnect = (inputData = {}) => create(inputData).then(pickForConnect);
    return {
        _factoryFor: "Comment",
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
 * Define factory for {@link Comment} model.
 *
 * @param options
 * @returns factory {@link CommentFactoryInterface}
 */
function defineCommentFactory(options) {
    return defineCommentFactoryInternal(options);
}
exports.defineCommentFactory = defineCommentFactory;
function autoGenerateCategoryScalarsOrEnums({ seq }) {
    return {
        id: internal_1.scalarFieldValueGenerator.String({ modelName: "Category", fieldName: "id", isId: true, isUnique: false, seq }),
        name: internal_1.scalarFieldValueGenerator.String({ modelName: "Category", fieldName: "name", isId: false, isUnique: true, seq })
    };
}
function defineCategoryFactoryInternal({ defaultData: defaultDataResolver }) {
    const seqKey = {};
    const getSeq = () => (0, internal_1.getSequenceCounter)(seqKey);
    const screen = (0, internal_1.createScreener)("Category", modelFieldDefinitions);
    const build = async (inputData = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateCategoryScalarsOrEnums({ seq });
        const resolveValue = (0, internal_1.normalizeResolver)(defaultDataResolver ?? {});
        const defaultData = await resolveValue({ seq });
        const defaultAssociations = {};
        const data = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
        return data;
    };
    const buildList = (inputData) => Promise.all((0, internal_1.normalizeList)(inputData).map(data => build(data)));
    const pickForConnect = (inputData) => ({
        id: inputData.id
    });
    const create = async (inputData = {}) => {
        const data = await build(inputData).then(screen);
        return await (0, internal_1.getClient)().category.create({ data });
    };
    const createList = (inputData) => Promise.all((0, internal_1.normalizeList)(inputData).map(data => create(data)));
    const createForConnect = (inputData = {}) => create(inputData).then(pickForConnect);
    return {
        _factoryFor: "Category",
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
 * Define factory for {@link Category} model.
 *
 * @param options
 * @returns factory {@link CategoryFactoryInterface}
 */
function defineCategoryFactory(options = {}) {
    return defineCategoryFactoryInternal(options);
}
exports.defineCategoryFactory = defineCategoryFactory;
