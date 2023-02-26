import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '@/styles/Auth.module.scss'

import { ErrorCard } from '@/components/ErrorCard'
import { Loader } from '@/components/Loader'
import { SignUp, UserObject as SignUpObject } from '@/components/SignUp'
import { LogIn, UserObject as LogInObject } from '@/components/LogIn'

import { signUp, logIn } from '@/services/firebaseAuth'

import { auth } from '@/initFirebase'

export default function Auth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const hasCurrentUser = !!auth.currentUser

  const onErrorAuth = (err: any) => {
    setIsLoading(false)
    const errorCode = err.code
    const errorMessage = err.message
    setErrorMessage(errorMessage)
    console.log(errorCode, errorMessage)
  }

  const endAuth = () => {
    setIsLoading(false)
    router.push('/')
  }

  const onSignUp = async (user: SignUpObject) => {
    setIsLoading(true)

    const newUser = await signUp(user, onErrorAuth)
    if (newUser) endAuth()
  }

  const onLogIn = async (user : LogInObject) => {
    setIsLoading(true)

    const loggedUser = await logIn(user, onErrorAuth)

    if (loggedUser) endAuth()
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
          : <SignUp onSignUp={onSignUp}/>
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
