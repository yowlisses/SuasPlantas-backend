import { Request } from 'express';
import { createPlant } from './createPlant';
import { findPlant } from './findPlant';
import { getPlants } from './getPlants';
import { removePlant } from './removePlant';
import { editPlant } from './editPlant';
import { getPlantsSitemap } from './getPlantsSitemap';
import { likePlant } from './likePlant';
import { dislikePlant } from './dislikePlant';
import { addView } from '../view/addView';
import { notificateNewPlant } from '../notification/notificateNewPlant';

function optionalBoolean(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

export const PlantsController = {
  async get(req, res) {
    const {
      sell, swap, donate, page, ...rest
    } = req.query;
    const plants = await getPlants({
      sell: optionalBoolean(sell),
      swap: optionalBoolean(swap),
      donate: optionalBoolean(donate),
      page: Number(page) || 0,
      ...rest,
    });
    res.send(plants);
  },

  async getOne(req, res) {
    const { id } = req.params;
    const { userId } = req.session;
    const plant = await findPlant(Number(id), userId);
    res.send(plant);
    if (userId) { addView(userId, plant.id); }
  },

  async create(req:Request, res) {
    const { userId } = req.session;
    const plant = await createPlant(req.body, userId);
    res.send(plant);
    await notificateNewPlant(plant);
  },

  async edit(req, res) {
    const { userId } = req.session;
    res.send(await editPlant(req.body, userId));
  },

  async remove(req, res) {
    const { id } = req.params;
    const { userId } = req.session;
    await removePlant(id, userId);
    res.send();
  },

  async sitemap(req, res) {
    const result = await getPlantsSitemap();
    res.send(result);
  },

  async like(req, res) {
    const { id } = req.params;
    const { userId } = req.session;
    const like = await likePlant(id, userId);
    res.send(like);
  },

  async dislike(req, res) {
    const { id } = req.params;
    const { userId } = req.session;
    const like = await dislikePlant(id, userId);
    res.send(like);
  },
};
