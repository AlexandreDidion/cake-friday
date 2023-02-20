import { useState, useEffect } from 'react';
import Head from 'next/head'
import { db } from '@/initFirebase'
import { collection, setDoc, doc } from "firebase/firestore"
import { Member, memberConvertor } from '@/models/members'

import { MemberForm } from '@/components/MemberForm'
import { Loader } from '@/components/Loader';

interface MemberObject {
  firstName: string
  lastName: string
  email: string
}

export default function NewTeam() {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // const test = new Member({
    //   firstName: 'Alex',
    //   lastName: 'Poulet',
    //   email: 'ale.poulet@gmail.com'
    // })
    // console.log(test, test.fullName(), test.createdAt)
  }, [])

  const createMember = async (member: MemberObject) => {
    const newMember = new Member({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
    })

    const newMemberRef = doc(collection(db, "members")).withConverter(memberConvertor)

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
