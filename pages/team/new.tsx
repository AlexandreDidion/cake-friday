import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { db, auth } from '@/initFirebase'
import { parseExcel, FromExcelMember } from '@/services/excelParser'
import { collection, setDoc, doc, writeBatch } from "firebase/firestore"
import { Member, memberConvertor } from '@/models/members'

import { MemberForm } from '@/components/MemberForm'
import { Loader } from '@/components/Loader'

interface SubmittedMemberObject {
  firstName: string
  lastName: string
  email: string
}

export default function NewTeam() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const redirectAfterCreate = () => {
    router.push('/team/mine')
  }

  const createMember = async (member: SubmittedMemberObject) => {
    const hasCurrentUser = !!auth.currentUser

    if (!hasCurrentUser) return

    const newMember = new Member({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      userId: auth.currentUser?.uid,
      lastBakedAt: null,
    })

    const newMemberRef = doc(collection(db, "members")).withConverter(memberConvertor as any)

    await setDoc(newMemberRef, newMember)
  }

  const onSubmit = async (member: SubmittedMemberObject) => {
    if (!member) return

    setIsLoading(true)
    await createMember(member)
    setIsLoading(false)
    redirectAfterCreate()
  }

  const transformIntoProperMembers = (membersFromImport: FromExcelMember[]) => {
    if (membersFromImport.length < 1) return

    const properMembers = membersFromImport.map((member: FromExcelMember) => {
      return new Member({
        firstName: member.FirstName,
        lastName: member.LastName,
        email: member.Email,
        userId: auth.currentUser?.uid,
        lastBakedAt: null,
      })
    })
    createMembersInBatch(properMembers)
  }

  const createMembersInBatch = async (membersToSave: Member[]) => {
    if (membersToSave.length < 1) return

    const batch = writeBatch(db)

    membersToSave.forEach((member) => {
      const newMemberRef = doc(collection(db, "members")).withConverter(memberConvertor as any)
      batch.set(newMemberRef, member)
    })

    await batch.commit()

    setIsLoading(false)
    redirectAfterCreate()
  }

  const onExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    setIsLoading(true)

    const file = e.target.files[0]
    const members = await parseExcel(file)
    transformIntoProperMembers(members)
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
        <p>Or import from excel:</p>
        <input
          type='file'
          accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
          id="import-excel"
          onChange={onExcelImport}
        />
      </main>
    </>
  )
}
