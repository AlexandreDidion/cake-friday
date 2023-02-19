import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.scss'

import Box from '@mui/material/Box'

export default function Home() {
  return (
    <>
      <Head>
        <title>Cake</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <Box className={styles.imgContainer}>
          <Image
            src="/cake.svg"
            alt="Decorative cake illustration"
            fill
          />
        </Box>
      </main>
    </>
  )
}
