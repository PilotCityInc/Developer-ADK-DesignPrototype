import { ObjectId } from 'bson';

export interface TableItem {
  id: ObjectId;
  author: number;
  time: Date;
  log: string;
  proof: Image | Image[];
}
export interface Image {
  name: string;
  url: string;
}

export interface MongoDoc {
  data: Record<string, any>;
  update: () => Promise<any>;
  changeStream: any;
}