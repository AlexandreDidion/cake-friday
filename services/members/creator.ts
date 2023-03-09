import { db } from '@/initFirebase'
import { setDoc, doc } from "firebase/firestore"
import { Member, memberConvertor } from '@/models/members'

export const createMember = async (member : Member | undefined) => {
  if (!member) return

  const newMemberRef = doc(db, "members", member.id).withConverter(memberConvertor as any)

  await setDoc(newMemberRef, member)
}
