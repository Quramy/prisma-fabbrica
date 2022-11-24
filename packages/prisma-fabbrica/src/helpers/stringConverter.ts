export function camelize(pascal: string) {
  return pascal[0].toLowerCase() + pascal.slice(1);
}

export function pascalize(camel: string) {
  return camel[0].toUpperCase() + camel.slice(1);
}
