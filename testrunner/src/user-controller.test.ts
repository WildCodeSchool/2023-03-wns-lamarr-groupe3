import fetch from 'cross-fetch';
import { register } from './utils/register';

describe('user register', () => {
  describe('when a field is empty', () => {
    describe('when email is mising', () => {
      it('should return a code 422 and an error message with email as key', async () => {
        const res = await register({
          email: '',
          username: 'test',
          password: 'Test123!',
        });
        const data = await res.json();
        expect(res.status).toEqual(422);
        expect(data.errors).toBeDefined();
        expect(data.errors.email).toBe('Ce champ est requis');
      });
    });

    describe('when username is missing', () => {
      it('should return a code 422 and an error message with username as key', async () => {
        const res = await register({
          username: '',
          email: 'email@test.fr',
          password: 'Test123!',
        });
        const data = await res.json();
        expect(res.status).toEqual(422);
        expect(data.errors).toBeDefined();
        expect(data.errors.username).toBe('Ce champ est requis');
      });
    });

    describe('when password is missing', () => {
      it('should return a code 422 and an error message with password as key', async () => {
        const res = await register({
          password: '',
          username: 'test',
          email: 'email@test.fr',
        });
        const data = await res.json();
        expect(res.status).toEqual(422);
        expect(data.errors).toBeDefined();
        expect(data.errors.password).toBe('Ce champ est requis');
      });
    });
  });

  describe('when email is not valid', () => {
    it('should return a code 401 and an error message', async () => {
      const res = await register({
        email: 'email@',
        username: 'test1',
        password: 'Test123!',
      });
      const data = await res.json();
      expect(res.status).toEqual(401);
      expect(data.errors).toBeDefined();
      expect(data.errors.email).toBe('Cet email est invalide');
    });
  });

  describe('when username is not valid', () => {
    describe('when username is too short', () => {
      it('should return a code 401 and an error message', async () => {
        const res = await register({
          email: 'email1@test.fr',
          username: 't',
          password: 'Test123!',
        });
        const data = await res.json();
        expect(res.status).toEqual(401);
        expect(data.errors).toBeDefined();
        expect(data.errors.username).toBe(
          "Le nom d'utilisateur doit contenir entre 3 et 20 caractères sans symboles"
        );
      });
    });

    describe('when username is too long', () => {
      it('should return a code 401 and an error message', async () => {
        const res = await register({
          email: 'email1@test.fr',
          username:
            'ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
          password: 'Test123!',
        });
        const data = await res.json();
        expect(res.status).toEqual(401);
        expect(data.errors).toBeDefined();
        expect(data.errors.username).toBe(
          "Le nom d'utilisateur doit contenir entre 3 et 20 caractères sans symboles"
        );
      });
    });

    describe('when username contains a symbol', () => {
      it('should return a code 401 and an error message', async () => {
        const res = await register({
          email: 'email1@test.fr',
          username: 'test!66',
          password: 'Test123!',
        });
        const data = await res.json();
        expect(res.status).toEqual(401);
        expect(data.errors).toBeDefined();
        expect(data.errors.username).toBe(
          "Le nom d'utilisateur doit contenir entre 3 et 20 caractères sans symboles"
        );
      });
    });
  });

  describe('when all fields are correct', () => {
    it('should return a code 201 and a token', async () => {
      const res = await register({
        email: 'email2@test.fr',
        username: 'test2',
        password: 'Test123!',
      });
      const data = await res.json();
      expect(res.status).toEqual(201);
      expect(data.token).toMatch(/^[\w-]*\.[\w-]*\.[\w-]*$/);
    });
  });
});
