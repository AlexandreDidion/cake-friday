import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '@/styles/SignIn.module.scss'

import { SignIn, UserObject as SignInObject } from '@/components/SignIn'
import { LogIn, UserObject as LogInObject  } from '@/components/LogIn'
import { ErrorCard } from '@/components/ErrorCard'
import { Loader } from '@/components/Loader'
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

import { auth, db } from '@/initFirebase'
import { User, userConvertor } from '@/models/users'

export default function Auth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const hasCurrentUser = !!auth.currentUser

  const createUser = async (user: SignInObject, newUserId: string) => {
    const newUser = new User({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    })

    const newUserRef = doc(db, "users", newUserId).withConverter(userConvertor as any)

    await setDoc(newUserRef, newUser)
  }


  const onSignIn = async (user: SignInObject) => {
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

  const onLogIn = async (user: LogInObject) => {
    setIsLoading(true)

    let loggedUser
    try {
      loggedUser = await signInWithEmailAndPassword(auth, user.email, user.password)
    } catch(err: any) {
      setIsLoading(false)
      const errorCode = err.code
      const errorMessage = err.message
      setErrorMessage(errorMessage)
      console.log(errorCode, errorMessage)
    }

    if (loggedUser) {
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
        {hasCurrentUser
          ? <LogIn onLogIn={onLogIn} />
          : <SignIn onSignIn={onSignIn}/>
        }
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
