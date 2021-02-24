export interface TableItem {
  id: number;
  author: number;
  time: Date;
  log: string;
  proof: Image | Image[];
}
export interface Image {
  name: string;
  url: string;
}
