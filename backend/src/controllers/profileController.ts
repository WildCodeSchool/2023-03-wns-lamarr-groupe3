import { Request, Response } from "express";
import dataSource from "../dataSource";
import { User, UserRole } from "../entities/User";
import { Poi } from "../entities/Poi";
import { City } from "../entities/City";
import { IController } from "./user-controller";
import fs from "fs";
import { unlink } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";

export const ProfileController: IController = {
  // GET ALL PROFILES

  getProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const allProfiles = await dataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .select([
          "user.id",
          "user.username",
          "user.image",
          "user.role",
          "user.city",
          "user.email",
        ])
        .leftJoinAndSelect("user.createdPoi", "createdPoi")
        .getMany();

      res.status(200).send(allProfiles);
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: "Error while reading users" });
    }
  },

  // GET ONE PROFILE BY ID

  getOneProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      // check if profile exists in db
      const profileToRead = await dataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .select([
          "user.id",
          "user.username",
          "user.image",
          "user.role",
          "user.city",
          "user.email",
        ])
        .leftJoinAndSelect("user.createdPoi", "createdPoi")
        .where("user.id = :id", { id })
        .getOne();

      if (profileToRead === null) {
        res.status(404).send({ error: "User not found" });
      } else {
        res.status(200).send(profileToRead);
      }
    } catch (err) {
      res.status(400).send({ error: "Error while reading user" });
    }
  },

  // UPDATE PROFILE BY ID

  updateProfile: async (req: Request, res: Response): Promise<void> => {
    const { id, userId } = req.params;
    const { username, email, city, password, role } = req.body;

    // check if input with string are alpha and not empty

    const checkIfStringAndNotEmpty = (value: string): void => {
      if (
        validator.isEmpty(value, { ignore_whitespace: true }) ||
        typeof value !== "string"
      ) {
        res.status(400).send({ error: `Field must contains only characters` });
      }
    };

    const inputString: string[] = [username, email, city, password];
    inputString.forEach((value) => {
      if (value) checkIfStringAndNotEmpty(value);
    });

    // check enum in role
    if (
      role &&
      !validator.contains(
        role,
        "admin" || "admin_city" || "free_user" || "premium_user"
      )
    ) {
      res.status(400).send({ error: "User role does not exist" });
    }

    try {
      const currentUser = await dataSource
        .getRepository(User)
        .findOne({ where: { id: userId } });

      // check if profile exists in db
      const profileToUpdate = await dataSource
        .getRepository(User)
        .findOneBy({ id });
      if (profileToUpdate === null) {
        res.status(404).send({ error: "User not found" });
        return;
      }

      if (
        currentUser?.id !== profileToUpdate.id &&
        currentUser?.role !== UserRole.ADMIN
      ) {
        res
          .status(403)
          .send({ error: "You are not authorized to update this profile" });
        return;
      }

      // check if username already exist in db
      if (username) {
        const usernameAlreadyExist = await dataSource
          .getRepository(User)
          .count({ where: { username } });
        if (usernameAlreadyExist > 0) {
          res.status(409).send({ error: "Username already exists" });
        }
        if (
          !validator.matches(
            username,
            /^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]{3,20}$/
          )
        ) {
          res.status(401).send({
            error: "Username must contain 3 to 20 characters and no symbol",
          });
        }
      }

      // check if email already exist in db
      if (email) {
        const emailAlreadyExist = await dataSource
          .getRepository(User)
          .count({ where: { email } });
        if (emailAlreadyExist > 0) {
          res.status(409).send({ error: "Email already exists" });
        }
        if (!validator.isEmail(email)) {
          res.status(401).send({ error: "Incorrect email format" });
        }
      }

      // rename the new file and delete the older one
      if (req.file) {
        // rename
        const originalname = req.file.originalname;
        const filename = req.file.filename;
        const newName = `${uuidv4()}-${originalname}`;
        fs.rename(
          `./public/user/${filename}`,
          `./public/user/${newName}`,
          (err) => {
            if (err) throw err;
          }
        );
        req.body.image = `/public/user/${newName}`;

        // delete
        if (profileToUpdate.image !== null) {
          await unlink("." + profileToUpdate.image);
        }
      }

      await dataSource.getRepository(User).update(id, req.body);
      res.status(200).send("Updated user");
    } catch (err) {
      res.status(400).send({ error: "Error while updating user" });
    }
  },

  // DELETE PROFILE BY ID

  deleteProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, userId } = req.params;

      const currentUser = await dataSource
        .getRepository(User)
        .findOne({ where: { id: userId } });

      // check if profile exists in db
      const profileToDelete = await dataSource
        .getRepository(User)
        .findOneBy({ id });
      if (profileToDelete === null) {
        res.status(404).send({ error: "User not found" });
        return;
      }

      if (
        currentUser?.id !== profileToDelete.id &&
        currentUser?.role !== UserRole.ADMIN
      ) {
        res
          .status(403)
          .send({ error: "You are not authorized to delete this profile" });
        return;
      }
      await dataSource.getRepository(User).delete(id);

      // delete image in public directory
      if (profileToDelete.image !== null) {
        await unlink("." + profileToDelete.image);
      }

      res.status(200).send("Deleted user");
    } catch (err) {
      res.status(400).send({ error: "Error while deleting user" });
    }
  },

  // ADD POI TO FAVORITE ARRAY

  addFavoritePoiToUser: async (req: Request, res: Response): Promise<void> => {
    const { idUser, idPoi } = req.params;
    try {
      // check if profile exists in db
      const userToUpdate = await dataSource
        .getRepository(User)
        .findOneBy({ id: idUser });
      if (userToUpdate === null) {
        res.status(404).send({ error: "User not found" });
        return;
      }

      // check if POI exists in db
      const poiToAdd = await dataSource
        .getRepository(Poi)
        .findOneBy({ id: idPoi });
      if (poiToAdd === null) {
        res.status(404).send({ error: "Point of interest not found" });
        return;
      }

      // add POI to favourites array
      userToUpdate.favouritePoi = [...userToUpdate.favouritePoi, poiToAdd];
      await dataSource.getRepository(User).save(userToUpdate);
      res.status(200).send("Favorite poi added to user");
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ error: "Error while adding point of interest to favorites" });
    }
  },

  // REMOVE POI FROM FAVORITE ARRAY

  removeFavoritePoiToUser: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { idUser, idPoi } = req.params;
    try {
      // check if profile exists in db
      const userToUpdate = await dataSource
        .getRepository(User)
        .findOneBy({ id: idUser });
      if (userToUpdate === null) {
        res.status(404).send({ error: "User not found" });
        return;
      }

      // check if POI exists in db
      const poiToRemove = await dataSource
        .getRepository(Poi)
        .findOneBy({ id: idPoi });
      if (poiToRemove === null) {
        res.status(404).send({ error: "Point of interest not found" });
        return;
      }

      // filter favourites array to remove POI
      userToUpdate.favouritePoi = userToUpdate.favouritePoi.filter(
        (poi) => poi.id !== idPoi
      );
      await dataSource.getRepository(User).save(userToUpdate);
      res.status(200).send("Favorite poi remove to user");
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send({ error: "Error while removing point of interest to favorites" });
    }
  },

  // ADD CITY TO FAVORITE ARRAY

  addFavoriteCityToUser: async (req: Request, res: Response): Promise<void> => {
    const { idUser, idCity } = req.params;
    try {
      // check if user exists in db
      const userToUpdate = await dataSource
        .getRepository(User)
        .findOneBy({ id: idUser });
      if (userToUpdate === null) {
        res.status(404).send({ error: "User not found" });
        return;
      }

      // check if city exists in db
      const cityToAdd = await dataSource
        .getRepository(City)
        .findOneBy({ id: idCity });
      if (cityToAdd === null) {
        res.status(404).send({ error: "City not found" });
        return;
      }

      // add city to favourite array
      userToUpdate.favouriteCities = [
        ...userToUpdate.favouriteCities,
        cityToAdd,
      ];
      await dataSource.getRepository(User).save(userToUpdate);
      res.status(200).send("Favorite city added to user");
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: "Error while adding city to favorites" });
    }
  },

  // REMOVE CITY FROM FAVORITE ARRAY

  removeFavoriteCityToUser: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { idUser, idCity } = req.params;
    try {
      // check if user exists in db
      const userToUpdate = await dataSource
        .getRepository(User)
        .findOneBy({ id: idUser });
      if (userToUpdate === null) {
        res.status(404).send({ error: "User not found" });
        return;
      }

      // check if city exists in db
      const cityToRemove = await dataSource
        .getRepository(City)
        .findOneBy({ id: idCity });
      if (cityToRemove === null) {
        res.status(404).send({ error: "City not found" });
        return;
      }

      // filter favourites array to remove city
      userToUpdate.favouriteCities = userToUpdate.favouriteCities.filter(
        (poi) => poi.id !== idCity
      );
      await dataSource.getRepository(User).save(userToUpdate);
      res.status(200).send("Favorite city remove to user");
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: "Error while removing city to favorites" });
    }
  },
};
