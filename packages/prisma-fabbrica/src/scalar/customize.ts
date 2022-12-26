import { scalarFieldValueGenerator } from "./gen";
import { ScalarFieldValueGenerator, StrictScalarFieldValueGenerator } from "./types";

let _customGeneratorDefinition: ScalarFieldValueGenerator | undefined;

export function registerScalarFieldValueGenerator(generatorDefinition: ScalarFieldValueGenerator) {
  _customGeneratorDefinition = generatorDefinition;
}

export function resetScalarFieldValueGenerator() {
  _customGeneratorDefinition = undefined;
}

export function getScalarFieldValueGenerator(): StrictScalarFieldValueGenerator {
  return {
    ...scalarFieldValueGenerator,
    ..._customGeneratorDefinition,
  };
}
