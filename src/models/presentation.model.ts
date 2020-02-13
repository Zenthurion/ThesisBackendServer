import * as mongoose from "mongoose";
import {Schema, Document} from 'mongoose';

// Inspired by: https://medium.com/@tomanagle/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722
export interface IPresentation extends Document {
    name: string;
    content: [{title: string, body: string, hasNext: boolean, hasPrevious: boolean}];
}

const PresentationSchema: Schema = new Schema({
        name: {type: String, required: true, unique: true},
        content: [{title: String, body: String, hasNext: Boolean, hasPrevious: Boolean}],
    }
);

export default mongoose.model<IPresentation>('Presentation', PresentationSchema);