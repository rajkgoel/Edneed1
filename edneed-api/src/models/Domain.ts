import { ObjectID } from "mongodb";
import mongoose, {Document, model, ObjectId, Schema} from "mongoose";

const domainSchema = new Schema({
  id: String,
  text: String,
  level: Number,
  parent_id: String,
  modified_on: Date
});

export interface IDomain extends Document {
    id: string;
    text: string;
    parent_id?: string;
    level: number;
    modified_on?: Date;
    domains?: IDomain[];
}

export default model<IDomain>("Domain", domainSchema);

// export class Domain implements IDomain {
//   text: string;
//   parent_id?: string | undefined;
//   level: number;
//   modified_on?: Date;
//   domains: Domain[];

//   constructor(text: string, level: number, id?: string, parent_id?: string) {
//     this.text = text;
//     this.level = level;
//     this.parent_id = id;
//     this.id = id;
//     this.domains = [];
//   }
// }