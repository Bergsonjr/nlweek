import { Request, Response } from "express";
import knex from "../database/connection";

class ItemsController {
  async index(request: Request, response: Response) {
    try {
      const items = await knex("items").select("*");
      const serializedItems = items.map((item) => {
        return {
          title: item.title,
          image_url: `http://localhost:3333/uploads/${item.image}`,
        };
      });

      return response.status(200).json(serializedItems);
    } catch (error) {
      console.log("erro in get items");
    }
  }
}

export default ItemsController;
