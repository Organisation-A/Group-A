import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Profile from "./Profile";
import { BrowserRouter as Router } from "react-router-dom";
import { auth } from "../../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "@testing-library/jest-dom/extend-expect";

jest.mock("../../utils/firebase", () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
  },
  firestore: {},
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

describe("Profile Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders profile information", async () => {
    // Mock the onAuthStateChanged
    const userMock = {
      uid: "testUserId",
      email: "test@example.com",
    };

    auth.onAuthStateChanged.mockImplementationOnce((callback) => callback(userMock));

    // Mock Firestore functions
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        email: "test@example.com",
        kudu: 50,
        firstName: "John",
        lastName: "Doe",
      }),
    });

    render(
      <Router>
        <Profile />
      </Router>
    );

    // Wait for user data to be rendered
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    });
  });

  test("allows password reset", async () => {
    render(
      <Router>
        <Profile />
      </Router>
    );

    // Click on "Change password" link
    fireEvent.click(screen.getByText(/Change password/i));

    // Check if the reset password form is displayed
    expect(screen.getByText(/A reset link will be sent to your email:/i)).toBeInTheDocument();

    // Submit the reset password form
    fireEvent.click(screen.getByText(/Send Reset Email/i));

    // Wait for success toast to appear (mock the toast functionality if needed)
    await waitFor(() => {
      expect(screen.getByText(/Password reset email sent! Check your inbox./i)).toBeInTheDocument();
    });
  });

  test("renders KuduBucks with correct color", async () => {
    const userMock = {
      uid: "testUserId",
      email: "test@example.com",
    };

    auth.onAuthStateChanged.mockImplementationOnce((callback) => callback(userMock));

    // Mock Firestore functions
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        email: "test@example.com",
        kudu: 50,
        firstName: "John",
        lastName: "Doe",
      }),
    });

    render(
      <Router>
        <Profile />
      </Router>
    );

    // Wait for KuduBucks value to be rendered and check color
    await waitFor(() => {
      const kuduElement = screen.getByText(/50/i);
      expect(kuduElement).toHaveStyle({ color: "rgb(195, 255, 0)" });
    });
  });
});
