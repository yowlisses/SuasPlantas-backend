import { getManager } from 'typeorm';
import { Plant, PlantId } from '../plant/Plant';

export async function alsoSaw(plantId: PlantId):Promise<Plant[]> {
  // this query selects the users that viewed a given plant
  // then select the plants that they viewed ordered by number of views from these users
  return getManager().query(`
SELECT
  rank,
  plant.id,
  plant.name,
  plant.card,
  city,
  state
FROM
(
      (
          SELECT
              view2.plant_id,
              count(view2.plant_id) AS rank
          FROM
              (
                  SELECT
                      DISTINCT user_id
                  FROM
                      VIEW view1
                  WHERE
                      plant_id = $1
              ) AS view1
              LEFT JOIN VIEW view2 ON view2.user_id = view1.user_id
          GROUP BY
              view2.plant_id
      ) AS ranked
      LEFT JOIN plant ON plant.id = plant_id
  )
  LEFT JOIN "user" ON "user".id = plant.user_id
WHERE
  plant.id != $1
ORDER BY
  rank DESC
LIMIT
  14
`, [plantId]);
}
