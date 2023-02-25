export class Human {
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
