import { Member } from "@/models/members"
import { getCurrentUser } from "@/initFirebase"

const currentUser = await getCurrentUser()

export const getMyMembers = async () => {
  if (!currentUser?.uid) return

  const myMembers = await Member.getMyMembers(currentUser?.uid)

  return myMembers
}
