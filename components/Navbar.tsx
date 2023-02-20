import styles from '@/styles/Navbar.module.scss'
import Link from 'next/link'

import Box from '@mui/material/Box'

export const Navbar = () => {
  return (
    <>
      <Box component="nav" className={styles.navbarContainer}>
        <Link href="/" className={styles.link}>Cake Friday</Link>
      </Box>

    </>
  )
}
