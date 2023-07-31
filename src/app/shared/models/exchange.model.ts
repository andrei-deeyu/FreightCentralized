import { User } from "./user.model";

export interface Exchange {
  origin: string,
  destination: string,
  distance: number,
  details: string;
  budget: number;
  valability: string
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
  __v? : number
}

export const ExchangeMockup = {
  origin: 'Oradea',
  destination: 'București',
  distance: 596,
  details: '',
  budget: 0,
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
    picture: '',
    name: ''
  },
  _id: '',
  createdAt: new Date()
}