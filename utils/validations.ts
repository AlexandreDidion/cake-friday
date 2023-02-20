export const nonEmptyString = (value: string) : boolean => {
  return value.trim().length > 0
}

export const vEmail = (value: string) : boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export const everyValueIsTrue = (object: {[key: string] : boolean }) : boolean => {
  return Object.values(object).every(v => !!v)
}
