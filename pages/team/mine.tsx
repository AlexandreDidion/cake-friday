import { useState, useEffect } from 'react';
import Head from 'next/head'
import { db } from '@/initFirebase'
import { collection, query, where, getDocs, doc, DocumentData} from "firebase/firestore"
import { memberConvertor, Member } from '@/models/members'
import { getCurrentUser } from '@/initFirebase'
import { GridColDef } from '@mui/x-data-grid'
import { Loader } from '@/components/Loader'
import { MemberTable } from '@/components/MemberTable'
import Box from '@mui/system/Box'

import { getBakers } from '@/services/pickBakers';

const currentUser = await getCurrentUser()

const TABLE_COLUMNS : GridColDef[] = [
  { field: 'firstName', headerName: 'First name', width: 150 },
  { field: 'lastName', headerName: 'Last name', width: 150 },
  {
    field: 'email',
    headerName: 'Email',
    width: 300,
  },
  { field: 'lastBakedAt', headerName: 'Last cake', width: 150 },
]

export interface MemberRow {
  id: number
  firstName: string
  lastName: string
  email: string
}

export default function MineTeam() {
  const [isLoading, setIsLoading] = useState(false)
  const [myMembers, setMyMembers] = useState<DocumentData[]>([])
  const [rows, setRows] = useState<MemberRow[]>([])
  const [showTable, setShowTable] = useState(false)

  const getMyMembers = async () => {
    setIsLoading(true)
    if (!currentUser?.uid) return

    const memberQuery = query(
      collection(db, "members"), where("userRef", "==", doc(db, `users/${currentUser?.uid}`))
    ).withConverter<Member>(memberConvertor as any)

    const querySnapshot = await getDocs(memberQuery)

    const members : Member[] = []

    querySnapshot.forEach((doc) => {
      members.push(doc.data())
    })
    setMyMembers(members)

    setIsLoading(false)
  }

  useEffect(() => {
    getMyMembers()
  }, [])

  useEffect(() => {
    const rows = myMembers.map((m, i) => {
      return {
        id: i,
        firstName: m.firstName ,
        lastName: m.lastName,
        email: m.email,
        lastBakedAt: m.lastBakedAt
      }
    })
    setRows(rows)
    setShowTable(true)
    const test = getBakers(myMembers as Member[])
    console.log(test)
  }, [myMembers])

  return (
    <>
      <Head>
        <title>Cake - My Team</title>
      </Head>
      {isLoading && (<Loader />)}
      <main>
        {showTable && (
          <Box sx={{width: "75vw", height: '75vh'}}>
            <MemberTable
              columns={TABLE_COLUMNS}
              rows={rows}
            />
          </Box>
        )}
      </main>
    </>
  )
}
