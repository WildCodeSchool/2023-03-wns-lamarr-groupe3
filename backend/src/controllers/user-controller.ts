/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Request, Response } from "express";
import { User } from "../entities/User";
import dataSource from "../dataSource";
import * as bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { hash } from "bcrypt";
import validator from "validator";

const TOKEN = process.env.TOKEN;

// REGISTER

export interface IController {
  [key: string]: (arg0: Request, arg1: Response) => {};
}

export const AuthController: IController = {
  // REGISTER
  register: async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const checkIfEmpty = (key: string, value: string): boolean => {
      if (validator.isEmpty(value, { ignore_whitespace: true })) {
        res.status(422).send({ error: { [key]: "Ce champ est requis" } });
        return true;
      }
      return false;
    };

    try {
      const userToCreate = new User();
      userToCreate.email = email;
      userToCreate.password = password;
      userToCreate.username = username;

      // Check if one of fields is empty

      // On liste les clés de l'objet req.body.
      const inputs: string[] = ["email", "password", "username"];

      // On utilise la méthode some() pour vérifier s'il y a au moins une erreur.
      const someError: boolean = inputs.some((key) =>
        checkIfEmpty(key, req.body[key])
      );
      if (someError) return;

      const existingEmail = await dataSource
        .getRepository(User)
        .findOneBy({ email });

      // Check if email alrealy exists

      if (existingEmail !== null) {
        return res
          .status(409)
          .send({ error: { email: "Cet email est déjà utilisé" } });
      }

      // Check if username is already taken

      const existingUsername = await dataSource
        .getRepository(User)
        .findOneBy({ username });
      if (existingUsername !== null) {
        return res.status(409).send({
          error: { username: "Ce nom d'utilisateur est déjà utilisé" },
        });
      }

      if (!validator.isEmail(email)) {
        return res
          .status(401)
          .send({ error: { email: "Cet email est invalide" } });
      }

      if (
        !validator.matches(
          username,
          /^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]{3,20}$/
        )
      ) {
        return res.status(401).send({
          error: {
            username:
              "Le nom d'utilisateur doit contenir entre 3 et 20 caractères sans symboles",
          },
        });
      }

      if (
        !validator.isStrongPassword(password, {
          minLength: 8,
          minNumbers: 1,
          minUppercase: 1,
          minSymbols: 1,
        })
      ) {
        return res.status(401).send({
          error: {
            password:
              "Le mot de passe doit contenir au moins 8 caractères, 1 chiffre, une majuscule et 1 symbole",
          },
        });
      }
      const hashedPassword = await hash(password, 10);
      const newUser = { ...userToCreate, password: hashedPassword };
      await dataSource.getRepository(User).save(newUser);
      const token = sign(
        { userId: newUser.id, role: newUser.role },
        TOKEN as string,
        {
          expiresIn: "1h",
        }
      );
      res.cookie("jwt", token, { httpOnly: true });

      return res.status(201).send({ token });
    } catch (error) {
      console.log(error);
    }
  },

  // LOGIN

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      // retrieve user email
      const getUserByEmail = await dataSource
        .getRepository(User)
        .findOneBy({ email });

      // check if I don't have email
      if (getUserByEmail === null) {
        return res.status(400).send({ error: "Identifiants incorrects" });
      }

      const user = getUserByEmail;
      const validPassword = await bcrypt.compare(password, user.password);

      // check if I don't have the right password
      if (!validPassword) {
        return res.status(400).send({ error: "Identifiants incorrects" });
      } else {
        const token = sign(
          { userId: getUserByEmail.id, role: getUserByEmail.role },
          TOKEN as string,
          {
            expiresIn: "1h",
          }
        );
        res.cookie("jwt", token, { httpOnly: true });
        return res.status(201).send({ token });
      }
    } catch (error) {
      console.log(error);
    }
  },

  // LOGOUT
  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie("jwt");
      return res.status(200).json("Logged out");
    } catch (error) {
      return res.status(500).send({ error: "Error" });
    }
  },

  // NEW PASSWORD
  updatePassword: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { originalPassword, newPassword } = req.body;

    const checkIfNotEmpty = async (value: string): Promise<void> => {
      if (validator.isEmpty(value, { ignore_whitespace: true })) {
        res.status(400).send({
          error: `Field must not be empty`,
        });
      }
    };

    try {
      // On liste les clés de l'objet req.body.
      const inputs: string[] = [originalPassword, newPassword];

      inputs.forEach(async (value) => {
        if (value !== null) await checkIfNotEmpty(value);
      });

      if (
        !validator.isStrongPassword(originalPassword, {
          minLength: 8,
          minNumbers: 1,
          minUppercase: 1,
          minSymbols: 1,
        }) ||
        !validator.isStrongPassword(newPassword, {
          minLength: 8,
          minNumbers: 1,
          minUppercase: 1,
          minSymbols: 1,
        })
      ) {
        return res.status(401).send({
          error: {
            password:
              "Le mot de passe doit contenir au moins 8 caractères, 1 chiffre, une majuscule et 1 symbole",
          },
        });
      }

      // retrieve user by id
      const getUserById = await dataSource
        .getRepository(User)
        .findOneBy({ id });

      if (getUserById === null) {
        return res.status(404).send({ error: "Identifiants incorrects" });
      }

      const validPassword = await bcrypt.compare(
        originalPassword,
        getUserById.password
      );

      if (!validPassword) {
        return res
          .status(400)
          .send({ error: "Le mot de passe actuel est incorrect" });
      } else {
        const hashedPassword = await hash(newPassword, 10);
        const newUser = { ...getUserById, password: hashedPassword };
        await dataSource.getRepository(User).save(newUser);
        const token = sign(
          { userId: newUser.id, role: newUser.role },
          TOKEN as string,
          {
            expiresIn: "1h",
          }
        );
        res.cookie("jwt", token, { httpOnly: true });

        return res.status(201).send({ token });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
