import { Request, Response } from "express";
import dataSource from "../dataSource";
import { Category } from "../entities/Category";

export default class CategoryController {
  // categoriesController.getCategories
  // changer void par Category[] | null une fois qu'on aura importé les types
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const allCategories = await dataSource.getRepository(Category).find();
      res.status(200).send(allCategories);
    } catch (err) {
      console.log(err);
      res.status(400).send("Error while reading categories");
    }
  }

  // categoriesController.createCategory
  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const createCategory = await dataSource
        .getRepository(Category)
        .count({ where: { name: req.body.name } });
      if (createCategory > 0) {
        res.status(409).send("Category already exists");
      } else {
        await dataSource.getRepository(Category).save(req.body);
        res.status(201).send("Created category");
      }
    } catch (error) {
      res.status(400).send("Something went wrong");
    }
  }

  // categoriesController.getOneCategory
  // la route n'existe pas mais j'ai créé le controller au cas où
  // changer void par Category | null une fois qu'on aura importé les types
  async getOneCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params;
      const categoryToRead = await dataSource
        .getRepository(Category)
        .findOneBy({ id });
      if (categoryToRead === null) {
        res.status(404).send("Category not found");
      } else {
        res.status(200).send(categoryToRead);
      }
    } catch (err) {
      res.status(400).send("Error while reading category");
    }
  }

  // categoriesController.updateCategory
  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params;
      const categoryToUpdate = await dataSource
        .getRepository(Category)
        .findOneBy({ id });
      if (categoryToUpdate === null) {
        res.status(404).send("Category not found");
      } else {
        await dataSource.getRepository(Category).update(id, {
          // à modifier en fonction du contenu
        });
        res.status(200).send("Updated category");
      }
    } catch (err) {
      res.status(400).send("Error while updating category");
    }
  }

  // categoriesController.deleteCategory
  async deleteProfile(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params;
      const categoryToDelete = await dataSource
        .getRepository(Category)
        .findOneBy({ id });
      if (categoryToDelete === null) {
        res.status(404).send("Category not found");
      } else {
        await dataSource.getRepository(Category).delete(id);
        res.status(200).send("Deleted category");
      }
    } catch (err) {
      res.status(400).send("Error while deleting category");
    }
  }
}
