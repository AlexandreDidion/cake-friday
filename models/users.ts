import { Human } from './humans'
import { QueryDocumentSnapshot, SnapshotOptions } from '@firebase/firestore-types'
import { DocumentData, PartialWithFieldValue } from 'firebase/firestore'
export class User extends Human {
  password: string

  constructor (
    {firstName, lastName, email, password} : {firstName : string, lastName: string, email: string, password: string}
  ) {
    super({firstName, lastName, email})
    this.password = password
  }
}

// Firestore data converter
export const userConvertor = {
  toFirestore: (user: PartialWithFieldValue<User>) : DocumentData => {
    return {
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
      firstName: data.name.first,
      lastName: data.name.last,
      password: data.password,
      email: data.email,
    })
  }
}
