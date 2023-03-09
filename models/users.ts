import { Human } from './humans'
import { QueryDocumentSnapshot, SnapshotOptions } from '@firebase/firestore-types'
import { DocumentData, PartialWithFieldValue } from 'firebase/firestore'
export class User extends Human {
  password: string

  constructor (
    {id, firstName, lastName, email, password} : {id?: string, firstName : string, lastName: string, email: string, password: string}
  ) {
    super({id, firstName, lastName, email})
    this.password = password
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
