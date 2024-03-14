export abstract class AbstractAttribute<Type = any> {
  static readonly COMMERCE_TOOLS_ATTR_NAME: string

  abstract value: Type

  toJSON(): Record<string | number, string | number | null | boolean | any> {
    throw new Error('Not implemented')
  }

  toString(): string {
    throw new Error('Not implemented')
  }
}
