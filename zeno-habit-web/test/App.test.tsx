import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';


test('App has text', (): void => {
    render(<App />);
    const linkElement = screen.getByText(/Zeno Habit/i);
    expect(linkElement).toBeInTheDocument();
});