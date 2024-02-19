import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Cities from "./../../../pages/administrator/Cities/Cities";
import { UserProvider } from "../../../../contexts/UserContext";
import { BrowserRouter } from "react-router-dom";

describe("when the user click on the added button", () => {
	it("should be open a modal", async () => {
		render(
			<BrowserRouter>
				<UserProvider>
					<Cities></Cities>
				</UserProvider>
			</BrowserRouter>
		);
		const buttonToAddedCity = screen.getByTestId("add-button");
		expect(buttonToAddedCity).toBeInTheDocument();

		fireEvent.click(buttonToAddedCity);
		await waitFor(() => {
			const modalAdmin = screen.getByTestId("modal-admin");
			expect(modalAdmin).toBeInTheDocument();
		});
	});
});

// describe("when the user click on the edited button", () => {
// 	it("should be open a modal", async () => {
// 		render(
// 			<BrowserRouter>
// 				<UserProvider>
// 					<Cities></Cities>
// 				</UserProvider>
// 			</BrowserRouter>
// 		);
// 		const buttonToModifiedCity = screen.getByTestId("1-modify-button");
// 		expect(buttonToModifiedCity).toBeInTheDocument();

// 		fireEvent.click(buttonToModifiedCity);
// 		await waitFor(() => {
// 			const modalAdmin = screen.getByTestId("modal-admin");
// 			expect(modalAdmin).toBeInTheDocument();
// 		});
// 		// await waitFor(() => buttonToModifiedCity, { timeout: 5000 });
// 	});
// });

// describe("button with icon", () => {
// 	it("should return a button with icon", () => {
// 		const onClick = jest.fn();
// 		const mockedIcon = faPen;
// 		render(
// 			<Button icon={mockedIcon} onClick={onClick} typeButton={"icon"}></Button>
// 		);
// 		const buttonIcon = screen.getByTestId("buttonIcon");
// 		expect(buttonIcon).toBeInTheDocument();
// 		expect(onClick).toHaveBeenCalledTimes(0);
// 	});
// });

// describe("button with text", () => {
// 	it("should return a button with text", () => {
// 		const onClick = jest.fn();

// 		render(
// 			<Button onClick={onClick} typeButton={"text"} dataTestId={"add"}></Button>
// 		);

// 		const buttonText = screen.getByTestId("add");
// 		expect(buttonText).toBeInTheDocument();
// 		expect(onClick).toHaveBeenCalledTimes(0);
// 	});
// });
