import { Human } from './humans'
import { QueryDocumentSnapshot, SnapshotOptions } from '@firebase/firestore-types';
import { DocumentData, WithFieldValue } from 'firebase/firestore'

export class Member extends Human {
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
      createdAt: member.createdAt
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
      email: data.name.email
    })
  }
}
