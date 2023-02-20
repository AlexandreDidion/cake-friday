import styles from '@/styles/Loader.module.scss'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'


export const Loader = () => {
  return (
    <Box className={styles.transparentCover}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress className={styles.spinner} />
      </Box>
    </Box>
  )
}
