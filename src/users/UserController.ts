import { Request, Response } from 'express';
import { isArray } from 'class-validator';
import { signIn } from './signIn';
import { getUser } from './getUser';
import { getUsers } from './getUsers';
import { editUser } from './editUser';
import { error } from '../utils/error';
import { removeUser } from './removeUser';
import { getUserQuests } from './getUserQuests';
import { editUserLocation } from './editUserLocation';
import { validateProvided } from '../utils/validateProvided';
import { validateAuthenticated } from '../utils/validateAuthenticated';

export const UserController = {
  async getOne(req, res) {
    const { id } = req.params;
    const user = await getUser(Number(id));
    return res.send(user);
  },

  async me(req: Request, res) {
    validateAuthenticated(req);
    const { userId } = req.session;
    const user = await getUser(userId);
    return res.send(user);
  },

  async remove(req, res) {
    const { userId } = req.session;
    await removeUser(userId);
    return res.send();
  },

  async edit(req, res) {
    const { userId } = req.session;
    const user = await editUser(userId, req.body);
    return res.send(user);
  },

  async editLocation(req, res) {
    const { userId } = req.session;
    const { latitude, longitude } = req.body;
    validateProvided({ latitude, longitude });
    const location = { latitude, longitude };
    const result = await editUserLocation({ userId, location });
    return res.send(result);
  },

  async signIn(req:Request, res:Response) {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (Array.isArray(ip)) [ip] = ip;
    const { accessToken, provider } = req.body;
    const user = await signIn({ accessToken, provider, ip });
    req.session.userId = user.id;
    return res.send(user);
  },

  async logout(req:Request, res:Response) {
    req.session.destroy((err) => {
      if (err) { error(500, 'Unexpected error in logout'); }
      return res.end();
    });
  },

  async getQuests(req:Request, res:Response) {
    const { userId } = req.session;
    const quests = await getUserQuests(userId);
    return res.send(quests);
  },

  async getMany(req:Request, res:Response) {
    const users = await getUsers({
      ...req.query,
      page: Number(req.query) || 0,
    });
    return res.send(users);
  },
};
