import ts from "typescript";
import { ast } from "./astShorthand";

type Primitive = string | boolean | number;

type JSONObjLike = {
  [key: string]: Primitive | JSONObjLike | JSONObjLike[];
};

type JSONLike = JSONObjLike | JSONObjLike[];

function createArrayLitreral(obj: ReadonlyArray<JSONObjLike>): ts.ArrayLiteralExpression {
  return ast.arrayLiteralExpression(obj.map(createObjectLiteral));
}

function createObjectLiteral(obj: JSONObjLike): ts.ObjectLiteralExpression {
  return ast.objectLiteralExpression(
    Object.entries(obj).map(([k, v]) =>
      ast.propertyAssignment(
        k,
        typeof v === "string"
          ? ast.stringLiteral(v)
          : typeof v === "number"
          ? ast.numericLiteral(v)
          : typeof v === "boolean"
          ? v
            ? ast.true()
            : ast.false()
          : Array.isArray(v)
          ? createArrayLitreral(v)
          : typeof v === "object"
          ? createObjectLiteral(v)
          : (null as never),
      ),
    ),
    true,
  );
}

export function createJSONLiteral(obj: JSONLike): ts.Expression {
  return Array.isArray(obj) ? createArrayLitreral(obj) : createObjectLiteral(obj);
}
