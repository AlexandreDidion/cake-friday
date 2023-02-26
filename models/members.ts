import { Human } from './humans'
import { doc } from "firebase/firestore"
import { db } from '@/initFirebase';
import { QueryDocumentSnapshot, SnapshotOptions } from '@firebase/firestore-types';
import { DocumentData, WithFieldValue, CollectionReference } from 'firebase/firestore'

export class Member extends Human {
  userId: string | undefined

  constructor (
    {firstName, lastName, email, userId} : {firstName : string, lastName: string, email: string, userId: string | undefined}
  ) {
    super({firstName, lastName, email})
    this.userId = userId
  }
}

// Firestore data converter
export const memberConvertor = {
  toFirestore: (member: WithFieldValue<Member>) : DocumentData => {
    return {
      name: {
        first: member.firstName,
        last: member.lastName,
      },
      email: member.email,
      createdAt: member.createdAt,
      userRef: doc(db, `users/${member.userId}`)
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ) : Member => {
    const data = snapshot.data(options)
    return new Member({
      firstName: data.name.first,
      lastName: data.name.last,
      email: data.email,
      userId: data.userRef.replace(/users\//,'')
    })
  }
}
