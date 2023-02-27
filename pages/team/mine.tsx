import { useState, useEffect } from 'react';
import Head from 'next/head'
import { db, auth } from '@/initFirebase'
import { collection, query, where, getDocs, getDoc, doc, DocumentData} from "firebase/firestore"
import { Member, memberConvertor } from '@/models/members'

import { MemberForm } from '@/components/MemberForm'
import { Loader } from '@/components/Loader'

interface MemberObject {
  firstName: string
  lastName: string
  email: string
}

export default function MineTeam() {
  const [isLoading, setIsLoading] = useState(false)
  const [myMembers, setMyMembers] = useState<DocumentData[]>([])

  const getMyMembers = async (currentUserId: string | undefined) => {
    setIsLoading(true)
    if (!currentUserId) return

    const memberQuery = query(
      collection(db, "members"), where("userRef", "==", doc(db, `users/${currentUserId}`))
    ).withConverter(memberConvertor as any)
    const querySnapshot = await getDocs(memberQuery)
    const members : DocumentData[] = []
    querySnapshot.forEach((doc) => {
      members.push(doc.data())
    })
    setMyMembers(members)
    setIsLoading(false)
  }

  useEffect(() => {
    const currentUserId = auth.currentUser?.uid
    getMyMembers(currentUserId)
  }, [])


  return (
    <>
      <Head>
        <title>Cake - My Team</title>
      </Head>
      {isLoading && (<Loader />)}
      {myMembers.map((member) => (
        <p key='member'>{member.fullName()}</p>
      ))}
      <main>
      </main>
    </>
  )
}
