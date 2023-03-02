import { useState, useEffect } from 'react';
import Head from 'next/head'
import { db } from '@/initFirebase'
import { collection, query, where, getDocs, doc, DocumentData} from "firebase/firestore"
import { memberConvertor, Member } from '@/models/members'
import { getCurrentUser } from '@/initFirebase'
import { Selector } from '@/components/Selector'
import { Loader } from '@/components/Loader'
import Box from '@mui/system/Box'
import Paper from '@mui/material/Paper'

import { getBakers } from '@/services/pickBakers'
import { useMyMembers } from '@/hooks/useMyMembers'
import { range } from '@/utils/general'

const currentUser = await getCurrentUser()

export default function Bakers() {
  const [isLoading, setIsLoading] = useState(false)
  const myMembers = useMyMembers(currentUser)
  const [bakers, setBakers] = useState<Member[] | undefined>([])

  const getMaxNumberBaker = () => {
    if (!myMembers || myMembers.length === 0) return []

    return range(myMembers.length)
  }

  const getOptions = () => {
    return getMaxNumberBaker().map((n) => {
      return {
        id: n,
        value: n.toString(),
        name: n.toString()
      }
    })
  }

  const defaultNbrBakers = () => {
    console.log(myMembers.length > 3)
    return (myMembers.length > 3) ? 3 : 1
  }


  useEffect(() => {
    if (myMembers.length === 0) return
    setIsLoading(true)

    const newBakers = getBakers(myMembers as Member[])
    setBakers(newBakers)

    setIsLoading(false)
  }, [myMembers])


  return (
    <>
      <Head>
        <title>Cake - My Team</title>
      </Head>
      {isLoading && (<Loader />)}
      <Paper variant="outlined" elevation={5}>
        <Box>
          <h3>Your rules:</h3>
          <Box>
            <Selector
              options={getOptions()}
              defaultValue={defaultNbrBakers().toString()}
              minWidth='11rem'
              label="Nbr of bakers"
            />
          </Box>
          <p>Next cooking day :</p>
        </Box>
      </Paper>
      <main>
      </main>
    </>
  )
}
