import React from 'react';
import { render, screen } from '@testing-library/react';
import NavBar from '../../src/FrameworkComponents/NavBar';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

describe('NavBar', () => {
    test('NavBar contains app name', () => {
        const history = createMemoryHistory({ initialEntries: ['/home'] });
        render(
            <Router history={history}>
                <NavBar />
            </Router>
        );
        const title = screen.getByText(/Zeno Habit/i);
        expect(title).toBeInTheDocument();

    });
});
