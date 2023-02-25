import { Human } from './humans'
import { QueryDocumentSnapshot, SnapshotOptions } from '@firebase/firestore-types';

export class Member extends Human {
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
