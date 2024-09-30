import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Profile from "./Profile";
import { sendPasswordResetEmail } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import { auth } from "../../utils/firebase";

// Mock Firebase auth and firestore functions
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((callback) => callback({ uid: "test-uid" })),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

// Mock child components that might be irrelevant to the test
jest.mock("../SideMenu/SideMenu", () => () => <div>SideMenu Component</div>);
jest.mock("../SearchBar/SearchBar", () => () => <div>SearchBar Component</div>);
jest.mock("../../BuildingMap", () => () => <div>BuildingMap Component</div>);

describe("Profile Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render profile card with default user info", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        kudu: 50,
      }),
    });

    render(
      <>
        <Profile />
        <ToastContainer />
      </>
    );

    // Check default user information is displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument(); // KuduBucks value
    expect(screen.getByText("Vehicles Available")).toBeInTheDocument();
  });

  it("should open the password reset form when 'Change password' is clicked", () => {
    render(<Profile />);

    fireEvent.click(screen.getByText("Change password"));

    // Check that the reset form is displayed
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(screen.getByText("Send Reset Email")).toBeInTheDocument();
  });

  it("should send a password reset email when reset form is submitted", async () => {
    render(
      <>
        <Profile />
        <ToastContainer />
      </>
    );

    fireEvent.click(screen.getByText("Change password"));
    fireEvent.click(screen.getByText("Send Reset Email"));

    expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, "John@gmail.com");
    expect(await screen.findByText("Password reset email sent! Check your inbox.")).toBeInTheDocument();
  });

  it("should display the cancel rental popup when 'Cancel Rental' is clicked", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        firstName: "John",
        lastName: "Doe",
        item: "Bike",
        location: "Park",
      }),
    });

    render(
      <>
        <Profile />
        <ToastContainer />
      </>
    );

    fireEvent.click(screen.getByText("Cancel Rental"));

    // Check that the popup is displayed
    expect(screen.getByText("Are you sure you want to cancel this item?")).toBeInTheDocument();
  });

  it("should close the popup when 'Close' button is clicked", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        firstName: "John",
        lastName: "Doe",
        item: "Bike",
        location: "Park",
      }),
    });

    render(
      <>
        <Profile />
        <ToastContainer />
      </>
    );

    fireEvent.click(screen.getByText("Cancel Rental"));
    fireEvent.click(screen.getByText("Close"));

    // Ensure popup is no longer visible
    expect(screen.queryByText("Are you sure you want to cancel this item?")).not.toBeInTheDocument();
  });
});
