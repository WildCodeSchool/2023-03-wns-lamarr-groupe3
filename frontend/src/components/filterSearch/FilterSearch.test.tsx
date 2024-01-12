import FilterSearch from "./FilterSearch";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("FilterSearch", () => {
  const filterSearch = "";
  const setFilterSearch = jest.fn();

  it("should render", () => {
    render(
      <FilterSearch
        filterSearch={filterSearch}
        setFilterSearch={setFilterSearch}
      />
    );
  });

  it("should change value on change", () => {
    render(
      <FilterSearch
        filterSearch={filterSearch}
        setFilterSearch={setFilterSearch}
      />
    );

    const input = screen.getByPlaceholderText(
      /Rechercher une ville.../i
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Test" } });
    expect(setFilterSearch).toHaveBeenCalledTimes(1);
  });
});
