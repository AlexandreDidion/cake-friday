import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Rule, ruleConvertor } from '@/models/rules'
import { db } from '@/initFirebase'
import { collection, setDoc, doc, updateDoc } from "firebase/firestore"
import { Member } from '@/models/members'
import { Selector } from '@/components/Selector'
import { Loader } from '@/components/Loader'
import Box from '@mui/system/Box'
import Paper from '@mui/material/Paper'
import { DayPicker } from '@/components/DayPicker'
import dayjs, { Dayjs } from 'dayjs'

import { getBakers } from '@/services/pickBakers'
import { getCurrentUser } from '@/initFirebase'
import { useMyMembers } from '@/hooks/useMyMembers'
import { useMyRule } from '@/hooks/useMyRule'
import { range } from '@/utils/general'

const currentUser = await getCurrentUser()

export default function Bakers() {
  const myMembers = useMyMembers()
  let myRule = useMyRule()
  const [isLoading, setIsLoading] = useState(false)
  const [bakers, setBakers] = useState<Member[] | undefined>([])
  const [day, setDay] = useState(dayjs().add(3, 'day'))

  const defaultNbrBakers = () => {
    if (myRule?.numberOfBakers) return myRule.numberOfBakers

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

  const updateRule = async (newValues: {numberOfBakers?: number | null | undefined, nextDay?: Date | null | undefined}) => {
    if (!myRule) return

    const ruleRef = doc(db, 'rules', myRule.id)
    await updateDoc(ruleRef, {
      numberOfBakers: newValues?.numberOfBakers || myRule.numberOfBakers,
      nextDay: newValues?.nextDay || myRule.nextDay
    })
  }

  const createRule = async () => {
    if (!!myRule) return

    const newRule = new Rule({
      numberOfBakers: defaultNbrBakers(),
      userId: currentUser?.uid
    })
    myRule = newRule

    const newRuleRef = doc(db, "rules", newRule.id).withConverter(ruleConvertor as any)

    await setDoc(newRuleRef, newRule)
  }

  useEffect(() => {
    if (myMembers.length === 0) return
    setIsLoading(true)

    if (!myRule) createRule()

    const newBakers = getBakers(myMembers as Member[])
    setBakers(newBakers)

    setIsLoading(false)
  }, [myMembers])

  const onNewNumberBakers = (number: string) => {
    setNbrOfBakers(parseInt(number))
    updateRule({numberOfBakers: parseInt(number)})
  }

  const onNewDate = (date: Dayjs) => {
    setDay(date)
    updateRule({nextDay: date.toDate()})
  }


  return (
    <>
      <Head>
        <title>Cake - Bakers</title>
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
              <DayPicker
                onNewDate={onNewDate}
                initialDate={day}
              />
            </Box>
          </Box>
        </Paper>
      </main>
    </>
  )
}
