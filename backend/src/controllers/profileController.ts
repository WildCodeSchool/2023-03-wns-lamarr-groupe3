import { Request, Response } from "express";
import dataSource from "../dataSource";
import { User } from "../entities/User";
import { Poi } from "../entities/Poi";
import { City } from "../entities/City";
import { IController } from "./user-controller";

export const ProfileController: IController = {
  // GET ALL PROFILES

  getProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const allProfiles = await dataSource.getRepository(User).find({
        relations: {
          createdPoi: true,
        },
      });
      res.status(200).send(allProfiles);
    } catch (err) {
      console.log(err);
      res.status(400).send("Error while reading users");
    }
  },

  // GET ONE PROFILE BY ID

  getOneProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      // check if profile exists in db
      const profileToRead = await dataSource
        .getRepository(User)
        .findOneBy({ id });
      if (profileToRead === null) {
        res.status(404).send("User not found");
      } else {
        res.status(200).send(profileToRead);
      }
    } catch (err) {
      res.status(400).send("Error while reading user");
    }
  },

  // UPDATE PROFILE BY ID

  updateProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      // check if profile exists in db
      const profileToUpdate = await dataSource
        .getRepository(User)
        .findOneBy({ id });
      if (profileToUpdate === null) {
        res.status(404).send("User not found");
      } else {
        await dataSource.getRepository(User).update(id, req.body);
        res.status(200).send("Updated user");
      }
    } catch (err) {
      res.status(400).send("Error while updating user");
    }
  },

  // DELETE PROFILE BY ID

  deleteProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      // check if profile exists in db
      const profileToDelete = await dataSource
        .getRepository(User)
        .findOneBy({ id });
      if (profileToDelete === null) {
        res.status(404).send("User not found");
      } else {
        await dataSource.getRepository(User).delete(id);
        res.status(200).send("Deleted user");
      }
    } catch (err) {
      res.status(400).send("Error while deleting user");
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
        res.status(404).send("User not found");
      } else {
        // check if POI exists in db
        const poiToAdd = await dataSource
          .getRepository(Poi)
          .findOneBy({ id: idPoi });
        if (poiToAdd === null) {
          res.status(404).send("Point of interest not found");
        } else {
          // add POI to favourites array
          userToUpdate.favouritePoi = [...userToUpdate.favouritePoi, poiToAdd];
          await dataSource.getRepository(User).save(userToUpdate);
          res.status(200).send("Favorite poi added to user");
        }
      }
    } catch (err) {
      console.log(err);
      res.status(400).send("Error while adding point of interest to favorites");
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
        res.status(404).send("User not found");
      } else {
        // check if POI exists in db
        const poiToRemove = await dataSource
          .getRepository(Poi)
          .findOneBy({ id: idPoi });
        if (poiToRemove === null) {
          res.status(404).send("Point of interest not found");
        } else {
          // filter favourites array to remove POI
          userToUpdate.favouritePoi = userToUpdate.favouritePoi.filter(
            (poi) => poi.id !== idPoi
          );
          await dataSource.getRepository(User).save(userToUpdate);
          res.status(200).send("Favorite poi remove to user");
        }
      }
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .send("Error while removing point of interest to favorites");
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
        res.status(404).send("User not found");
      } else {
        // check if city exists in db
        const cityToAdd = await dataSource
          .getRepository(City)
          .findOneBy({ id: idCity });
        if (cityToAdd === null) {
          res.status(404).send("City not found");
        } else {
          // add city to favourite array
          userToUpdate.favouriteCities = [
            ...userToUpdate.favouriteCities,
            cityToAdd,
          ];
          await dataSource.getRepository(User).save(userToUpdate);
          res.status(200).send("Favorite city added to user");
        }
      }
    } catch (err) {
      console.log(err);
      res.status(400).send("Error while adding city to favorites");
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
        res.status(404).send("User not found");
      } else {
        // check if city exists in db
        const cityToRemove = await dataSource
          .getRepository(City)
          .findOneBy({ id: idCity });
        if (cityToRemove === null) {
          res.status(404).send("City not found");
        } else {
          // filter favourites array to remove city
          userToUpdate.favouriteCities = userToUpdate.favouriteCities.filter(
            (poi) => poi.id !== idCity
          );
          await dataSource.getRepository(User).save(userToUpdate);
          res.status(200).send("Favorite city remove to user");
        }
      }
    } catch (err) {
      console.log(err);
      res.status(400).send("Error while removing city to favorites");
    }
  },
};
