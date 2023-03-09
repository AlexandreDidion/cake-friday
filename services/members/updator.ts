import { db } from '@/initFirebase'
import { writeBatch, doc, updateDoc } from "firebase/firestore"
import { Member } from '@/models/members'

interface UpdateObject {
  field: string
  value: Date
}

export const updateMembers = async (membersUpdates : Map<Member, UpdateObject>) => {
  const batch = writeBatch(db)

  membersUpdates.forEach((update, member) => {
    const memberRef = doc(db, 'members', member.id)
    batch.update(memberRef, {[update.field]: update.value})
  })

  await batch.commit()
}
