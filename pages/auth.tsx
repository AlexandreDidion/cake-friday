import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '@/styles/SignIn.module.scss'

import { SignIn, UserObject } from '@/components/SignIn'
import { ErrorCard } from '@/components/ErrorCard'
import { Loader } from '@/components/Loader'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

import { auth, db } from '@/initFirebase'
import { User, userConvertor } from '@/models/users'

export default function Auth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const createUser = async (user: UserObject, newUserId: string) => {
    const newUser = new User({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    })

    const newUserRef = doc(db, "users", newUserId).withConverter(userConvertor as any)

    await setDoc(newUserRef, newUser)
  }


  const onSignIn = async (user: UserObject) => {
    setIsLoading(true)

    let newUser
    try {
      newUser = await createUserWithEmailAndPassword(auth, user.email, user.password)
    } catch(err: any) {
      setIsLoading(false)
      const errorCode = err.code
      const errorMessage = err.message
      setErrorMessage(errorMessage)
      console.log(errorCode, errorMessage)
    }

    if (newUser) {
      await updateProfile(newUser.user, {
        displayName: `${user.firstName} ${user.lastName}`
      })
      await createUser(user, newUser.user.uid)
      setIsLoading(false)
      router.push('/')
    }
  }

  return (
    <>
      <Head>
        <title>Cake - Auth</title>
      </Head>
      {isLoading && (<Loader />)}
      <main className={styles.main}>
        <SignIn onSignIn={onSignIn} />
        {!!errorMessage && (
          <ErrorCard
            errorMessage={errorMessage}
            errorTitle="Validations errors"
          />
        )}
      </main>
    </>
  )
}
