// import { faker } from "@faker-js/faker";
// import dataSourceTest from "../dataSourceTest";
// import { User } from "../entities/User";

// describe("user-controler", () => {
// 	// beforeALL appliquer de la laogique avant le bloc d'execution du test
// 	// la fonction de callback dans le beforeAll va s'executer avant le lancement du user-controller
// 	beforeAll(async () => {
// 		await dataSourceTest.initialize();
// 	});
// });

// describe("register", () => {
// 	// Adresse mail libre => gnerer une erreur si l'adresse email est deja utilise
// 	it("throw an error, whend adress mail is already used", async () => {
// 		const email = faker.internet.email();
// 		const password = faker.internet.password();
// 		await User.create({ email, password }).save();
// 	});
// 	// retourner un token a l'issu d'une inscription reussie
// 	// verifier que le user a bien ete crée
// });

// // creer un test qui fait appel au controlleur
