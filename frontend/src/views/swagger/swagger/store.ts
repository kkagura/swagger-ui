let refMap: { [k: string]: string } = Object.create(null);
export function clearRef() {
  refMap = Object.create(null);
}
export function setRef(k: string, ref: string): string {
  if (!refMap[k]) {
    refMap[k] = ref;
    return ref;
  }
  return refMap[k];
}

export function getRef(k: string) {
  return refMap[k] || k;
}

const definitions: string[] = [];
export function addDefinition(key: string) {
  if (!definitions.includes(key)) {
    definitions.push(key);
  }
}

export function getDefinitions() {
  return definitions;
}
