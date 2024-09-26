import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';
import { BrowserRouter } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';

// Mock Firebase functions
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
}));


//simulate real browser for useNavigation() so that it seems like an actual browser I get
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('LoginForm Component', () => {
    //chck that the rendering is correct
  test('renders the login form', () => {
    renderWithRouter(<LoginForm />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const signInButton = screen.getByText(/sign in/i);
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();
  });

  test('allows user to toggle password visibility', () => {
    renderWithRouter(<LoginForm />);
  
    const passwordInput = screen.getByPlaceholderText(/password/i);
    
    // Query the toggle icon by data-testid
    const toggleIcon = screen.getByTestId('show-password-icon');
  
    // Initially, the password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
  
    // Click the toggle icon to show the password
    fireEvent.click(toggleIcon);
  
    // After clicking, the password should be visible
    expect(passwordInput).toHaveAttribute('type', 'text');
  
    // Check the icon has switched to "hide password"
    const hidePasswordIcon = screen.getByTestId('hide-password-icon');
    expect(hidePasswordIcon).toBeInTheDocument();
  });
  
  

  test('displays error when login credentials are invalid', async () => {
    // Mock a rejected login attempt
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Invalid credentials'));

    renderWithRouter(
      <>
        <LoginForm />
        <ToastContainer />
      </>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'invalid@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByText(/sign in/i));

    // Wait for the error toast to appear
    const errorToast = await screen.findByText(/invalid credentials/i);
    expect(errorToast).toBeInTheDocument();
  });
});

