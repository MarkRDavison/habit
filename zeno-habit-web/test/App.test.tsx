import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';


test('App has text', (): void => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});