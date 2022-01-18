import { IsNull, Not } from 'typeorm';
import { paginateResults } from '../common/paginateResults';
import { UserId } from '../users/User';
import { Plant } from './Plant';

interface GetPlantsParams {
  page: number;
  take?: number;
  tags?: string[];
  sell?: boolean;
  text?: string;
  swap?: boolean;
  userId?: UserId;
  donate?: boolean;
}
export async function getPlants({
  tags,
  sell,
  swap,
  text,
  donate,
  userId,
  page = 0,
  take = 50,
}: GetPlantsParams) {
  const query = Plant.createQueryBuilder('plant');

  query.select([
    'plant.id',
    'plant.name',
    'plant.swap',
    'plant.donate',
    'plant.price',
    'plant.city',
    'plant.state',
    'plant.card']);

  if (swap || donate || sell) {
    query.where({ swap, donate, price: null });
    if (swap) query.orWhere({ swap });
    if (donate) query.orWhere({ donate });
    if (sell) query.orWhere({ price: Not(IsNull()) });
  }

  if (userId) {
    query.where({ userId });
  }

  if (text) {
    query.where(
      `to_tsvector('portuguese', plant.name) || 
      to_tsvector('portuguese', plant.description)
      @@ plainto_tsquery('portuguese', :text)`,
      { text },
    );
  }

  if (tags && tags.length) {
    query
      .leftJoin('plant.tags', 'tag')
      .leftJoinAndSelect('plant.tags', 'tagSelect')
      .where('tag.name LIKE ANY (:searchQuery)', {
        searchQuery: tags,
      });
  }

  const skip = page * take;
  query
    .skip(skip)
    .take(take)
    .loadRelationIdAndMap('images', 'plant.images')
    .addSelect('user');

  return paginateResults(query.getManyAndCount(), { page, take });
}
