import { Rule } from "@/models/rules"
import { getCurrentUser } from "@/initFirebase"

const currentUser = await getCurrentUser()

export const getMyRule = async () => {
  if (!currentUser?.uid) return

  const myRule = await Rule.getMyRule(currentUser?.uid)

  return myRule
}
