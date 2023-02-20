import { useState } from 'react'
import styles from '@/styles/MemberForm.module.scss'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { ErrorCard } from './ErrorCard'

import { vEmail, nonEmptyString, everyValueIsTrue } from '@/utils/validations'
import { getElementsInError } from '@/utils/errors'

interface MemberObject {
  firstName: string
  lastName: string
  email: string
}

interface MemberMap {
  [key: string]: boolean
}


const MEMBER_FIELDS = Object.freeze(
  [
    {
      label: 'First Name',
      name: 'firstName',
      isRequired: true,
      validation: nonEmptyString,
      errorMessage : 'First name missing or with incorrect value'
    },
    {
      label: 'Last Name',
      name: 'lastName',
      isRequired: true,
      validation: nonEmptyString,
      errorMessage : 'Last name missing or with incorrect value'
    },
    {
      label: 'Email',
      name: 'email',
      isRequired: true,
      validation: vEmail,
      errorMessage : 'Email missing or with incorrect value'
    }
  ]
)

export const MemberForm = ({onFormSubmit} : {onFormSubmit: (member: MemberObject) => void}) => {
  const [member, setMember] = useState<MemberObject>({
    firstName: '',
    lastName: '',
    email: ''
  })
  const [validations, setValidations] = useState<MemberMap>(
    {
      firstName: false,
      lastName: false,
      email: false
    }
  )
  const [errors, setErrors] = useState<MemberMap>(
    {
      firstName: false,
      lastName: false,
      email: false
    }
  )
  const [showErrorMessage, setShowErrorMessage] = useState(false)

  const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const element = e.currentTarget
    if (!element) return

    setMember({...member, [element.name]: element.value})

    const validation = MEMBER_FIELDS.find((f) => f.name === element.name)?.validation
    const isValid = !!validation ? validation(element.value) : false
    setValidations({...validations, [element.name]: isValid})
    setErrors({...errors, [element.name]: isValid ? false : true})
  }

  const setRelevantErrors = () => {
    const fieldsInError = getElementsInError(validations, false)
    let newState = {}
    fieldsInError.forEach((name) => {
      newState = {...newState, [name]: true}
    })
    setErrors({...errors, ...newState})
  }

  const getErrorMessage = () : string => {
    const fieldsInError = getElementsInError(errors, true)
    const messages = fieldsInError.reduce(
      (a : [] | string[], f: string) => {
        const relevantMemberField = MEMBER_FIELDS.find((mf) => mf.name === f)
        if (!relevantMemberField) return a

        return [...a, relevantMemberField.errorMessage]
      },
      []
    )

    return messages.join("\r\n")
  }

  const onSubmit = () => {
    if (!everyValueIsTrue(validations)) {
      setRelevantErrors()
      setShowErrorMessage(true)
      return
    }

    if (!!onFormSubmit) onFormSubmit(member)
  }

  return (
    <>
      <Box component="form" className={styles.memberForm}>
        {MEMBER_FIELDS.map((f, i) => (
          <Box
            component="section"
            key={i}
            className={styles.textField}
          >
            <TextField
              label={f.label}
              name={f.name}
              variant='outlined'
              required={f.isRequired}
              onChange={onFieldChange}
              error={errors[f.name]}
              className={styles.textField}
            />
          </Box>
        ))}
        {showErrorMessage && (
          <Box className={styles.errorContainer}>
            <ErrorCard
              errorMessage={getErrorMessage()}
              errorTitle="Validations errors"
            />
        </Box>
        )}
        <Box className={styles.buttonContainer}>
          <Button
            variant="contained"
            onClick={onSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  )
}
