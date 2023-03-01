import { Member } from "@/models/members"
const numberOfBakers = 3 as const



function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}


export const getBakers = (members: Member[]) => {
  if (!members || members.length < numberOfBakers) return

  const neverBaked = members.filter((m) => !m.lastBakedAt)
  const alreadyBaked : Member[] = members.filter((m) => notEmpty<Date>(m.lastBakedAt))

  if (neverBaked.length === numberOfBakers) return neverBaked

  if (neverBaked.length > numberOfBakers) return randomElements(neverBaked, numberOfBakers)

  if (neverBaked.length < numberOfBakers) return mixNewAndOld(neverBaked, alreadyBaked, numberOfBakers)
}

const mixNewAndOld = (newBakers: Member[], oldBakers: Member[], numberOfBakers: number) => {
  const missingBakerNumber = numberOfBakers - newBakers.length
  const orderedBaker = orderBakerByLastBakedAt(oldBakers)
  const oldestBakers = orderedBaker.slice(0, missingBakerNumber)
  return [...newBakers, ...oldestBakers]
}

const orderBakerByLastBakedAt = (members: Member[]) => {
  return members.sort((a, b) => compareDatesDsc(a.lastBakedAt, b.lastBakedAt))
}

const compareDatesDsc = (dateA: Date, dateB: Date) => {
  if (dateA.getTime() < dateB.getTime()) {
    return -1
  }
  if (dateA.getTime() > dateB.getTime()) {
    return 1
  }
  return 0
}

const randomIndex = (numberOfElements: number) => {
  return Math.floor(numberOfElements * Math.random());
}

const randomElements = (array: Member[], numberOfElements: number) => {
  const result = []
  const guardian = new Set()
  while (result.length < numberOfElements) {
    const index = randomIndex(numberOfElements)
    if (guardian.has(index)) {
      continue
    }
    const element = array[index]
    guardian.add(index)
    result.push(element)
  }
  return result
}
