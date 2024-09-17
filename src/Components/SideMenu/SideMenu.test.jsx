import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import SideMenu from "./SideMenu";

// Mock the useNavigate hook from react-router-dom
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SideMenu Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('navigates to "/Homepage" when the Home button is clicked', () => {
    render(
      <Router>
        <SideMenu />
      </Router>
    );

    fireEvent.click(screen.getByText(/home/i)); // Simulate click on Home
    expect(mockNavigate).toHaveBeenCalledWith("/Homepage");
  });

  it('navigates to "/BusSchedule" when the Bus Schedule button is clicked', () => {
    render(
      <Router>
        <SideMenu />
      </Router>
    );

    fireEvent.click(screen.getByText(/bus schedule/i)); // Simulate click on Bus Schedule
    expect(mockNavigate).toHaveBeenCalledWith("/BusSchedule");
  });

  it('navigates to "/Rentals" when the Rentals button is clicked', () => {
    render(
      <Router>
        <SideMenu />
      </Router>
    );

    fireEvent.click(screen.getByText(/rentals/i)); // Simulate click on Rentals
    expect(mockNavigate).toHaveBeenCalledWith("/Rentals");
  });

  it('navigates to "/Logout" when the Logout button is clicked', () => {
    render(
      <Router>
        <SideMenu />
      </Router>
    );

    fireEvent.click(screen.getByText(/logout/i)); // Simulate click on Logout
    expect(mockNavigate).toHaveBeenCalledWith("/Logout");
  });
});
