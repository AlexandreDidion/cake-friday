import { Member } from "@/models/members"
import { notEmpty, compareDatesDsc, extractRandomElements } from "@/utils/general"

const numberOfBakers = 3 as const

export const getBakers = (members: Member[]) => {
  if (!members || members.length < numberOfBakers) return

  const neverBaked = members.filter((m) => !m.lastBakedAt)
  const alreadyBaked : Member[] = members.filter((m) => notEmpty<Date>(m.lastBakedAt))

  if (neverBaked.length === numberOfBakers) return neverBaked

  if (neverBaked.length > numberOfBakers) return extractRandomElements<Member>(neverBaked, numberOfBakers)

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
