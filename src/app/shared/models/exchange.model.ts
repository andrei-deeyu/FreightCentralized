import { User } from "./user.model";
import { RouteData } from "./routeData.model";

export interface Exchange extends RouteData {
  details: string;
  budget: number;
  payment_deadline: string;
  valability: string;
  pallet: {
    type: string;
    number: number;
  };
  size: {
    tonnage: number;
    volume: number;
    height: number;
    width: number;
    length: number;
  };
  truck: {
    regime: string;
    type: Array<string>;
    features: Array<string>;
  };
  fromUser: User,
  _id: string;
  isLiked?: boolean,
  createdAt: Date,
  new?: boolean,
  markedAsContracted?: boolean,
  __v? : number
}

export const ExchangeMockup = {
  origin: 'Oradea',
  destination: 'București',
  distance: 596,
  details: '',
  budget: 0,
  payment_deadline: '60days',
  valability: '1days',
  pallet: {
    type: '',
    number: 0,
  },
  size: {
    tonnage: 0,
    volume: 0,
    height: 0,
    width: 0,
    length: 0,
  },
  truck: {
    regime: 'FTL',
    type: [],
    features: [],
  },
  fromUser: {
    userId: '',
    email: '',
    phoneNumber: 0,
    picture: '',
    name: ''
  },
  _id: '',
  createdAt: new Date()
}