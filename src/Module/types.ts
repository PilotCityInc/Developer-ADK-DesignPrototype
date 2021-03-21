import { ObjectId } from 'bson';

export interface TableItem {
  id: ObjectId;
  author: ObjectId;
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
  update: (shouldMarkAsComplete?: any) => Promise<any>;
  changeStream: any;
}
