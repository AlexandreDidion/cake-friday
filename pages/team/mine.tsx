import { useState, useEffect } from 'react'
import Head from 'next/head'
import { GridColDef } from '@mui/x-data-grid'
import { MemberTable } from '@/components/MemberTable'
import Box from '@mui/system/Box'
import { useMyMembers } from '@/hooks/useMyMembers'

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
  const [rows, setRows] = useState<MemberRow[]>([])
  const [showTable, setShowTable] = useState(false)
  const myMembers = useMyMembers()

  useEffect(() => {
    if (myMembers.length === 0) return

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
  }, [myMembers])

  return (
    <>
      <Head>
        <title>Cake - My Team</title>
      </Head>
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
