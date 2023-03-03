import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Rule, ruleConvertor } from '@/models/rules'
import { db } from '@/initFirebase'
import { setDoc, doc, updateDoc } from "firebase/firestore"
import { User } from 'firebase/auth'
import { Member } from '@/models/members'
import { Selector } from '@/components/Selector'
import { Loader } from '@/components/Loader'
import Box from '@mui/system/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { DayPicker } from '@/components/DayPicker'
import dayjs, { Dayjs } from 'dayjs'

import { getBakers } from '@/services/pickBakers'
import { getCurrentUser } from '@/initFirebase'
import { getMyMembers } from '@/services/members/ownGetter'
import { getMyRule } from '@/services/rules/ownGetter'
import { range } from '@/utils/general'

const currentUser = await getCurrentUser()

export default function Bakers() {
  const [myMembers, setMyMembers] = useState<Member[] | undefined>([])
  const [myRule, setMyRule] = useState<Rule | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [bakers, setBakers] = useState<Member[] | undefined>([])
  const [day, setDay] = useState(dayjs().add(3, 'day'))

  const defaultNbrBakers = () => {
    if (myRule?.numberOfBakers) return myRule.numberOfBakers
    if (!myMembers) return 1

    return (myMembers?.length > 3) ? 3 : 1
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
    setMyRule(newRule)

    const newRuleRef = doc(db, "rules", newRule.id).withConverter(ruleConvertor as any)

    await setDoc(newRuleRef, newRule)
  }

  const initializeState = async () => {
    const members = await getMyMembers()
    const rule = await getMyRule()
    setMyMembers(members)
    setMyRule(rule)
  }

  useEffect(() => {
    initializeState()
  }, [])


  useEffect(() => {
    if (myMembers?.length === 0) return
    setIsLoading(true)

    if (!myRule) createRule()

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

  const onGetBakers = async () => {
    const newBakers = await getBakers(myMembers as Member[])
    console.log(newBakers)
    setBakers(newBakers)
  }


  return (
    <>
      <Head>
        <title>Cake - Bakers</title>
      </Head>
      {isLoading && (<Loader />)}
      <main>
        <Paper variant="outlined" sx={{marginBottom: '4rem'}}>
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
        <Box>
          <Button
            variant="contained"
            fullWidth
            onClick={onGetBakers}
          >
            Select next bakers
          </Button>
        </Box>
      </main>
    </>
  )
}
