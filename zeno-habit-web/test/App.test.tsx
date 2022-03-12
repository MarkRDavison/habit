import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '@/App';
import { Provider } from 'react-redux';
import createHabitStore from '../src/store/store';
import { MemoryRouter } from 'react-router';


test('App has text', (): void => {
    const store = createHabitStore();
    render(
        <Provider store={store}>
            <MemoryRouter>
                <App />
            </MemoryRouter>
        </Provider>
    );
    const linkElement = screen.getByText(/Zeno Habit/i);
    expect(linkElement).toBeInTheDocument();
});