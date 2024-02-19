import { Request, Response } from "express";
import dataSource from "../dataSource";
import { Poi } from "../entities/Poi";
import { Not } from "typeorm";
import { IController } from "./user-controller";
import fs from "fs";
import { unlink } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import { User, UserRole } from "../entities/User";
import { City } from "../entities/City";

export const PoiController: IController = {
	// GET ALL POI

	getPoi: async (req: Request, res: Response): Promise<void> => {
		try {
			let searchQueries = {};

			// if query in url, add finding options
			if (Object.keys(req.query).length > 0) {
				const city = req.query.city as string;
				const category = req.query.category as string;
				console.log("city", city);
				console.log("category", category);

				if (city !== undefined && category !== undefined) {
					searchQueries = {
						category: { name: category },
						city: { name: city },
					};
				} else if (city !== undefined) {
					searchQueries = { city: { name: city } };
				} else if (category !== undefined) {
					searchQueries = { category: { name: category } };
				}
			}

			// get poi is accepted or no depending of user status (admin or not)
			const { userId } = req.params;

			const currentUser = await dataSource
				.getRepository(User)
				.findOne({ where: { id: userId } });

			let allPoi;
			if (currentUser?.role === UserRole.ADMIN) {
				// get all poi (accepted or not)
				allPoi = await dataSource.getRepository(Poi).find({
					relations: {
						category: true,
						city: true,
						user: true,
					},
					where: searchQueries,
				});
			} else if (currentUser?.role === UserRole.ADMIN_CITY) {
				// get the city name where user is admin to get only local POIs
				const cityWhereUserIsAdmin = await dataSource
					.getRepository(City)
					.findOneBy({ userAdminCity: { id: userId } });
				// update searchQueries with the city where user is admin
				searchQueries = {
					...searchQueries,
					city: cityWhereUserIsAdmin?.name,
					// city: { name: cityWhereUserIsAdmin?.name },
				};
				console.log("searchQueries", searchQueries);

				allPoi = await dataSource.getRepository(Poi).find({
					relations: {
						category: true,
						city: true,
						user: true,
					},
					where: searchQueries,
				});
				console.log("allPoi", allPoi);
			} else {
				// get only accepted poi
				allPoi = await dataSource.getRepository(Poi).find({
					relations: {
						category: true,
						city: true,
						user: true,
					},
					where: { ...searchQueries, isAccepted: true },
				});
				res.status(200).send(allPoi);
			}
		} catch (err) {
			console.log("err getPoi", err);

			res.status(400).send({
				error: "Error while reading points of interest",
			});
		}
	},

	// GET ONE POI BY ID

	getOnePoi: async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;
			const poiToRead = await dataSource.getRepository(Poi).findOneBy({ id });
			if (poiToRead === null) {
				res.status(404).send({ error: "Point of interest not found" });
			} else {
				res.status(200).send(poiToRead);
			}
		} catch (err) {
			res.status(400).send({
				error: "Error while reading point of interest",
			});
		}
	},

	// CREATE POI

	createPoi: async (req: Request, res: Response): Promise<void> => {
		try {
			const { userId } = req.params;
			// add user id in body
			req.body.user = userId;

			const {
				description,
				address,
				phoneNumber,
				name,
				image,
				category,
				city,
				user,
				coordinates,
			} = req.body;

			const cityOfPoi = await dataSource.getRepository(City).findOne({
				where: { id: city },
				relations: {
					userAdminCity: true,
				},
			});

			const currentUser = await dataSource
				.getRepository(User)
				.findOne({ where: { id: userId } });

			if (
				cityOfPoi?.userAdminCity?.id !== userId &&
				currentUser?.role !== UserRole.ADMIN &&
				currentUser?.role !== UserRole.ADMIN_CITY
			) {
				req.body.isAccepted = false;
			} else {
				req.body.isAccepted = true;
			}

			// check if input with string are alpha and not empty

			const checkIfStringAndNotEmpty = async (value: string): Promise<void> => {
				if (
					validator.isEmpty(value, { ignore_whitespace: true }) ||
					typeof value !== "string"
				) {
					res.status(400).send({
						error: `Field must contains only characters`,
					});
					if (req.file !== undefined)
						await unlink(`./public/poi/${req.file?.filename}`);
				}
			};

			const inputString: string[] = [description, name, address];
			inputString.forEach(
				async (value) => await checkIfStringAndNotEmpty(value)
			);

			// check name

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
					await unlink(`./public/poi/${req.file.filename}`);
				return;
			}

			// check address

			if (
				!validator.matches(
					address,
					/^(([\u00c0-\u01ffa-zA-Z\d])+(?:['-\s][\u00c0-\u01ffa-zA-Z]+)*\s)+((\d{5})*\s)([\u00c0-\u01ffa-zA-Z])+(?:['-\s][\u00c0-\u01ffa-zA-Z]+)*\s*$/
				)
			) {
				res.status(400).send({
					error: `Incorrect format of address`,
				});
				if (req.file !== undefined)
					await unlink(`./public/poi/${req.file.filename}`);
				return;
			}

			// check phone number

			if (!validator.isNumeric(phoneNumber)) {
				res.status(400).send({ error: "Incorrect format of phone number" });
			}

			// check if foreign key are uuid type

			const checkIfUUID = async (value: string): Promise<void> => {
				if (!validator.isUUID(value)) {
					res.status(400).send({
						error: "Incorrect format of foreign key (must be uuid)",
					});
					if (req.file !== undefined)
						await unlink(`./public/poi/${req.file?.filename}`);
				}
			};
			const foreignKeys: string[] = [category, city, user];
			foreignKeys.forEach(async (value) => {
				if (value !== undefined) await checkIfUUID(value);
			});

			// check if image is an object

			if (image !== undefined && typeof image !== "object") {
				res.status(400).send({
					error: `Field image must contains a file`,
				});
				if (req.file !== undefined)
					await unlink(`./public/poi/${req.file.filename}`);
				return;
			}

			// format coordinates
			const latitude = req.body.coordinates.split(",")[0];
			const longitude = req.body.coordinates.split(",")[1];
			req.body.coordinates = {
				type: "Point",
				coordinates: [parseFloat(latitude), parseFloat(longitude)],
			};

			// check coordinates format
			if (req.body.coordinates.length > 2) {
				res.status(400).send({
					error: "Incorrect format of coordinates (must be [lat, long])",
				});
				if (req.file !== undefined)
					await unlink(`./public/poi/${req.file.filename}`);
				return;
			}

			// check if coords doesn't already exist in db
			const coordsAlreadyExist = await dataSource.getRepository(Poi).count({
				where: {
					coordinates: {
						type: "Point",
						coordinates: [coordinates[0], coordinates[1]],
					},
				},
			});
			if (coordsAlreadyExist > 0) {
				res.status(409).send({ error: "Point of interest already exists" });
				if (req.file !== undefined)
					await unlink(`./public/poi/${req.file.filename}`);
				return;
			}

			// rename file image
			if (req.file !== undefined) {
				const originalname = req.file.originalname;
				const filename = req.file.filename;
				const newName = `${uuidv4()}-${originalname}`;
				fs.rename(
					`./public/poi/${filename}`,
					`./public/poi/${newName}`,
					(err) => {
						if (err !== null) throw err;
					}
				);
				req.body.image = `/public/poi/${newName}`;
			} else {
				res.status(400).send({ error: "An image is required" });
				return;
			}

			await dataSource.getRepository(Poi).save(req.body);
			res.status(201).send("Created point of interest");
		} catch (err) {
			res.status(400).send({ error: "Something went wrong" });
			console.log({ err });
			if (req.file !== undefined)
				await unlink(`./public/poi/${req.file.filename}`);
		}
	},

	// UPDATE POI BY ID

	updatePoi: async (req: Request, res: Response): Promise<void> => {
		try {
			const {
				description,
				address,
				phoneNumber,
				isAccepted,
				name,
				category,
				city,
				user,
				coordinates,
			} = req.body;

			const { id } = req.params;

			// check if input with string are alpha and not empty

			const checkIfStringAndNotEmpty = async (value: string): Promise<void> => {
				if (
					validator.isEmpty(value, { ignore_whitespace: true }) ||
					typeof value !== "string"
				) {
					res.status(400).send({
						error: `Field must contains only characters`,
					});
					if (req.file !== undefined)
						await unlink(`./public/poi/${req.file.filename}`);
				}
			};

			const inputString: string[] = [description, name, address];
			inputString.forEach(async (value) => {
				if (value !== undefined) await checkIfStringAndNotEmpty(value);
			});

			// check coordinates format
			if (coordinates.length > 2) {
				res.status(400).send({
					error: "Incorrect format of coordinates (must be [lat, long])",
				});
				if (req.file !== undefined)
					await unlink(`./public/poi/${req.file.filename}`);

				return;
			}

			// check name
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
					await unlink(`./public/poi/${req.file.filename}`);
				return;
			}

			// check address

			if (
				address !== null &&
				!validator.matches(
					address,
					/^(([\u00c0-\u01ffa-zA-Z\d])+(?:['-\s][\u00c0-\u01ffa-zA-Z]+)*\s)+((\d{5})*\s)([\u00c0-\u01ffa-zA-Z])+(?:['-\s][\u00c0-\u01ffa-zA-Z]+)*\s*$/
				)
			) {
				res.status(400).send({
					error: `Incorrect format of address`,
				});
				if (req.file !== undefined)
					await unlink(`./public/poi/${req.file.filename}`);

				return;
			}

			// check phone number

			if (!validator.isNumeric(phoneNumber)) {
				res.status(400).send({ error: "Incorrect format of phone number" });
				if (req.file !== undefined)
					await unlink(`./public/poi/${req.file.filename}`);
				return;
			}

			// check if foreign key are uuid type

			const checkIfUUID = async (value: string): Promise<void> => {
				if (!validator.isUUID(value)) {
					res.status(400).send({
						error: "Incorrect format of foreign key (must be uuid)",
					});
					if (req.file !== undefined)
						await unlink(`./public/poi/${req.file?.filename}`);
				}
			};

			const foreignKeys: string[] = [category, city, user];
			foreignKeys.forEach(async (value) => {
				if (value !== undefined) await checkIfUUID(value);
			});

			// check if is_accepted is boolean

			if (isAccepted !== null && typeof isAccepted !== "boolean") {
				res.status(400).send({ error: "is_accepted must be a boolean" });
				if (req.file !== undefined)
					await unlink(`./public/poi/${req.file.filename}`);
				return;
			}

			// check if POI exists in db
			const poiToUpdate = await dataSource.getRepository(Poi).findOneBy({ id });
			if (poiToUpdate === null) {
				res.status(404).send({ error: "Point of interest not found" });
				if (req.file !== undefined)
					await unlink(`./public/poi/${req.file.filename}`);
				return;
			}

			// check if user is admin
			const { userId } = req.params;

			const cityOfPoi = await dataSource.getRepository(City).findOne({
				where: { id: city },
				relations: {
					userAdminCity: true,
				},
			});

			const currentUser = await dataSource
				.getRepository(User)
				.findOne({ where: { id: userId } });

			if (
				cityOfPoi?.userAdminCity.id !== userId ||
				currentUser?.role !== UserRole.ADMIN
			) {
				res.status(403).send({
					error: "You are not authorized to create a point of interest",
				});
				if (req.file !== undefined)
					await unlink(`./public/poi/${req.file.filename}`);
				return;
			}

			// check if body.coords already exists in db
			if (coordinates !== undefined) {
				const coordsAlreadyExist = await dataSource.getRepository(Poi).count({
					where: {
						coordinates: {
							type: "Point",
							coordinates: [coordinates[0], coordinates[1]],
						},
						id: Not(id),
					},
				});
				if (coordsAlreadyExist > 0) {
					res.status(404).send({
						error: "Point of interest already exist",
					});
					if (req.file !== undefined)
						await unlink(`./public/poi/${req.file.filename}`);
					return;
				}

				// format coordinates
				req.body.coordinates = {
					type: "Point",
					coordinates: [coordinates[0], coordinates[1]],
				};
			}

			// rename the new file and delete the older one
			if (req.file !== undefined) {
				// rename
				const originalname = req.file.originalname;
				const filename = req.file.filename;
				const newName = `${uuidv4()}-${originalname}`;
				fs.rename(
					`./public/poi/${filename}`,
					`./public/poi/${newName}`,
					(err) => {
						if (err !== null) throw err;
					}
				);
				req.body.image = `/public/poi/${newName}`;
				// delete
				if (poiToUpdate.image !== null) {
					await unlink("." + poiToUpdate.image);
				}
			} else {
				res.status(400).send({ error: "An image is required" });
				return;
			}

			await dataSource.getRepository(Poi).update(id, req.body);
			res.status(200).send("Updated point of interest");
		} catch (err) {
			res.status(400).send({
				error: "Error while updating point of interest",
			});
			if (req.file !== undefined)
				await unlink(`./public/poi/${req.file.filename}`);
		}
	},

	// DELETE POI

	deletePoi: async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params;

			// check if POI exists in db
			const poiToDelete = await dataSource.getRepository(Poi).findOneBy({ id });
			if (poiToDelete === null) {
				res.status(404).send({ error: "Point of interest not found" });
				return;
			}

			// check if user is admin
			const { userId } = req.params;

			const cityOfPoi = await dataSource
				.getRepository(City)
				.findOne({ where: { id: poiToDelete.city.id } });

			const currentUser = await dataSource
				.getRepository(User)
				.findOne({ where: { id: userId } });

			if (
				cityOfPoi?.userAdminCity.id !== userId ||
				currentUser?.role !== UserRole.ADMIN
			) {
				res.status(403).send({
					error: "You are not authorized to delete a point of interest",
				});
			}

			await dataSource.getRepository(Poi).delete(id);

			// delete image in public directory
			if (poiToDelete.image !== null) {
				await unlink("." + poiToDelete.image);
			}

			res.status(200).send("Deleted point of interest");
		} catch (err: any) {
			res.status(400).send({ error: err.message });
		}
	},
};
