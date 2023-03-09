import { Human } from './humans'
import { QueryDocumentSnapshot, SnapshotOptions } from '@firebase/firestore-types'
import {collection, query, where, getDocs, DocumentData, PartialWithFieldValue } from 'firebase/firestore'
import { db } from '@/initFirebase'
import { Member } from './members'

export class User extends Human {
  password: string

  constructor (
    {id, firstName, lastName, email, password} : {id?: string, firstName : string, lastName: string, email: string, password: string}
  ) {
    super({id, firstName, lastName, email})
    this.password = password
  }

  static findByEmail = async (email: string | undefined | null) => {
    if (!email) return

    const q = query(collection(db, "users"), where("email", "==", email)).withConverter<User>(userConvertor as any)
    const users : User[] = []
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => users.push(doc.data()))
    return users[0]
  }

  convertToMember = () => {
    return new Member({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        userId: this.id,
        lastBakedAt: null,
      })
  }
}

// Firestore data converter
export const userConvertor = {
  toFirestore: (user: PartialWithFieldValue<User>) : DocumentData => {
    return {
      id: user.id,
      name: {
        first: user.firstName,
        last: user.lastName,
      },
      email: user.email,
      password: user.password,
      createdAt: user.createdAt
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions
  ) : User => {
    const data = snapshot.data(options)
    return new User({
      id: data.id,
      firstName: data.name.first,
      lastName: data.name.last,
      password: data.password,
      email: data.email,
    })
  }
}
