import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Homepage from '../homepage';
import SignUp from './signUp';



it('allows me to toggle the values of old and new testament', () => {
    render(<SignUp 
        phone="1234567890" 
        onHide={() => {}}
    />);
    const oldTestamentCheckbox = screen.getByTestId('old testament only');
    fireEvent.click(oldTestamentCheckbox);
    const newTestamentCheckbox = screen.getByTestId('new testament only');
    fireEvent.click(newTestamentCheckbox); // You'll need to add data-testid to your component
    expect(newTestamentCheckbox).toBeChecked();
})
