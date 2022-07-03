const statePrefix = "is-";

const _bem = (
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string
) => {
  let cls = block;
  if (blockSuffix) {
    cls += `-${blockSuffix}`;
  }
  if (element) {
    cls += `__${element}`;
  }
  if (modifier) {
    cls += `--${modifier}`;
  }
  return cls;
};

export const useNamespace = (block: string) => {
  const b = (blockSuffix = "") => _bem(block, blockSuffix, "", "");
  const e = (element?: string) => (element ? _bem(block, "", element, "") : "");
  const m = (modifier?: string) =>
    modifier ? _bem(block, "", "", modifier) : "";
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element ? _bem(block, blockSuffix, element, "") : "";
  const em = (element?: string, modifier?: string) =>
    element && modifier ? _bem(block, "", element, modifier) : "";
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier ? _bem(block, blockSuffix, "", modifier) : "";
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
      ? _bem(block, blockSuffix, element, modifier)
      : "";
  const is: {
    (name: string, state: boolean | undefined): string;
    (name: string): string;
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0]! : true;
    return name && state ? `${statePrefix}${name}` : "";
  };

  return {
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
  };
};

export type UseNamespaceReturn = ReturnType<typeof useNamespace>;
