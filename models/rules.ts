import { QueryDocumentSnapshot, SnapshotOptions } from '@firebase/firestore-types'
import { db } from '@/initFirebase'
import { DocumentData , doc, query, collection, where, getDocs} from 'firebase/firestore'
import dayjs from 'dayjs'

export class Rule {
  numberOfBakers: number
  nextDay: Date
  userId: string

  constructor (
    {numberOfBakers, nextDay = dayjs().toDate(), userId} : {numberOfBakers : number, nextDay?: Date, userId: string}
  ) {
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
      numberOfBakers: data.numberOfBakers,
      nextDay: data.nextDay.toDate(),
      userId: data.userRef.id,
    })
  }
}
