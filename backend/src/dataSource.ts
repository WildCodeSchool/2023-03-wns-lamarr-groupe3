import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Category } from "./entities/Category";
import { City } from "./entities/City";
import { Poi } from "./entities/Poi";

const dataSource = new DataSource({
	type: "postgres",
	host: "postgres",
	port: 5432,
	username: "postgres",
	password: "example",
	database: "postgres",

	synchronize: true,
	// dropSchema: true, utile pour réinitialiser la BDD à chaque relancement.

	entities: [User, Category, City, Poi],
});

export default dataSource;
