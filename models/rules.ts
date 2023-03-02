import { QueryDocumentSnapshot, SnapshotOptions } from '@firebase/firestore-types'
import { db } from '@/initFirebase'
import { DocumentData , doc, query, collection, where, getDocs} from 'firebase/firestore'
import dayjs from 'dayjs'

export class Rule {
  id: string
  numberOfBakers: number
  nextDay: Date
  userId: string | undefined

  constructor (
    {id = self.crypto.randomUUID(), numberOfBakers, nextDay = dayjs().add(3, 'day').toDate(), userId} : {id?: string, numberOfBakers : number, nextDay?: Date, userId: string | undefined}
  ) {
    this.id = id
    this.numberOfBakers = numberOfBakers
    this.nextDay = nextDay
    this.userId = userId
  }

  static async getMyRule(userId: string) {
    const ruleQuery = query(
      collection(db, "rules"), where("userRef", "==", doc(db, `users/${userId}`))
    ).withConverter<Rule>(ruleConvertor as any)

    const querySnapshot = await getDocs(ruleQuery)

    const rules : Rule[] = []

    querySnapshot.forEach((doc) => {
      rules.push(doc.data())
    })

    return rules[0]
  }
}

// Firestore data converter
export const ruleConvertor = {
  toFirestore: (rule: Rule) : DocumentData => {
    return {
      id: rule.id,
      numberOfBakers: rule.numberOfBakers,
      nextDay: rule.nextDay,
      userRef: doc(db, `users/${rule.userId}`)
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions
  ) : Rule => {
    const data = snapshot.data(options)
    return new Rule({
      id: data.id,
      numberOfBakers: data.numberOfBakers,
      nextDay: data.nextDay.toDate(),
      userId: data.userRef.id,
    })
  }
}
