import { DMMF } from "@prisma/generator-helper";
import { byName } from "../helpers";

export type ModelWithFields = {
  name: string;
  fields: {
    name: string;
    type: string;
    relationName: string;
  }[];
};

function isCreateChild(def: any): def is { create: Record<string, unknown> } {
  return typeof def.create === "object" && !Array.isArray(def.create);
}

function isCreateChildrenList(def: any): def is { create: Record<string, unknown>[] } {
  return typeof def.create === "object" && Array.isArray(def.create);
}

function isCorCChild(def: any): def is { connectOrCreate: { where: unknown; create: Record<string, unknown> } } {
  return typeof def.connectOrCreate === "object" && !Array.isArray(def.connectOrCreate);
}

function isCorCChildrenList(
  def: any,
): def is { connectOrCreate: { where: unknown; create: Record<string, unknown> }[] } {
  return typeof def.connectOrCreate === "object" && Array.isArray(def.connectOrCreate);
}

export function createFieldDefinitions(models: DMMF.Model[]): ModelWithFields[] {
  return models.map(m => ({
    name: m.name,
    fields: m.fields
      .filter(f => f.kind === "object")
      .map(f => ({
        name: f.name,
        type: f.type,
        relationName: f.relationName ?? "",
      })),
  }));
}

function removeProperties(propertyNames: readonly string[], target: Record<string, unknown>) {
  for (const name of propertyNames) {
    delete target[name];
  }
  return target;
}

export function createScreener(modelName: string, fieldDefinitions: readonly ModelWithFields[]) {
  const screenInternal = (parentModelName: string, createInput: any): any => {
    const result = Object.keys(createInput).reduce((acc, fieldName) => {
      const fieldDef = fieldDefinitions.find(byName(parentModelName))?.fields.find(byName(fieldName));
      if (fieldDef) {
        const nextModel = fieldDefinitions.find(byName(fieldDef.type))!;
        const fieldNamesToBeRemoved =
          fieldDefinitions
            .find(byName(nextModel.name))
            ?.fields.filter(f => f.relationName === fieldDef.relationName)
            .map(f => f.name) ?? [];
        const connectionDefinition = createInput[fieldName] as
          | undefined
          | {
              create?: unknown;
              connect?: unknown;
              connectOrCreate?: unknown;
            };
        if (!connectionDefinition) return acc;
        const modifiedConnectionDefinition = { ...connectionDefinition };
        if (isCreateChild(connectionDefinition)) {
          modifiedConnectionDefinition.create = removeProperties(
            fieldNamesToBeRemoved,
            screenInternal(nextModel.name, connectionDefinition.create),
          );
        } else if (isCreateChildrenList(connectionDefinition)) {
          modifiedConnectionDefinition.create = connectionDefinition.create
            .map(screenInternal.bind(null, nextModel.name))
            .map(removeProperties.bind(null, fieldNamesToBeRemoved));
        }
        if (isCorCChild(connectionDefinition)) {
          modifiedConnectionDefinition.connectOrCreate = {
            ...connectionDefinition.connectOrCreate,
            create: removeProperties(
              fieldNamesToBeRemoved,
              screenInternal(nextModel.name, connectionDefinition.connectOrCreate.create),
            ),
          };
        } else if (isCorCChildrenList(connectionDefinition)) {
          modifiedConnectionDefinition.connectOrCreate = connectionDefinition.connectOrCreate.map(def => ({
            ...def,
            create: removeProperties(fieldNamesToBeRemoved, screenInternal(nextModel.name, def.create)),
          }));
        }
        return {
          ...acc,
          [fieldName]: modifiedConnectionDefinition,
        };
      } else {
        return { ...acc, [fieldName]: createInput[fieldName] };
      }
    }, {} as any);
    return result;
  };
  const screen = <T>(createInput: T) => screenInternal(modelName, createInput) as T;
  return screen;
}
