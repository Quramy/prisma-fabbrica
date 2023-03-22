"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineCategoryFactory = exports.defineCommentFactory = exports.definePostFactory = exports.defineUserFactory = exports.resetScalarFieldValueGenerator = exports.registerScalarFieldValueGenerator = exports.resetSequence = exports.initialize = void 0;
const internal_1 = require("@quramy/prisma-fabbrica/lib/internal");
var internal_2 = require("@quramy/prisma-fabbrica/lib/internal");
Object.defineProperty(exports, "initialize", { enumerable: true, get: function () { return internal_2.initialize; } });
Object.defineProperty(exports, "resetSequence", { enumerable: true, get: function () { return internal_2.resetSequence; } });
Object.defineProperty(exports, "registerScalarFieldValueGenerator", { enumerable: true, get: function () { return internal_2.registerScalarFieldValueGenerator; } });
Object.defineProperty(exports, "resetScalarFieldValueGenerator", { enumerable: true, get: function () { return internal_2.resetScalarFieldValueGenerator; } });
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
        id: (0, internal_1.getScalarFieldValueGenerator)().String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
        email: (0, internal_1.getScalarFieldValueGenerator)().String({ modelName: "User", fieldName: "email", isId: false, isUnique: true, seq }),
        name: (0, internal_1.getScalarFieldValueGenerator)().String({ modelName: "User", fieldName: "name", isId: false, isUnique: false, seq })
    };
}
function defineUserFactoryInternal({ defaultData: defaultDataResolver, traits: traitsDefs = {} }) {
    const getFactoryWithTraits = (traitKeys = []) => {
        const seqKey = {};
        const getSeq = () => (0, internal_1.getSequenceCounter)(seqKey);
        const screen = (0, internal_1.createScreener)("User", modelFieldDefinitions);
        const build = async (inputData = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateUserScalarsOrEnums({ seq });
            const resolveValue = (0, internal_1.normalizeResolver)(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = (0, internal_1.normalizeResolver)(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
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
    };
    const factory = getFactoryWithTraits();
    const traits = (name, ...names) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        traits,
    };
}
/**
 * Define factory for {@link User} model.
 *
 * @param options
 * @returns factory {@link UserFactoryInterface}
 */
function defineUserFactory(options) {
    return defineUserFactoryInternal(options ?? {});
}
exports.defineUserFactory = defineUserFactory;
function isPostauthorFactory(x) {
    return x?._factoryFor === "User";
}
function autoGeneratePostScalarsOrEnums({ seq }) {
    return {
        id: (0, internal_1.getScalarFieldValueGenerator)().String({ modelName: "Post", fieldName: "id", isId: true, isUnique: false, seq }),
        title: (0, internal_1.getScalarFieldValueGenerator)().String({ modelName: "Post", fieldName: "title", isId: false, isUnique: false, seq })
    };
}
function definePostFactoryInternal({ defaultData: defaultDataResolver, traits: traitsDefs = {} }) {
    const getFactoryWithTraits = (traitKeys = []) => {
        const seqKey = {};
        const getSeq = () => (0, internal_1.getSequenceCounter)(seqKey);
        const screen = (0, internal_1.createScreener)("Post", modelFieldDefinitions);
        const build = async (inputData = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePostScalarsOrEnums({ seq });
            const resolveValue = (0, internal_1.normalizeResolver)(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = (0, internal_1.normalizeResolver)(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
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
    };
    const factory = getFactoryWithTraits();
    const traits = (name, ...names) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        traits,
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
        id: (0, internal_1.getScalarFieldValueGenerator)().String({ modelName: "Comment", fieldName: "id", isId: true, isUnique: false, seq }),
        body: (0, internal_1.getScalarFieldValueGenerator)().String({ modelName: "Comment", fieldName: "body", isId: false, isUnique: false, seq })
    };
}
function defineCommentFactoryInternal({ defaultData: defaultDataResolver, traits: traitsDefs = {} }) {
    const getFactoryWithTraits = (traitKeys = []) => {
        const seqKey = {};
        const getSeq = () => (0, internal_1.getSequenceCounter)(seqKey);
        const screen = (0, internal_1.createScreener)("Comment", modelFieldDefinitions);
        const build = async (inputData = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateCommentScalarsOrEnums({ seq });
            const resolveValue = (0, internal_1.normalizeResolver)(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = (0, internal_1.normalizeResolver)(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
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
    };
    const factory = getFactoryWithTraits();
    const traits = (name, ...names) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        traits,
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
        id: (0, internal_1.getScalarFieldValueGenerator)().String({ modelName: "Category", fieldName: "id", isId: true, isUnique: false, seq }),
        name: (0, internal_1.getScalarFieldValueGenerator)().String({ modelName: "Category", fieldName: "name", isId: false, isUnique: true, seq })
    };
}
function defineCategoryFactoryInternal({ defaultData: defaultDataResolver, traits: traitsDefs = {} }) {
    const getFactoryWithTraits = (traitKeys = []) => {
        const seqKey = {};
        const getSeq = () => (0, internal_1.getSequenceCounter)(seqKey);
        const screen = (0, internal_1.createScreener)("Category", modelFieldDefinitions);
        const build = async (inputData = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateCategoryScalarsOrEnums({ seq });
            const resolveValue = (0, internal_1.normalizeResolver)(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = (0, internal_1.normalizeResolver)(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
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
    };
    const factory = getFactoryWithTraits();
    const traits = (name, ...names) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        traits,
    };
}
/**
 * Define factory for {@link Category} model.
 *
 * @param options
 * @returns factory {@link CategoryFactoryInterface}
 */
function defineCategoryFactory(options) {
    return defineCategoryFactoryInternal(options ?? {});
}
exports.defineCategoryFactory = defineCategoryFactory;
