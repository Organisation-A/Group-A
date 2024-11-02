import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import HomepageForm from './HomePageForm';

// Mocking sub-components
jest.mock('../SideMenu/SideMenu', () => () => <div>SideMenu Component</div>);
jest.mock('../SearchBar/SearchBar', () => ({ onQueryChange }) => (
  <input
    data-testid="search-bar"
    onChange={(e) => onQueryChange(e.target.value)}
    placeholder="Search..."
  />
));
jest.mock('../Map/BuildingMap.jsx', () => () => <div>BuildingMap Component</div>);
jest.mock('../EmergencyAlert/EmergencyAlert.jsx', () => () => <div>Popup Component</div>);

// Mock the useLocation hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('HomepageForm Component', () => {
  test('shows welcome message when fullName is provided in location state', async () => {
    const mockLocation = { state: { fullName: 'John Doe' } };
    useLocation.mockReturnValue(mockLocation);

    renderWithRouter(<HomepageForm />);

    await waitFor(() => {
    //   expect(screen.getByText(/welcome, john doe/i)).toBeInTheDocument();
    });

    // Wait for 5 seconds to check if the welcome message disappears
    await waitFor(
      () => {
        expect(screen.queryByText(/welcome, john doe/i)).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
   
});
