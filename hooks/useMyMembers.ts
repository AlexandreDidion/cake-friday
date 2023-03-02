import { useState, useEffect } from "react"
import { Member } from "@/models/members"
import { User } from "firebase/auth"

export const useMyMembers = (currentUser: User | null) => {
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
