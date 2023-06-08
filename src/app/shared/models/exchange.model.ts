export interface Exchange {
  fromUser: {
    userId: string;
    email: string,
    picture: string,
    name?: string
  }
  _id: string;
  title: string;
  body: string;
  isLiked?: boolean,
  createdAt: Date,
  new?: boolean
}