import { Human } from './humans'
import { db } from '@/initFirebase';
import { QueryDocumentSnapshot, SnapshotOptions } from '@firebase/firestore-types';
import { collection, query, where, getDocs, doc, WithFieldValue, DocumentData} from "firebase/firestore"

export class Member extends Human {
  userId: string | undefined
  lastBakedAt?: Date | null

  constructor (
    {firstName, lastName, email, userId, lastBakedAt = null}
    :
    {
      firstName : string,
      lastName: string,
      email: string,
      userId: string | undefined,
      lastBakedAt?: Date | null
    }
  ) {
    super({firstName, lastName, email})
    this.userId = userId
    this.lastBakedAt = lastBakedAt
  }

  static async getMyMembers(userId: string) {
    const memberQuery = query(
      collection(db, "members"), where("userRef", "==", doc(db, `users/${userId}`))
    ).withConverter<Member>(memberConvertor as any)

    const querySnapshot = await getDocs(memberQuery)

    const members : Member[] = []

    querySnapshot.forEach((doc) => {
      members.push(doc.data())
    })

    return members
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
      lastBakedAt: null,
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
      userId: data.userRef.id,
      lastBakedAt: data.lastBakedAt ? data.lastBakedAt.toDate() : null
    })
  }
}
