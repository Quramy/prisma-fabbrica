import ts from "typescript";
import { pascalize } from "./stringConverter";

type StripCreate<T extends string> = T extends `create${infer S}` ? Uncapitalize<S> : T;

export const ast = new Proxy(ts.factory, {
  get(target: any, n) {
    const name = n as string;
    if (name.startsWith("update")) return target[name];
    return target[`create${pascalize(name)}`];
  },
}) as unknown as {
  [K in keyof ts.NodeFactory as StripCreate<K>]: ts.NodeFactory[K];
};
