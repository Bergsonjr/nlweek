import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(request: Request, response: Response) {
    try {
      const { city, uf, items } = request.query;

      const parsedItems = String(items)
        .split(",")
        .map((item) => Number(item.trim()));

      const points = await knex("points")
        .join("point_items", "points.id", "=", "point_items.point_id")
        .whereIn("point_items.item_id", parsedItems)
        .where("city", String(city))
        .where("uf", String(uf))
        .distinct()
        .select("points.*");

      return response.status(200).json(points);
    } catch (error) {
      console.log("erro in get points");
      return response.status(400).json(error);
    }
  }
  async show(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const point = await knex("points").where("id", id).first();

      if (!point) {
        return response.status(404).json({ message: "Point not found!" });
      }

      const items = await knex("items")
        .join("point_items", "items.id", "=", "point_items.item_id")
        .where("point_items.point_id", id)
        .select("items.title");

      return response.status(200).json({ ...point, items });
    } catch (error) {
      console.log("erro in get point");
      return response.status(400).json(error);
    }
  }
  async create(request: Request, response: Response) {
    try {
      const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items,
      } = request.body;

      const trx = await knex.transaction();

      const point = {
        image: "fake-image",
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
      };

      const [insertedIds] = await trx("points").insert(point);

      const pointItems = items.map((item_id: Number) => {
        return {
          item_id,
          point_id: insertedIds,
        };
      });

      await trx("point_items").insert(pointItems);

      await trx.commit();

      return response.status(201).json({
        id: insertedIds,
        ...point,
      });
    } catch (error) {
      console.log("erro in create point");
      return response.status(400).json(error);
    }
  }
}

export default PointsController;
