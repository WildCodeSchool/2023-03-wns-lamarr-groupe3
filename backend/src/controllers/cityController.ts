import { Request, Response } from "express";
import dataSource from "../dataSource";
import { City } from "../entities/City";
import { Not } from "typeorm";
import { IController } from "./user-controller";
import fs from "fs";
import { unlink } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import { User, UserRole } from "../entities/User";

export const CityController: IController = {
  // GET ALL CITIES

  getCities: async (req: Request, res: Response): Promise<void> => {
    try {
      const allCities = await dataSource.getRepository(City).find({
        relations: {
          userAdminCity: true,
          poi: true,
        },
        select: {
          userAdminCity: {
            id: true,
            username: true,
            email: true,
            city: true,
            image: true,
            createdPoi: true,
          },
        },
      });
      res.status(200).send(allCities);
    } catch (err) {
      res.status(400).send({ error: "Error while reading cities" });
    }
  },

  // GET ONE CITY BY ID

  getOneCity: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const cityToRead = await dataSource.getRepository(City).findOne({
        where: { id },
        relations: {
          userAdminCity: true,
          poi: {
            category: true,
          },
        },
        select: {
          poi: true,
          userAdminCity: {
            id: true,
            username: true,
            email: true,
            city: true,
            image: true,
            createdPoi: true,
          },
        },
      });
      if (cityToRead === null) {
        res.status(404).send({ error: "City not found" });
      } else {
        res.status(200).send(cityToRead);
      }
    } catch (err) {
      res.status(400).send({ error: "Error while reading city" });
    }
  },

  // CREATE CITY

  createCity: async (req: Request, res: Response): Promise<void> => {
    const { name, coordinates, userAdminCity } = req.body;
    const { userId } = req.params;

    req.body.coordinates = [
      parseInt(req.body.coordinates.split(",")[0], 10),
      parseInt(req.body.coordinates.split(",")[1], 10),
    ];

    try {
      // Check if current user is admin
      const currentUser = await dataSource
        .getRepository(User)
        .findOne({ where: { id: userId } });

      if (currentUser?.role !== UserRole.ADMIN) {
        res.status(403).send({
          error: "You are not authorized to create a city",
        });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
        return;
      }

      // Get UserAdminCityId
      const currentUserAdminCity = await dataSource
        .getRepository(User)
        .findOne({
          where: { username: userAdminCity },
        });

      const currentUserAdminCityBody = {
        id: currentUserAdminCity?.id,
        username: currentUserAdminCity?.username,
        email: currentUserAdminCity?.email,
        password: currentUserAdminCity?.password,
        image: currentUserAdminCity?.image,
        role: UserRole.ADMIN_CITY,
        city: currentUserAdminCity?.city,
      };

      if (currentUserAdminCity === null) {
        res.status(403).send({
          error: "User admin city doesn't exist",
        });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
        return;
      }

      // check if name is alpha or not empty
      // isAlpha check if string because only letters
      if (
        !validator.matches(
          name,
          /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]{2,100}$/
        ) ||
        validator.isEmpty(name, { ignore_whitespace: true })
      ) {
        res.status(400).send({
          error: `Field must contains only characters (min: 2, max: 100)`,
        });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
        return;
      }

      // check if coordinates are type [number, number]

      if (
        req.body.coordinates !== null &&
        (req.body.coordinates.length > 2 ||
          (typeof req.body.coordinates[0] !== "number" &&
            typeof req.body.coordinates[1] !== "number"))
      ) {
        res.status(400).send({
          error: "Incorrect format of coordinates (must be [lat, long])",
        });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
        return;
      }

      // check if userAdminCity is UUID type -
      if (
        currentUserAdminCity !== null &&
        !validator.isUUID(currentUserAdminCity.id)
      ) {
        res.status(400).send({
          error: "Incorrect format of admin city id (must be uuid)",
        });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
        return;
      }

      // check if name doesn't already exist in db
      const nameAlreadyExist = await dataSource
        .getRepository(City)
        .count({ where: { name } });

      // check if coords doesn't already exist in db
      const coordsAlreadyExist = await dataSource.getRepository(City).count({
        where: {
          coordinates: {
            type: "Point",
            coordinates: [coordinates[0], coordinates[1]],
          },
        },
      });

      // if one or another exists, send 409
      if (nameAlreadyExist > 0 || coordsAlreadyExist > 0) {
        res.status(409).send({ error: "City already exists" });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
        return;
      }

      // rename file image

      if (req.file !== undefined) {
        const originalname = req.file.originalname;
        const filename = req.file.filename;
        const newName = `${uuidv4()}-${originalname}`;
        fs.rename(
          `./public/city/${filename}`,
          `./public/city/${newName}`,
          (err) => {
            if (err !== null) throw err;
          }
        );
        req.body.image = `/public/city/${newName}`;
      } else {
        res.status(400).send({ error: "An image is required" });
        return;
      }

      // format coordinates
      req.body.coordinates = {
        type: "Point",
        coordinates: [req.body.coordinates[0], req.body.coordinates[1]],
      };

      await dataSource
        .getRepository(City)
        .save({ ...req.body, userAdminCity: currentUserAdminCity });
      await dataSource
        .getRepository(User)
        .update(currentUserAdminCity.id, currentUserAdminCityBody);
      res.status(201).json("Created city");
    } catch (error: any) {
      // check if error is 'Key ("userAdminCityId")=(id) already exists'
      if (error.code === "23505") {
        res.status(409).send({
          error: "User is already administrator in another city",
        });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
      } else {
        res.status(400).send({ error: error.message });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
      }
    }
  },

  // UPDATE CITY BY ID

  updateCity: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const { name, image, coordinates, userAdminCity } = req.body;
    const { userId } = req.params;

    req.body.coordinates = [
      parseInt(req.body.coordinates.split(",")[0], 10),
      parseInt(req.body.coordinates.split(",")[1], 10),
    ];

    try {
      // Check if current user is admin
      const currentUser = await dataSource
        .getRepository(User)
        .findOne({ where: { id: userId } });

      if (currentUser?.role !== UserRole.ADMIN) {
        res.status(403).send({
          error: "You are not authorized to update a city",
        });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
        return;
      }

      // Get UserAdminCityId
      const currentUserAdminCity = await dataSource
        .getRepository(User)
        .findOne({
          where: { username: userAdminCity },
        });

      const currentUserAdminCityBody = {
        id: currentUserAdminCity?.id,
        username: currentUserAdminCity?.username,
        email: currentUserAdminCity?.email,
        password: currentUserAdminCity?.password,
        image: currentUserAdminCity?.image,
        role: currentUserAdminCity?.role,
        city: currentUserAdminCity?.city,
      };

      if (currentUserAdminCity !== null) {
        req.body.userAdminCity = currentUserAdminCity.id;
        currentUserAdminCityBody.role = UserRole.ADMIN_CITY;
      } else {
        res.status(403).send({
          error: "User admin city doesn't exist",
        });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
        return;
      }

      // check if name is alpha or not empty

      if (
        name !== null &&
        (!validator.matches(
          name,
          /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]{2,100}$/
        ) ||
          validator.isEmpty(name, { ignore_whitespace: true }))
      ) {
        res.status(400).send({
          error: `Field must contains only characters`,
        });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
        return;
      }

      // check if image is alpha or not empty

      if (
        image !== null &&
        typeof image === "string" &&
        validator.isEmpty(image)
      ) {
        res.status(400).send({
          error: `Field must contains only characters`,
        });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
        return;
      }

      // check if coordinates are type [number, number]
      if (
        req.body.coordinates !== null &&
        (req.body.coordinates.length > 2 ||
          (typeof req.body.coordinates[0] !== "number" &&
            typeof req.body.coordinates[1] !== "number"))
      ) {
        res.status(400).send({
          error: "Incorrect format of coordinates (must be [lat, long])",
        });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
        return;
      }

      // check if userAdminCity is UUID type

      if (
        req.body.userAdminCity !== null &&
        !validator.isUUID(req.body.userAdminCity)
      ) {
        res.status(400).send({
          error: "Incorrect format of admin city id (must be uuid)",
        });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
        return;
      }

      // check if city exists by id
      const cityToUpdate = await dataSource
        .getRepository(City)
        .findOneBy({ id });

      if (cityToUpdate === null) {
        res.status(404).send({ error: "City not found" });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
        return;
      }

      // check if body.name already exists in db

      let nameAlreadyExist = null;
      let coordsAlreadyExist = null;
      if (name !== undefined) {
        nameAlreadyExist = await dataSource
          .getRepository(City)
          // check every tuples except the one updating
          .count({ where: { name, id: Not(id) } });
        if (nameAlreadyExist > 0) {
          res.status(409).send({ error: "City already exists" });
          if (req.file !== undefined)
            await unlink(`./public/city/${req.file?.filename}`);
          return;
        }
      }

      // check if body.coordinates already exists in db
      if (coordinates !== undefined) {
        coordsAlreadyExist = await dataSource.getRepository(City).count({
          where: {
            coordinates: {
              type: "Point",
              coordinates: [req.body.coordinates[0], req.body.coordinates[1]],
            },
            id: Not(id),
          },
        });
        if (coordsAlreadyExist > 0) {
          res.status(409).send({ error: "City already exists" });
          if (req.file !== undefined)
            await unlink(`./public/city/${req.file?.filename}`);
          return;
        }
        // format coordinates
        req.body.coordinates = {
          type: "Point",
          coordinates: [req.body.coordinates[0], req.body.coordinates[1]],
        };
      }

      // if file, rename the new file and delete the old one
      if (req.file !== undefined) {
        // rename the new file
        const originalname = req.file.originalname;
        const filename = req.file.filename;
        const newName = `${uuidv4()}-${originalname}`;
        fs.rename(
          `./public/city/${filename}`,
          `./public/city/${newName}`,
          (err) => {
            if (err !== null) throw err;
          }
        );
        req.body.image = `/public/city/${newName}`;

        // delete the older file
        if (cityToUpdate.image?.includes("public/city")) {
          await unlink("." + cityToUpdate.image);
        }
      }

      await dataSource.getRepository(City).update(id, req.body);
      await dataSource
        .getRepository(User)
        .update(currentUserAdminCity.id, currentUserAdminCityBody);
      res.status(200).json("Updated city");
    } catch (error: any) {
      // check if error is 'Key ("userAdminCityId")=(id) already exists'
      if (error.code === "23505") {
        res.status(409).send({
          error: "User is already administrator in another city",
        });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
      } else {
        res.status(400).send({ error: error.message });
        if (req.file !== undefined)
          await unlink(`./public/city/${req.file?.filename}`);
      }
    }
  },

  // DELETE CITY

  deleteCity: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, userId } = req.params;

      // Check if current user is admin
      const currentUser = await dataSource
        .getRepository(User)
        .findOne({ where: { id: userId } });

      if (currentUser?.role !== UserRole.ADMIN) {
        res.status(403).send({
          error: "You are not authorized to delete a city",
        });

        return;
      }

      // check if city exists in db
      const cityToDelete = await dataSource.getRepository(City).findOne({
        where: { id },
        relations: { userAdminCity: true },
        select: {
          userAdminCity: {
            id: true,
          },
        },
      });

      if (cityToDelete === null) {
        res.status(404).send({ error: "City not found" });
        return;
      }

      // remove status admin to user
      const userAdminCity = await dataSource
        .getRepository(User)
        .findOne({ where: { id: cityToDelete.userAdminCity.id } });

      if (userAdminCity !== null) {
        delete (userAdminCity as any).favouritePoi;
        delete (userAdminCity as any).favouriteCities;
        userAdminCity.role = UserRole.FREE_USER;
        await dataSource.getRepository(City).delete(id);
        await dataSource
          .getRepository(User)
          .update(userAdminCity.id, userAdminCity);
      }

      if (
        cityToDelete.image !== null &&
        !cityToDelete.image.includes("loremflickr")
      ) {
        await unlink("." + cityToDelete.image);
      }
      res.status(200).send("Deleted city");
    } catch (err) {
      res.status(400).send({ error: "Error while deleting city" });
    }
  },
};
