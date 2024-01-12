import { Request, Response } from "express";
import dataSource from "../dataSource";
import { Category } from "../entities/Category";
import { Not } from "typeorm";
import { IController } from "./user-controller";
import fs from "fs";
import { unlink } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import { User, UserRole } from "../entities/User";

export const CategoryController: IController = {
  // GET ALL CATEGORIES

  getCategories: async (req: Request, res: Response): Promise<void> => {
    try {
      const allCategories = await dataSource.getRepository(Category).find();
      res.status(200).send(allCategories);
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: "Error while reading categories" });
    }
  },

  // GET ONE CATEGORY BY ID

  getOneCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const categoryToRead = await dataSource
        .getRepository(Category)
        .findOneBy({ id });
      if (categoryToRead === null) {
        res.status(404).send({ error: "Category not found" });
      } else {
        res.status(200).send(categoryToRead);
      }
    } catch (err) {
      res.status(400).send({ error: "Error while reading category" });
    }
  },

  // CREATE CATEGORY

  createCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, image } = req.body;

      // check if user is admin
      const { userId } = req.params;

      const currentUser = await dataSource
        .getRepository(User)
        .findOne({ where: { id: userId } });

      if (currentUser?.role !== UserRole.ADMIN) {
        res.status(403).send({
          error: "You are not authorized to create a category",
        });
        if (req.file !== undefined)
          await unlink(`./public/category/${req.file.filename}`);
      }

      // check if name is string or not empty
      const checkIfEmptyAndNotAString = async (
        value: string
      ): Promise<void> => {
        if (validator.isEmpty(value, { ignore_whitespace: true })) {
          res.status(422).send({ error: `Please fill the empty field` });
          if (req.file !== undefined)
            await unlink(`./public/category/${req.file?.filename}`);
          return;
        }
        if (typeof value !== "string") {
          res
            .status(400)
            .send({ error: `Field must contains only characters` });
          if (req.file !== undefined)
            await unlink(`./public/category/${req.file?.filename}`);
          return;
        }
      };

      const inputs: string[] = Object.values(req.body);
      inputs.forEach(async (value) => await checkIfEmptyAndNotAString(value));

      // Check format of category's name
      if (
        !validator.matches(
          name,
          /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]{2,100}$/
        )
      ) {
        res.status(400).send({
          error: `Field must contains only characters (min: 2, max: 100)`,
        });
        if (req.file !== undefined)
          await unlink(`./public/category/${req.file?.filename}`);
        return;
      }

      // check if image is an object
      if (image !== null && typeof image !== "object") {
        res.status(400).send({
          error: `Field image must contains a file`,
          file: typeof req.file,
        });
        if (req.file !== undefined)
          await unlink(`./public/category/${req.file?.filename}`);
        return;
      }

      // check if category name already exists in db
      const nameAlreadyExist = await dataSource
        .getRepository(Category)
        .count({ where: { name } });
      if (nameAlreadyExist > 0) {
        res.status(409).send({
          error: `Category already exists`,
        });
        if (req.file !== undefined)
          await unlink(`./public/category/${req.file?.filename}`);
        return;
      }

      // rename file image
      if (req.file !== undefined) {
        const originalname = req.file.originalname;
        const filename = req.file.filename;
        const newName = `${uuidv4()}-${originalname}`;
        fs.rename(
          `./public/category/${filename}`,
          `./public/category/${newName}`,
          (err) => {
            if (err !== null) throw err;
          }
        );
        req.body.image = `/public/category/${newName}`;
      } else {
        res.status(400).send({ error: "An image is required" });
        return;
      }

      await dataSource.getRepository(Category).save(req.body);
      res.status(201).send("Created category");
    } catch (error) {
      res.status(400).send({ error: "Something went wrong" });
      if (req.file !== undefined)
        await unlink(`./public/category/${req.file?.filename}`);
    }
  },

  // UPDATE CATEGORY BY ID

  updateCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, image } = req.body;

      // check if user is admin
      const { userId } = req.params;

      const currentUser = await dataSource
        .getRepository(User)
        .findOne({ where: { id: userId } });

      if (currentUser?.role !== UserRole.ADMIN) {
        res.status(403).send({
          error: "You are not authorized to create a category",
        });
        if (req.file !== undefined)
          await unlink(`./public/category/${req.file?.filename}`);
      }

      // validate format

      const checkIfEmptyAndNotAString = async (
        value: string
      ): Promise<void> => {
        if (validator.isEmpty(value, { ignore_whitespace: true })) {
          res.status(422).send({ error: `Please fill the empty field` });
        }
        if (typeof value !== "string") {
          res
            .status(400)
            .send({ error: `Field must contains only characters` });
          if (req.file !== undefined)
            await unlink(`./public/category/${req.file?.filename}`);
        }
      };

      // check if values are string and not empty

      const inputs: string[] = Object.values(req.body);
      inputs.forEach(async (value) => await checkIfEmptyAndNotAString(value));

      // check if name contains only characters

      if (
        name !== null &&
        !validator.matches(
          name,
          /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]{2,100}$/
        )
      ) {
        res.status(400).send({
          error: `Field must contains only characters (min: 2, max: 100)`,
        });
        if (req.file !== undefined)
          await unlink(`./public/category/${req.file?.filename}`);

        return;
      }

      // check if image is an object
      if (image !== null && typeof image !== "object") {
        res.status(400).send({
          error: `Field image must contains a file`,
        });
        if (req.file !== undefined)
          await unlink(`./public/category/${req.file?.filename}`);

        return;
      }

      // check if the category exists in db
      const categoryToUpdate = await dataSource
        .getRepository(Category)
        .findOneBy({ id });

      if (categoryToUpdate === null) {
        res.status(404).send({ error: "Category not found" });
        if (req.file !== undefined)
          await unlink(`./public/category/${req.file?.filename}`);

        return;
      }

      // check if body.name already exists in db
      if (name !== null) {
        const nameAlreadyExist = await dataSource
          .getRepository(Category)
          // check every tuples except the one updating
          .count({ where: { name, id: Not(id) } });

        if (nameAlreadyExist > 0) {
          res.status(409).send({ error: "Category name already exist" });
          if (req.file !== undefined)
            await unlink(`./public/category/${req.file?.filename}`);

          return;
        }
      }

      // rename the new file and delete the old one
      if (req.file !== undefined) {
        // rename
        const originalname = req.file.originalname;
        const filename = req.file.filename;
        const newName = `${uuidv4()}-${originalname}`;
        fs.rename(
          `./public/category/${filename}`,
          `./public/category/${newName}`,
          (err) => {
            if (err !== null) throw err;
          }
        );
        req.body.image = `/public/category/${newName}`;
        // delete
        if (categoryToUpdate.image !== null) {
          await unlink("." + categoryToUpdate.image);
        }
      }

      await dataSource.getRepository(Category).update(id, req.body);
      res.status(200).send("Updated category");
    } catch (err) {
      res.status(400).send({ error: "Error while updating category" });
      if (req.file !== undefined)
        await unlink(`./public/category/${req.file?.filename}`);
    }
  },

  // DELETE CATEGORY BY ID

  deleteCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // check if user is admin
      const { userId } = req.params;

      const currentUser = await dataSource
        .getRepository(User)
        .findOne({ where: { id: userId } });

      if (currentUser?.role !== UserRole.ADMIN) {
        res.status(403).send({
          error: "You are not authorized to create a category",
        });
      }

      // check if category exists in db
      const categoryToDelete = await dataSource
        .getRepository(Category)
        .findOneBy({ id });
      if (categoryToDelete === null) {
        res.status(404).send({ error: "Category not found" });
        return;
      }

      await dataSource.getRepository(Category).delete(id);

      // delete image in public directory
      if (categoryToDelete.image !== null) {
        await unlink("." + categoryToDelete.image);
      }

      res.status(200).send("Deleted category");
    } catch (err) {
      res.status(400).send({ error: "Error while deleting category" });
    }
  },
};
