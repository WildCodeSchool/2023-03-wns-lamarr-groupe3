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

describe("when the user click on the edited button", () => {
	it("should be open a modal", async () => {
		render(
			<BrowserRouter>
				<UserProvider>
					<Cities></Cities>
				</UserProvider>
			</BrowserRouter>
		);
		setTimeout(async () => {
			const buttonToModifiedCity = screen.getByTestId("1-modify-button");
			expect(buttonToModifiedCity).toBeInTheDocument();

			fireEvent.click(buttonToModifiedCity);
			await waitFor(() => {
				const modalAdmin = screen.getByTestId("modal-admin");
				expect(modalAdmin).toBeInTheDocument();
			});
		}, 1000);
	});
});
// seTimeout solution non optimum
// isoler le test du back et mocker les données
// mocker le fecth getCities et je retourne une liste de ville => isoler les parties à tester,
// elles ne dependent plus de mon environnement
