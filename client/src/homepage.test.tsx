import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Homepage from './homepage';

it('shows error message when trying to show modal without phone number', () => {
    render(<Homepage />);
    const signupButton = screen.getByText('Sign Up');
    fireEvent.click(signupButton);
    const errorMessage = screen.getByText('Please enter a valid 10-digit phone number');
    console.log('Captured error message:', errorMessage.textContent);
    expect(errorMessage).toBeInTheDocument();
});

it('shows error message when trying to login without phone number', () => {
    render(<Homepage />);
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    const errorMessage = screen.getByText('Please enter a valid 10-digit phone number');
    expect(errorMessage).toBeInTheDocument();
});

it('shows modal when phone number is provided', () => {
    render(<Homepage />);
    const phoneInput = screen.getByPlaceholderText('Phone number');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    const signupButton = screen.getByTestId('homepage-signup-button');
    fireEvent.click(signupButton);

    expect(screen.queryByText('Please enter a phone number.')).not.toBeInTheDocument();
});

 it('it shows error when user enters a non 10 digit phonenumber', () => {
    render(<Homepage />);
    const phoneinput = screen.getByPlaceholderText('Phone number');
    fireEvent.change(phoneinput, { target: { value: '123456' } });
    const signupButton = screen.getByTestId('homepage-signup-button');
    fireEvent.click(signupButton);
    const errorMessage = screen.getByText('Please enter a valid 10-digit phone number');
    expect(errorMessage).toBeInTheDocument();
 });

 it('it shows error when user enters a non 10 digit phonenumber', () => {
    render(<Homepage />);
    const phoneinput = screen.getByPlaceholderText('Phone number');
    fireEvent.change(phoneinput, { target: { value: '123456' } });
    const loginButton = screen.getByTestId('homepage-login-button');
    fireEvent.click(loginButton);
    const errorMessage = screen.getByText("Please enter a valid 10-digit phone number");
    expect(errorMessage).toBeInTheDocument();
 });
 