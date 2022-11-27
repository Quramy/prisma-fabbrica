export function byName<T extends { readonly name: string }>(name: string | { readonly name: string }) {
  return (x: T) => x.name === (typeof name === "string" ? name : name.name);
}
