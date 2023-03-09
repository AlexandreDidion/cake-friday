import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { User, userConvertor } from '@/models/users'
import { auth, db } from '@/initFirebase'

import { UserObject as SignUpObject } from '@/components/SignUp'
import { UserObject as LogInObject  } from '@/components/LogIn'

const createUser = async (user: SignUpObject, newUserId: string) => {
  const newUser = new User({
    id: newUserId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password
  })

  const newUserRef = doc(db, "users", newUserId).withConverter(userConvertor as any)

  await setDoc(newUserRef, newUser)
}

const isNewUser = async (userUid: string) => {
  const docRef = doc(db, 'users', userUid)
  const docSnap = await getDoc(docRef)

  return docSnap.exists() ? false : true
}

export const signUp = async (user: SignUpObject, onError: (error: any) => void) => {
  let newUser
  try {
    newUser = await createUserWithEmailAndPassword(auth, user.email, user.password)
  } catch(err: any) {
    onError(err)
  }

  if (newUser) {
    await updateProfile(newUser.user, {
      displayName: `${user.firstName} ${user.lastName}`
    })

    const shouldCreate = await isNewUser(newUser.user.uid)
    if (shouldCreate) createUser(user, newUser.user.uid)
    return newUser
  }
}

export const logIn = async (user: LogInObject, onError: (error: any) => void)  => {
  let loggedUser
  try {
    loggedUser = await signInWithEmailAndPassword(auth, user.email, user.password)
  } catch(err: any) {
    onError(err)
  }

  return loggedUser
}

export const logOut = async (onError?: (error: any) => void) => {
  try {
    await signOut(auth)
  } catch(err: any) {
    if (onError) onError(err)
  }
}
