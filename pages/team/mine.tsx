import { useState, useEffect } from 'react';
import Head from 'next/head'
import { db } from '@/initFirebase'
import { collection, query, where, getDocs, doc, DocumentData} from "firebase/firestore"
import { memberConvertor } from '@/models/members'
import { getCurrentUser } from '@/initFirebase'

import { Loader } from '@/components/Loader'

const currentUser = await getCurrentUser()

export default function MineTeam() {
  const [isLoading, setIsLoading] = useState(false)
  const [myMembers, setMyMembers] = useState<DocumentData[]>([])

  const getMyMembers = async () => {
    setIsLoading(true)
    if (!currentUser?.uid) return

    const memberQuery = query(
      collection(db, "members"), where("userRef", "==", doc(db, `users/${currentUser?.uid}`))
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
    getMyMembers()
  }, [])


  return (
    <>
      <Head>
        <title>Cake - My Team</title>
      </Head>
      {isLoading && (<Loader />)}
      {myMembers.map((member, key) => (
        <p key={key}>{member.fullName()}</p>
      ))}
      <main>
      </main>
    </>
  )
}
