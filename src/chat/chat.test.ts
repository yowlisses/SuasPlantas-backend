/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import req from 'supertest';
import Client, { Socket } from 'socket.io-client';

import { io } from '../socket/io';
import { Message } from './Message';
import { app } from '../server/app';
import { User } from '../users/User';
import { saveMessage } from './saveMessage';
import { PORT_SOCKET } from '../config/env';
import { session } from '../session/session';
import { getUserChats } from './getUserChats';
import { getChatMessages } from './getChatMessages';
import { startSocket } from '../socket/startSocket';
import { startDatabase } from '../database/startDatabase';

beforeAll(async () => {
  await startDatabase();
  const messageRepo = Message.getRepository();

  await User.createQueryBuilder().insert().values([
    { name: 'user 1', image: 'image 1' },
    { name: 'user 2', image: 'image 2' },
    { name: 'user 3', image: 'image 3' },
    { name: 'user 4', image: 'image 4' },
  ]).execute();

  const messages = [[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]];

  for (const value of messages) {
    await messageRepo.insert({
      senderId: value[0],
      receiverId: value[1],
      text: `${value[0]} -> ${value[1]}`,
    });
  }
});

it('should return user chats', async () => {
  const userId = 1;
  const chats = await getUserChats(userId);
  expect(chats).toMatchObject([
    {
      text: '3 -> 1',
      senderId: 3,
      receiverId: 1,
      lastTime: expect.any(Date),
      userId: 3,
      name: 'user 3',
      image: 'image 3',
    },
    {
      text: '2 -> 1',
      senderId: 2,
      receiverId: 1,
      lastTime: expect.any(Date),
      userId: 2,
      name: 'user 2',
      image: 'image 2',
    },
  ]);
  expect(chats[0].lastTime > chats[1].lastTime);
});

it('should return chat messages', async () => {
  const res = await getChatMessages({ userIds: [1, 2] });
  expect(res).toMatchObject({
    pageData: {
      page: 0, totalPages: 1, totalCount: 2, nextPage: null,
    },
    content: [
      {
        id: 2,
        text: '2 -> 1',
        senderId: 2,
        sender: undefined,
        receiverId: 1,
        receiver: undefined,
        createdAt: expect.any(Date),
      },
      {
        id: 1,
        text: '1 -> 2',
        senderId: 1,
        sender: undefined,
        receiverId: 2,
        receiver: undefined,
        createdAt: expect.any(Date),
      },
    ],
  });
  expect(res.content[0].createdAt > res.content[1].createdAt);
});

it('should send a message', async () => {
  const message = await saveMessage({
    text: '3 -> 4',
    senderId: 3,
    receiverId: 4,
  });
  expect(message).toMatchObject(
    {
      id: expect.any(Number),
      text: '3 -> 4',
      senderId: 3,
      sender: undefined,
      receiverId: 4,
      receiver: undefined,
      createdAt: expect.any(Date),
    },
  );
});

describe('message sending and realtime', () => {
  let clientSocket:Socket;

  beforeAll(async () => {
    startSocket();
    clientSocket = Client(`http://localhost:${PORT_SOCKET}`);
  });

  afterAll(async () => {
    io.close();
    clientSocket.close();
  });

  it('should send a message with realtime event', (done) => {
    const expectedMessage = {
      id: expect.any(Number),
      text: '3 -> 4',
      senderId: 3,
      receiverId: 4,
      createdAt: expect.any(String),
    };

    // authenticate client socket to user 4
    clientSocket.on('receive_message', async (message) => {
      expect(message).toMatchObject(expectedMessage);
      done();
    });
    session().create(4).then((token) => {
      clientSocket.emit('auth', token, (res) => {
        expect(res).toMatchObject({
          rooms: [expect.any(String), '4'],
          status: 200,
          userId: 4,
        });

        // send message as user 3 to user 4
        session().create(3).then((token) => {
          const message = { text: '3 -> 4', userId: 4 };
          clientSocket.emit('send_message', token, message, (res) => {
            expect(res).toMatchObject(expectedMessage);
          });
        });
      });
    });
  });
});
