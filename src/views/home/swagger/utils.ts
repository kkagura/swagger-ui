const DEFINITION_PREFIX = "#/definitions/";
export function convertRefKey(ref: string) {
  return ref.substring(DEFINITION_PREFIX.length);
}

export function createRefName(definitionName: string) {
  return DEFINITION_PREFIX + definitionName;
}
