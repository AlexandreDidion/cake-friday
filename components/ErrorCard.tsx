import styles from '@/styles/ErrorCard.module.scss'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export const ErrorCard = ({ errorTitle, errorMessage = 'Something went wrong' } :{errorTitle?: string, errorMessage?: string}) => {
  return (
    <>
      <Card component="section" className={styles.card}>
        <ErrorOutlineIcon />
        <CardContent>
          <h3 className={styles.title}>{errorTitle && <p>{errorTitle}</p>}</h3>
          <p>{errorMessage}</p>
        </CardContent>
      </Card>
    </>
  )
}
