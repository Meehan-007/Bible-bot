import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Homepage from '../homepage';
import SignUp from './signUp';



it('allows me to toggle the values of old and new testament', () => {
    render(<SignUp phone="1234567890" />);
    const oldTestamentCheckbox = screen.getByTestId('old testament only');
    fireEvent.click(oldTestamentCheckbox);
    const newTestamentCheckbox = screen.getByTestId('new testament only');
    fireEvent.click(newTestamentCheckbox); // You'll need to add data-testid to your component
    expect(newTestamentCheckbox).toBeChecked();
})
//  it("when the number is not original will fire an error", () => {
//     render(<SignUp phone="1234567890" />);
//     const createAccountButton = screen.getByText('create account');
//     fireEvent.click(createAccountButton);
//     const errorMessage = screen.getByText('Please enter a unique phone number');
//     expect(errorMessage).toBeInTheDocument();
//  })

it("shows error when phone number is not unique", async () => {
    // Mock fetch to return error
    global.fetch = jest.fn(() => 
        Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ error: 'Phone number already exists' })
        } as Response)
    );

    render(<SignUp phone="1234567890" />);
    const createAccountButton = screen.getByText('create account');
    fireEvent.click(createAccountButton);

    // Wait for error message to appear
    const errorMessage = await screen.findByText('Phone number already exists');
    expect(errorMessage).toBeInTheDocument();
});
