export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export const compareDatesDsc = (dateA: Date | null | undefined, dateB: Date | null | undefined) => {
  if (!dateA || !dateB) return 0

  if (dateA.getTime() < dateB.getTime()) {
    return -1
  }
  if (dateA.getTime() > dateB.getTime()) {
    return 1
  }
  return 0
}

const getRandomIndex = (numberOfElements: number) => {
  return Math.floor(numberOfElements * Math.random());
}

export function extractRandomElements<T>(array: T[], numberOfElements: number) {
  const result = []
  const guardian = new Set();

  while (result.length < numberOfElements) {
    const index = getRandomIndex(numberOfElements)
    if (guardian.has(index)) {
      continue
    }
    const element = array[index]
    guardian.add(index)
    result.push(element)
  }
  return result
}
