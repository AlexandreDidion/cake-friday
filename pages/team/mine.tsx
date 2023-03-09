import { useState, useEffect, useMemo } from 'react'
import Head from 'next/head'
import { GridColDef } from '@mui/x-data-grid'
import { MemberTable } from '@/components/MemberTable'
import { Member } from '@/models/members'
import Box from '@mui/system/Box'
import Button from '@mui/material/Button'
import { getMyMembers } from '@/services/members/ownGetter'
import { getCurrentUser } from '@/initFirebase'
import { User } from '@/models/users'
import { createMember } from '@/services/members/creator'

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

const currentUser = await getCurrentUser()

export default function MineTeam() {
  const [rows, setRows] = useState<MemberRow[]>([])
  const [showTable, setShowTable] = useState(false)
  const [myMembers, setMyMembers] = useState<Member[] | undefined>([])

  const initializeState = async () => {
    const members = await getMyMembers()
    setMyMembers(members)
  }

  const isOnTheTeam = useMemo(() => {
    if (!myMembers || !(myMembers.length > 0)) return false

    const myself = myMembers.find((m) => {
      m.email === currentUser?.email
    })

    return !!myself
  }, [myMembers])

  useEffect(() => {
    initializeState()
  }, [])

  useEffect(() => {
    if (myMembers?.length === 0) return

    const rows = myMembers?.map((m, i) => {
      return {
        id: i,
        firstName: m.firstName ,
        lastName: m.lastName,
        email: m.email,
        lastBakedAt: m.lastBakedAt
      }
    })

    if (!rows) return

    setRows(rows)
    setShowTable(true)
  }, [myMembers])

  const addMyself = async () => {
    if (isOnTheTeam) return

   const user = await User.findByEmail(currentUser?.email)
   const member = user?.convertToMember()
   await createMember(member)
   initializeState()
  }

  return (
    <>
      <Head>
        <title>Cake - My Team</title>
      </Head>
      <main>
        {showTable && (
          <>
          {!isOnTheTeam && (
            <Button
              variant="contained"
              sx={{marginBottom: '2rem'}}
              onClick={addMyself}
            >
              Add myself to the team
            </Button>
          )}
            <Box sx={{width: "75vw", height: '75vh'}}>
              <MemberTable
                columns={TABLE_COLUMNS}
                rows={rows}
              />
            </Box>
          </>
        )}
      </main>
    </>
  )
}
