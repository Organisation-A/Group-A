import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Popup from './EmergencyAlert';

global.fetch = jest.fn();

describe('Popup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays the popup with alert message using forceShowPopup', async () => {
    render(<Popup forceShowPopup />);

    // Check that the heading with "Emergency Alert" is displayed
    expect(screen.getByRole('heading', { name: /emergency alert/i })).toBeInTheDocument();
    // Check for the test alert message
    expect(screen.getByText(/this is a test alert/i)).toBeInTheDocument();
  });

  test('displays an error message if fetching alert fails', async () => {
    render(<Popup forceShowPopup forceError />);

    // Check that the heading with "Emergency Alert" is displayed
    expect(screen.getByRole('heading', { name: /emergency alert/i })).toBeInTheDocument();
    // Check for the error message
    expect(screen.getByText(/error fetching emergency alerts/i)).toBeInTheDocument();
  });

  test('closes the popup when the close button is clicked', async () => {
    render(<Popup forceShowPopup />);

    // Confirm the popup is displayed
    expect(screen.getByRole('heading', { name: /emergency alert/i })).toBeInTheDocument();

    // Click the close button
    fireEvent.click(screen.getByText('×'));

    // Confirm the popup is no longer in the document
    expect(screen.queryByRole('heading', { name: /emergency alert/i })).not.toBeInTheDocument();
  });
});
 