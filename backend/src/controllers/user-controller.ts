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
  register: async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const checkIfEmpty = (key: string, value: string): boolean => {
      if (validator.isEmpty(value, { ignore_whitespace: true })) {
        res.status(422).send({ errors: { [key]: "Ce champ est requis" } });
        return true;
      }
      return false;
    };

    try {
      let userToCreate = new User();
      userToCreate = { ...userToCreate, email, password, username };

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
          .send({ errors: { email: "Cet email est déjà utilisé" } });
      }

      // Check if username is already taken

      const existingUsername = await dataSource
        .getRepository(User)
        .findOneBy({ username });
      if (existingUsername !== null) {
        return res.status(409).send({
          errors: { username: "Ce nom d'utilisateur est déjà utilisé" },
        });
      }

      if (!validator.isEmail(email)) {
        return res
          .status(401)
          .send({ errors: { email: "Cet email est invalide" } });
      }

      if (
        !validator.matches(
          username,
          /^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]{3,20}$/
        )
      ) {
        return res.status(401).send({
          errors: {
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
          errors: {
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
        return res.status(404).send({ error: "Invalid credentials" });
      }

      const user = getUserByEmail;
      const validPassword = await bcrypt.compare(password, user.password);

      // check if I don't have the right password
      if (!validPassword) {
        return res.status(400).send({ error: "Invalid credentials" });
      } else {
        const token = sign(
          { userId: getUserByEmail.id, role: getUserByEmail.role },
          TOKEN as string,
          {
            expiresIn: "1h",
          }
        );
        res.cookie("jwt", token, { httpOnly: true });

        return res.status(200).send({ token });
      }
    } catch (error) {
      console.log(error);
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie("token");
      return res.status(200).send("Sucess");
    } catch (error) {
      return res.status(500).send({ error: "Error" });
    }
  },
};
