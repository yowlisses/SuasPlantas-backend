import { Request, Response } from 'express';
import { getNotifications } from './getNotifications';
import { viewNotification } from './viewNotification';
import { getNotificationHash } from './getNotificationHash';
import { validateAuthenticated } from '../utils/validateAuthenticated';

export const NotificationsController = {
  async get(req:Request, res:Response) {
    const { userId } = req;
    const notifications = await getNotifications({ userId, ...req.query });
    return res.send(notifications);
  },

  async viewed(req:Request, res:Response) {
    const { id } = req.params;
    const { userId } = req;
    const notification = await viewNotification({ id, userId });
    res.send(notification);
  },

  async hash(req:Request, res:Response) {
    validateAuthenticated(req);
    const { userId } = req;
    const hash = await getNotificationHash(userId);
    res.send(hash);
  },
};
