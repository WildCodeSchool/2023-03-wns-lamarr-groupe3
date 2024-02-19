// import { MessageController } from "./messageController";
// import { Message } from "../entities/Message";

// jest.mock("typeorm", () => ({
//     getRepository: jest.fn(() => ({
//       save: jest.fn().mockResolvedValue({
//         id: "some-id",
//         email: "toto@gmail.com",
//         title: "demande",
//         message: "Bonjour"
//       })
//     }))
//   }));

// Message.prototype.save = jest.fn().mockResolvedValue({
//     id: "some-id",
//     email: "toto@gmail.com",
//     title: "demande",
//     message: "Bonjour"
//   } as Message);
// describe("Message send", () => {
//     // const mockedMessage = {
//     //     email : "toto@gmail.com",
//     //     title : "demande",
//     //     message: "Bonjour"
//     // }
//     it("should create a new message", async () => {
//         const message = await MessageController.create("toto@gmail.com");
//         expect(message.email).toBe("toto@gmail.com"");
//     })
// })
