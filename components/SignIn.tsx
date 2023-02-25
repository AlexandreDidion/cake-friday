import { useState } from 'react'
import styles from '@/styles/SignIn.module.scss'
import Link from 'next/link'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { vEmail, nonEmptyString, minLengthString, everyValueIsTrue } from '@/utils/validations'
import { getElementsInError } from '@/utils/errors'

export interface UserObject {
  email: string
  password: string
  firstName: string
  lastName: string
}

const minFourString = (value: string) => {
  return minLengthString(value, 4)
}

const VALIDATIONS_TYPES : { [key: string]: Function } = Object.freeze({
  email: vEmail,
  password: minFourString,
  firstName: nonEmptyString,
  lastName: nonEmptyString,
})

export const SignIn = ({onSignIn} : {onSignIn: (user: UserObject) => void}) => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })
  const [validations, setValidations] = useState(
    {
    email: false,
    password: false,
    firstName: false,
    lastName: false,
    }
  )
  const [errors, setErrors] = useState(
    {
      email: false,
      password: false,
      firstName: false,
      lastName: false,
    }
  )


  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const element = e.currentTarget
    if (!element) return

    setUser({...user, [element.name]: element.value})

    const isValid = VALIDATIONS_TYPES[element.name](element.value)
    setValidations({...validations, [element.name]: isValid})
    setErrors({...errors, [element.name]: isValid ? false : true})
  }

  const setRelevantErrors = () => {
    const fieldsInError = getElementsInError(validations, false)
    let newState = {}
    fieldsInError.forEach((name: string) => {
      newState = {...newState, [name]: true}
    })
    setErrors({...errors, ...newState})
  }

  const onSubmit = () => {
    if (!everyValueIsTrue(validations)) {
      setRelevantErrors()
      return
    }

    onSignIn(user)
  }

  return (
    <Box component='section' className={styles.signInFields}>
      <h2 className={styles.header}>Please, sign in</h2>
      <TextField
        label="Email"
        name="email"
        variant='outlined'
        required
        fullWidth
        onChange={onValueChange}
        error={errors.email}
        className={styles.textField}
      />
      <Box className={styles.namesFields}>
        <TextField
          label="First name"
          name="firstName"
          variant='outlined'
          required
          onChange={onValueChange}
          error={errors.firstName}
          className={styles.textField}
        />
        <TextField
          label="Last name"
          name="lastName"
          variant='outlined'
          required
          onChange={onValueChange}
          error={errors.lastName}
          className={styles.textField}
        />
      </Box>
        <TextField
        label="Password"
        type="password"
        name="password"
        variant='outlined'
        required
        fullWidth
        onChange={onValueChange}
        error={errors.password}
        className={styles.textField}
      />
      <Box className={styles.buttonContainer}>
        <Button
          variant="contained"
          fullWidth
          onClick={onSubmit}
        >
          Submit
        </Button>
      </Box>
    </Box>
  )
}
