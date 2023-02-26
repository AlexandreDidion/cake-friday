import { useState } from 'react';
import Head from 'next/head'
import { db, auth } from '@/initFirebase'
import { collection, setDoc, doc } from "firebase/firestore"
import { Member, memberConvertor } from '@/models/members'

import { MemberForm } from '@/components/MemberForm'
import { Loader } from '@/components/Loader'

interface MemberObject {
  firstName: string
  lastName: string
  email: string
}

export default function NewTeam() {
  const [isLoading, setIsLoading] = useState(false)

  const createMember = async (member: MemberObject) => {
    const hasCurrentUser = !!auth.currentUser

    if (!hasCurrentUser) return

    const newMember = new Member({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      userId: auth.currentUser?.uid
    })

    const newMemberRef = doc(collection(db, "members")).withConverter(memberConvertor as any)

    await setDoc(newMemberRef, newMember)
  }

  const onSubmit = async (member: MemberObject) => {
    if (!member) return

    setIsLoading(true)
    await createMember(member)
    setIsLoading(false)
  }

  return (
    <>
      <Head>
        <title>Cake - New Team</title>
      </Head>
      {isLoading && (<Loader />)}
      <main>
        <MemberForm
          onFormSubmit={onSubmit}
        />
      </main>
    </>
  )
}
