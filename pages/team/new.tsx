import { useEffect } from 'react';
import Head from 'next/head'
import { db } from '@/initFirebase'
import { collection, getDocs } from "firebase/firestore";

export default function NewTeam() {

  useEffect(() => {


    const test = async () => {

      const querySnapshot = await getDocs(collection(db, "members"));
      querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
})
    }
    test()
  }, [])

  return (
    <>
      <Head>
        <title>Cake - New Team</title>
      </Head>
      <main>
      </main>
    </>
  )
}
