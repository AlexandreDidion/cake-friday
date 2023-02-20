import { QueryDocumentSnapshot, SnapshotOptions } from '@firebase/firestore-types';

export class Member {
  firstName: string
  lastName: string
  email: string
  createdAt : Date

  constructor (
    {firstName, lastName, email} : {firstName : string, lastName: string, email: string}
  ) {
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.createdAt = new Date()
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

// Firestore data converter
export const memberConvertor = {
  toFirestore: (member: Member) => {
    return {
      name: {
        first: member.firstName,
        last: member.lastName,
      },
      email: member.email,
      createdAt: member.createdAt
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options)
    return new Member({
      firstName: data.name.first,
      lastName: data.name.last,
      email: data.name.email
    })
  }
}
