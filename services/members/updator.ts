import { db } from '@/initFirebase'
import { writeBatch, doc, updateDoc } from "firebase/firestore"
import { Member, memberConvertor } from '@/models/members'

interface UpdateObject {
  field: string
  value: Date
}

export const updateMembers = async (membersUpdates : Map<Member, UpdateObject>) => {
  const batch = writeBatch(db)

  membersUpdates.forEach((update, member) => {
    const memberRef = doc(db, 'members', member.id).withConverter(memberConvertor as any)
    batch.update(memberRef, {[update.field]: update.value})
  })

  await batch.commit()
}

export const updateMember = async (memberId: string, changes: object) => {
  if (!memberId) return

  const memberRef = doc(db, 'members', memberId).withConverter(memberConvertor as any)
  await updateDoc(memberRef, changes)
}
