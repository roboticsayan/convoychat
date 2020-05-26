const { ApolloError } = require("apollo-server-express");
const { User } = require("../models/UserModel");
const { Room } = require("../models/RoomModel");
const { Message } = require("../models/MessageModel");
const { NEW_MESSAGE } = require("../constants");

exports.me = (_, __, context) => context.currentUser;

exports.listUsers = async () => {
  try {
    let users = await User.find({}).populate("rooms");
    return users;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.getUser = async (_, args) => {
  try {
    let user = await User.findOne({ _id: args.id }).populate("rooms");
    if (!user) throw new ApolloError(`User not found with id ${args.id}`);
    return user;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.sendMessage = async (parent, args, context) => {
  let room = await Room.findOne({
    _id: args.roomId,
    members: { $in: [context.currentUser.id] },
  });

  if (!room) {
    throw new ApolloError(
      "Room not found or you are not a member of this room"
    );
  }

  let message = new Message({
    content: args.content,
    roomId: args.roomId,
    author: context.currentUser.id,
  });
  message.populate("author").execPopulate();

  let saved = await message.save({ roomId: args.roomId });
  context.pubsub.publish(NEW_MESSAGE, { newMessage: saved });

  return saved;
};
