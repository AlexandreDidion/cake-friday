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
import { DayPicker } from '@/components/DayPicker'
import dayjs, { Dayjs } from 'dayjs'


import { getBakers } from '@/services/pickBakers'
import { useMyMembers } from '@/hooks/useMyMembers'
import { range } from '@/utils/general'

const currentUser = await getCurrentUser()

export default function Bakers() {
  const myMembers = useMyMembers(currentUser)
  const [isLoading, setIsLoading] = useState(false)
  const [bakers, setBakers] = useState<Member[] | undefined>([])
  const [day, setDay] = useState(dayjs())

  const defaultNbrBakers = () => {
    return (myMembers.length > 3) ? 3 : 1
  }
  const [nbrOfBakers, setNbrOfBakers] = useState(defaultNbrBakers())


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

  useEffect(() => {
    if (myMembers.length === 0) return
    setIsLoading(true)

    const newBakers = getBakers(myMembers as Member[])
    setBakers(newBakers)

    setIsLoading(false)
  }, [myMembers])

  const onNewNumberBakers = (number: string) => {
    setNbrOfBakers(parseInt(number))
  }

  const onNewDate = (date: Dayjs) => {
    setDay(date)
  }


  return (
    <>
      <Head>
        <title>Cake - My Team</title>
      </Head>
      {isLoading && (<Loader />)}
      <main>
        <Paper variant="outlined" elevation={5}>
          <Box>
            <h3>Your rules:</h3>
            <Box sx={{margin:'2rem 0'}}>
              <Selector
                options={getOptions()}
                defaultValue={defaultNbrBakers().toString()}
                onChoice={onNewNumberBakers}
                minWidth='11rem'
                label="Nbr of bakers"
              />
            </Box>
            <Box>
              <DayPicker onNewDate={onNewDate} />
            </Box>
          </Box>
        </Paper>
      </main>
    </>
  )
}
