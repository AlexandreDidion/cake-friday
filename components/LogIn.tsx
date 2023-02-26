import { useState } from 'react'
import styles from '@/styles/Auth.module.scss'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { vEmail, minLengthString, everyValueIsTrue } from '@/utils/validations'
import { getElementsInError } from '@/utils/errors'

export interface UserObject {
  email: string
  password: string
}

const minFourString = (value: string) => {
  return minLengthString(value, 4)
}

const VALIDATIONS_TYPES : { [key: string]: Function } = Object.freeze({
  email: vEmail,
  password: minFourString,
})

export const LogIn = ({onLogIn} : {onLogIn: (user: UserObject) => void}) => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  })
  const [validations, setValidations] = useState(
    {
    email: false,
    password: false,
    }
  )
  const [errors, setErrors] = useState(
    {
      email: false,
      password: false,
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

    onLogIn(user)
  }

  return (
    <Box component='section' className={styles.fields}>
      <h2 className={styles.header}>Please, log in</h2>
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
