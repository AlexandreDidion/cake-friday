import { useState, useEffect } from "react"
import { Member } from "@/models/members"
import { getCurrentUser } from "@/initFirebase"

const currentUser = await getCurrentUser()

export const useMyMembers = () => {
  const [myMembers, setMyMembers] = useState<Member[]>([])

  const getMyMembers = async () => {
    if (!currentUser?.uid) return

    const members = await Member.getMyMembers(currentUser?.uid)

    setMyMembers(members)
  }

  useEffect(() => {
    getMyMembers()
  }, [])

  return myMembers
}
