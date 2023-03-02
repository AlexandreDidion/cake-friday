import { useState, useEffect } from "react"
import { Rule } from "@/models/rules"
import { getCurrentUser } from "@/initFirebase"

const currentUser = await getCurrentUser()

export const useMyRule = () => {
  const [myRule, setMyRule] = useState<Rule | null>(null)

  const getMyRule = async () => {
    if (!currentUser?.uid) return

    const rules = await Rule.getMyRule(currentUser?.uid)

    setMyRule(rules)
  }

  useEffect(() => {
    getMyRule()
  }, [])

  return myRule
}
