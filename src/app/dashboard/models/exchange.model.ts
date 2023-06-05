export interface Exchange {
  userId: number;
  _id: string;
  title: string;
  body: string;
  isLiked?: boolean,
  createdAt: Date,
  new?: boolean
}