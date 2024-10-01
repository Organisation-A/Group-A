import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import BusSchedule from './BusSchedule';
import { getFirestore, getDocs, collection } from "firebase/firestore";

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({
    docs: [
      {
        id: '1',
        data: () => ({
          routeName: 'Full Circuit',
          days: ['Monday', 'Tuesday'],
          schedule: ['08:00', '09:00'],
          stops: ['Stop 1', 'Stop 2'],
        }),
      },
    ],
  }),
}));

const renderComponent = () => {
  return render(
    <Router>
      <BusSchedule />
    </Router>
  );
};

describe('BusSchedule Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Bus Schedule component', async () => {
    renderComponent();
    
    // Use getAllByText() to prevent multiple elements error
    const scheduleElements = await screen.findAllByText(/Bus Schedule/i);
    expect(scheduleElements.length).toBeGreaterThan(0);

    // Check if filter buttons are rendered
    const allButton = await screen.findByText(/ALL/i);
    expect(allButton).toBeInTheDocument();

    const fullCircuitButton = await screen.findByText(/Full Circuit/i);
    expect(fullCircuitButton).toBeInTheDocument();
  });

  test('filters bus routes correctly', async () => {
    renderComponent();

    // Click the filter button for "Full Circuit"
    const fullCircuitButton = await screen.findByText(/Full Circuit/i);
    fireEvent.click(fullCircuitButton);

    // Check if the filtered route is displayed
    const routeName = await screen.findByText(/Full Circuit/i);
    expect(routeName).toBeInTheDocument();
  });

  test('toggles filter buttons', async () => {
    renderComponent();

    // Click "Full Circuit" filter
    const fullCircuitButton = await screen.findByText(/Full Circuit/i);
    fireEvent.click(fullCircuitButton);

    expect(fullCircuitButton).toHaveStyle('background-color: green');

    // Click again to unselect
    fireEvent.click(fullCircuitButton);
    expect(fullCircuitButton).not.toHaveStyle('background-color: green');
  });

  test('shows "No more buses available today" when no upcoming buses', async () => {
    renderComponent();

    // Assuming no schedules match the current time/day
    const noBusesText = await screen.findByText(/No more buses available today/i);
    expect(noBusesText).toBeInTheDocument();
  });
});
