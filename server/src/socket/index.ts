import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import Notification from '../models/Notification';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));
      (socket as any).user = user;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user;
    socket.join(`user:${user._id}`);

    socket.on('join:conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('leave:conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('message:send', async (data: { conversationId: string; content: string }) => {
      try {
        const conversation = await Conversation.findById(data.conversationId);
        if (!conversation) return;

        const userId = user._id.toString();
        if (
          conversation.client.toString() !== userId &&
          conversation.dev.toString() !== userId
        ) return;

        const message = await Message.create({
          conversation: data.conversationId,
          sender: user._id,
          content: data.content,
        });

        conversation.lastMessage = data.content;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        const populated = await message.populate('sender', 'name avatar');

        io.to(`conversation:${data.conversationId}`).emit('message:new', populated);

        const receiverId =
          conversation.client.toString() === userId
            ? conversation.dev.toString()
            : conversation.client.toString();
        io.to(`user:${receiverId}`).emit('message:notification', {
          conversationId: data.conversationId,
          message: data.content,
          sender: { _id: user._id, name: user.name, avatar: user.avatar },
        });

        const notif = await Notification.create({
          recipient: receiverId,
          type: 'new_message',
          title: 'New Message',
          message: `${user.name}: ${data.content.substring(0, 100)}`,
          data: {
            conversationId: data.conversationId,
            actorId: user._id.toString(),
            actorName: user.name,
            actorAvatar: user.avatar,
          },
        });
        io.to(`user:${receiverId}`).emit('notification:new', notif);
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {});
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};
