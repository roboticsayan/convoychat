import Member from "./Member";
import { ObjectID } from 'mongodb';
import { User } from "../entities/User";
import { Message } from "../entities/Message";
import { Field, ObjectType, ID } from "type-graphql";
import { prop, Ref, getModelForClass, arrayProp, modelOptions } from "@typegoose/typegoose";

@ObjectType()
@modelOptions({
  options: { customName: 'room', },
  schemaOptions: {
    timestamps: true,
    collection: "rooms"
  }
})
export class Room {
  @Field(type => ID)
  _id: ObjectID;

  @Field()
  createdAt: Date

  @Field()
  @prop({ required: true })
  public name!: String;

  @Field(type => [Member])
  @arrayProp({ ref: 'user' })
  public members?: Ref<Member>[];

  @Field(type => [Message])
  @arrayProp({ ref: 'message' })
  public messages!: Ref<Message>[];

  @Field(type => ID)
  @prop({ ref: 'user', required: true })
  public owner!: Ref<User>;
}

const RoomModel = getModelForClass(Room);

export default RoomModel;