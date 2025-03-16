import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './login';

// test delete account 



it("updates the url", () => {
    render(<Login 
        phone="1234567890" 
        onHide={() => {}}
    />);
    let url = 'https://bible-api.com/data/web/random';
    
    const newTestamentCheckbox = screen.getByTestId('new testament only');
    fireEvent.click(newTestamentCheckbox);
     url = 'https://bible-api.com/data/web/random/NT';
    const updateBtn = screen.getByText('update');
    fireEvent.click(updateBtn);

    expect(url).toBe('https://bible-api.com/data/web/random/NT');
});


