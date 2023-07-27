import { User } from "./user.model";

export interface Company {
  _id: string,
  name: string,
  cui: number,
  admin: User,
  employees: Array<User>,
  createdAt: Date,
  __v?: number
}