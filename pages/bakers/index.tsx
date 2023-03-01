import { useState, useEffect } from 'react';
import Head from 'next/head'
import { db } from '@/initFirebase'
import { collection, query, where, getDocs, doc, DocumentData} from "firebase/firestore"
import { memberConvertor } from '@/models/members'
import { getCurrentUser } from '@/initFirebase'
import { GridColDef } from '@mui/x-data-grid'
import { Loader } from '@/components/Loader'
import Box from '@mui/system/Box'

export default function Bakers() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <Head>
        <title>Cake - My Team</title>
      </Head>
      {isLoading && (<Loader />)}
      <main>
      </main>
    </>
  )
}
