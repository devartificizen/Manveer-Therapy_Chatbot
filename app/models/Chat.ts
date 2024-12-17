import { Schema, model, models, Document, Types } from "mongoose";

export interface IMessage {
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export interface IChat extends Document {
  userId: Types.ObjectId;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  content: { type: String, required: true },
  isBot: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new Schema<IChat>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [messageSchema],
}, { timestamps: true });

const Chat = models?.Chat || model<IChat>("Chat", chatSchema);

export default Chat;
