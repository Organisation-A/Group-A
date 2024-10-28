import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import BuildingMap from './BuildingMap';
import { auth } from '../../utils/firebase';
import { Loader } from "@googlemaps/js-api-loader";

jest.mock("@googlemaps/js-api-loader", () => ({
  Loader: jest.fn().mockImplementation(() => ({
    load: jest.fn().mockResolvedValue({
      maps: {
        DirectionsService: jest.fn(),
        DirectionsRenderer: jest.fn(),
        Map: jest.fn(),
      },
    }),
  })),
}));


jest.mock('firebase/auth', () => {
  const originalModule = jest.requireActual('firebase/auth');
  return {
    ...originalModule,
    auth: {
      onAuthStateChanged: jest.fn((callback) => {
        callback(null); // You can pass a mock user object if needed
        return () => {}; // Return an empty function as the unsubscribe mock
      }),
    },
  };
});

describe('BuildingMap Component', () => {
  it('renders the BuildingMap component', async () => {
    render(
      <Router>
        <BuildingMap />
      </Router>
    );

    await waitFor(() => expect(screen.getByText(/Recenter Map/i)).toBeInTheDocument());
  });
});
