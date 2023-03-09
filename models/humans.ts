export class Human {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt : Date

  constructor (
    {
      id = self.crypto.randomUUID(),
      firstName,
      lastName,
      email
    } :
    {
      id?: string
      firstName : string,
      lastName: string,
      email: string
    }
  ) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.createdAt = new Date()
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
