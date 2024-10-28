import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Logout from './Logout'; 
import { auth } from '../../utils/firebase'; // Import the auth mock

// Mock the useNavigate hook from react-router-dom
const mockNavigate = jest.fn();
jest.mock('../Map/BuildingMap', () => () => <div>Mocked BuildingMap</div>);
jest.mock('../SideMenu/SideMenu', () => () => <div>Mocked SideMenu</div>);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock Firebase functions for auth and Firestore
jest.mock('../../utils/firebase', () => ({
  auth: {
    currentUser: { email: '2543080@students.wits.ac.za' },
    signOut: jest.fn(),
  },
  firestore: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

describe('Logout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  it('navigates to login page on clicking "Yes" button', async () => {
    render(
      <Router>
        <Logout />
      </Router>
    );

    // Click the "Yes" button
    fireEvent.click(screen.getByText('Yes'));

    // Wait for async operations and check expectations
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
    expect(sessionStorage.getItem('userData')).toBe(null);
    expect(sessionStorage.getItem('buildingsData')).toBe(null);
    expect(localStorage.getItem('eventsData')).toBe(null);
  });

  it('navigates to homepage on clicking "No" button', () => {
    render(
      <Router>
        <Logout />
      </Router>
    );

    // Click the "No" button
    fireEvent.click(screen.getByText('No'));

    // Check if navigate was called with "/Homepage"
    expect(mockNavigate).toHaveBeenCalledWith('/Homepage');
  });
});
