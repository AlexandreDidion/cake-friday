export const getElementsInError = (object: {[key: string] : boolean }, valueToMatch: boolean) : string[] => {
  return Object
        .entries(object)
        .filter(([_key, value]) => value === valueToMatch)
        .map(([key, _value]) => key)
}
