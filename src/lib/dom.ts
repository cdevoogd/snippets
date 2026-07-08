export function queryElement<T extends typeof Element>(
  container: Document | Element,
  selector: string,
  type: T,
): InstanceType<T> {
  const elem = container.querySelector(selector);
  if (!elem) {
    throw new Error(`Selector ${selector} didn't match any elements.`);
  }
  if (!(elem instanceof type)) {
    throw new Error(`Selector ${selector} matched an element which is not an ${type.name}`);
  }
  return elem as InstanceType<T>;
}

export function queryElements<T extends typeof Element>(
  container: Document | Element,
  selector: string,
  type: T,
): InstanceType<T>[] {
  const elems = container.querySelectorAll(selector);
  return Array.from(elems).filter((e): e is InstanceType<T> => e instanceof type);
}
