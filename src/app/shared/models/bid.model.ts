import { User } from "@auth0/auth0-angular";

export interface Bid extends User {
  price: number,
  fromUser: User,
  createdAt: Date,
  _id?: string,
  __v?: number
}

export const BidMockup = {
  price: 0,
  fromUser: {
    userId: '',
    email: '',
    phoneNumber: 0,
    picture: '',
    name: ''
  },
  createdAt: new Date(),
  _id: '',
  __v: 0
}