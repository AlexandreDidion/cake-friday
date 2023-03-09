import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Rule, ruleConvertor } from '@/models/rules'
import { db } from '@/initFirebase'
import { setDoc, doc, updateDoc } from "firebase/firestore"
import { Member } from '@/models/members'
import { Selector } from '@/components/Selector'
import { Loader } from '@/components/Loader'
import Box from '@mui/system/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { DayPicker } from '@/components/DayPicker'
import dayjs, { Dayjs } from 'dayjs'
import { googleCalendarLink, outlookCalendarLink, createIcsFileText } from '@/services/mailers/toCalendarGenerator'

import { getBakers } from '@/services/pickBakers'
import { getCurrentUser } from '@/initFirebase'
import { getMyMembers } from '@/services/members/ownGetter'
import { getMyRule } from '@/services/rules/ownGetter'
import { range } from '@/utils/general'
import { ConfirmationModal } from '@/components/ConfirmationModal'

const currentUser = await getCurrentUser()

export default function Bakers() {
  const [myMembers, setMyMembers] = useState<Member[] | undefined>([])
  const [myRule, setMyRule] = useState<Rule | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [bakers, setBakers] = useState<Member[] | undefined>([])
  const [day, setDay] = useState(dayjs().add(3, 'day'))
  const [showModal, setShowModal] = useState(false)

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
    setShowModal(true)
  }

  const contentConfirm = () => {
    const bakerList = bakers?.map((b, i) => <li key={i}>{b.fullName()}</li>)

    return (
      <section>
        <p>Those would be the next bakers for the {dayjs(myRule?.nextDay).format('DD/MM')} :</p>
        <ul style={{margin: '1rem 0'}}>
          {bakerList}
        </ul>
        <p>We will send email confirmation to them. Good to go ?</p>
      </section>
    )
  }

  const onCloseModal = () => {
    setShowModal(false)
  }

  const confirmBakers = async () => {
    const params = {
      startAt: myRule?.nextDay,
      endsAt: dayjs(myRule?.nextDay).add(30, 'm').toDate(),
      subject: 'Friday Cake',
      description: 'You have to cook a cake',
    }
    const test = outlookCalendarLink(params)
    const test2 = googleCalendarLink(params)
    const testFile = createIcsFileText(params)
    console.log(testFile)
    const sendEmailResponse = await fetch('/api/mailer/sendBakerNotification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: bakers,
        sender: currentUser,
        date: dayjs(myRule?.nextDay).format('DD/MM'),
        outlookUrl: test,
        googleUrl: test2,
        textFile: testFile
      }),
    })
    console.log(sendEmailResponse, sendEmailResponse.body)
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
        {showModal && (
          <ConfirmationModal
            open={showModal}
            onClose={onCloseModal}
            onConfirm={confirmBakers}
            title="Confirm and send emails"
            content={contentConfirm()}
          />
        )}
      </main>
    </>
  )
}
