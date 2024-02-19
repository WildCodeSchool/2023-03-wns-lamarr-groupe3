import { render } from "@testing-library/react";
import Title from "./Title";
import { faCity } from "@fortawesome/free-solid-svg-icons";

describe("Title", () => {
	it("should render a Title with a text and icon", () => {
		const mockedTitle = {
			name: "Villes",
			icon: faCity,
		};
		render(<Title name={mockedTitle.name} icon={mockedTitle.icon}></Title>);
		expect(mockedTitle.name).toBe("Villes");
		expect(mockedTitle.icon).toBe(faCity);
	});
});

// const mockedTestTitle = [
// 	{ name: "Villes", icon: faCity },
// 	{ name: "Profil", icon: faUser },
// ];
// mockedTestTitle.forEach(({ name, icon }) => {
// 	it("should return a title with an icon", () => {
// 		render(<Title name={name} icon={icon}></Title>);
// 		expect(screen.getByText(name)).toBeInTheDocument();
// 		// expect(screen.getByText(icon.iconName)).toBeInTheDocument();
// 		const titleIcon = screen.getByTestId("title-icon");
// 		expect(titleIcon).toBeInTheDocument();
// 		// expect(titleIcon.classList.contains(`fa-${icon.iconName}`)).toBe(true);
// 	});
// });
