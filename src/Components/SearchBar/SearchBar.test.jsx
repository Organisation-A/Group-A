import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  it('renders the search input', () => {
    render(<SearchBar />);
    const searchInput = screen.getByPlaceholderText('Search');
    expect(searchInput).toBeInTheDocument();
  });

  it('updates input value when typed into', () => {
    render(<SearchBar />);
    const searchInput = screen.getByPlaceholderText('Search');

    fireEvent.change(searchInput, { target: { value: 'test query' } });
    expect(searchInput.value).toBe('test query');
  });

  it('clears input when clear icon is clicked', () => {
    render(<SearchBar />);
    const searchInput = screen.getByPlaceholderText('Search');
    
    // Simulate typing into the search input
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    expect(searchInput.value).toBe('test query');

    // Simulate clicking the clear icon by class name
    const clearIcon = document.querySelector('.clear-icon');
    fireEvent.click(clearIcon);

    // Check if the input has been cleared
    expect(searchInput.value).toBe('');
  });

  it('calls handleSearch when the form is submitted', () => {
    render(<SearchBar />);
    const searchInput = screen.getByPlaceholderText('Search');
    
    // Mock the console.log function
    const consoleSpy = jest.spyOn(console, 'log');

    // Simulate typing and submitting the form
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    fireEvent.submit(searchInput);

    expect(consoleSpy).toHaveBeenCalledWith('Searching for:', 'test query');

    // Clean up the console spy
    consoleSpy.mockRestore();
  });
});
