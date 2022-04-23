import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../../src/components/HomePage';
import * as zcc from '@mark.davison/zeno-common-client';
import { AnyAction, Store } from 'redux';
import { RootState } from '../../src/store/store';
import { Provider } from 'react-redux';
import { setHabitsFetched } from '../../src/store/habitReducer';
import createHabitStore from '../../src/store/store';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import { Habit } from '../../src/models/Habit';
import { act } from 'react-dom/test-utils';
import { Occurence } from '@/models/Occurence';

const createHabit = (): Habit => {
    return {
        id: `${Math.random()}`,
        name: 'Habit 1',
        createdDate: 'today',
        createdByUserId: '12345',
        question: '1?',
        archived: false
    };
}

jest.mock('../../src/services/habitService', () => {
    return {
        getHabits: async (): Promise<Habit[]> => {
            return await Promise.resolve([]);
        }
    }
});

jest.mock('../../src/services/occurenceService', () => {
    return {
        getOccurencesWithinDateRange: async (habitIds: string[], startDate: Date, endDate: Date): Promise<Occurence[]> => {
            return await Promise.resolve([]);
        }
    }
});

describe('Home', () => {
    let localStore: Store<RootState, AnyAction>;

    beforeEach(() => {
        localStore = createHabitStore();
    });

    const authProps = {
        isLoggedIn: true,
        isLoggingIn: true,
        user: {
            preferred_username: 'first.last',
            email: '',
            email_verified: true,
            family_name: 'last',
            given_name: 'first',
            name: 'first last',
            sub: '123'
        },
        login: () => { },
        logout: () => { }
    };

    test('null user renders nothing', () => {
        localStore.dispatch(setHabitsFetched([createHabit()]));
        render(
            <zcc.AuthProvider value={{ ...authProps, user: null }}>
                <Provider store={localStore}>
                    <MemoryRouter>
                        <HomePage />
                    </MemoryRouter>
                </Provider>
            </zcc.AuthProvider>
        );

        const homePage = screen.queryByTestId('HomePage');
        expect(homePage).toBeNull();
    });

    test('Home page is rendered', () => {
        localStore.dispatch(setHabitsFetched([createHabit()]));
        render(
            <zcc.AuthProvider value={authProps}>
                <Provider store={localStore}>
                    <MemoryRouter>
                        <HomePage />
                    </MemoryRouter>
                </Provider>
            </zcc.AuthProvider>
        );

        const homePage = screen.queryByTestId('HomePage');
        expect(homePage).toBeValid();
    });

    test('habit state is progressing on load', () => {
        render(
            <zcc.AuthProvider value={authProps}>
                <Provider store={localStore}>
                    <MemoryRouter>
                        <HomePage />
                    </MemoryRouter>
                </Provider>
            </zcc.AuthProvider>
        );

        expect(localStore.getState().habitState.progressing).toBeTruthy();
    });

    test('Clicking the add habit button renders the create habit dialog', () => {
        localStore.dispatch(setHabitsFetched([createHabit()]));
        render(
            <zcc.AuthProvider value={authProps}>
                <Provider store={localStore}>
                    <MemoryRouter>
                        <HomePage />
                    </MemoryRouter>
                </Provider>
            </zcc.AuthProvider>
        );

        const button = screen.queryByTestId<HTMLButtonElement>('HomePage_AddHabit');
        expect(button).toBeValid();
        act(() => userEvent.click(button!));

        const createHabitDialog = screen.queryByTestId('CreateHabitDialog');
        expect(createHabitDialog).toBeValid();
    });

    test('Clicking the switch shows archived habits', async () => {
        const archivedName = 'I AM ARCHIVED';
        localStore.dispatch(setHabitsFetched([
            createHabit(), {
            ...createHabit(),
            name: archivedName,
            archived: true
        }]));
        render(
            <zcc.AuthProvider value={authProps}>
                <Provider store={localStore}>
                    <MemoryRouter>
                        <HomePage />
                    </MemoryRouter>
                </Provider>
            </zcc.AuthProvider>
        );

        const switchControl = screen.getByRole('checkbox');
        expect(switchControl).toBeValid();
        await act(async () => await userEvent.click(switchControl!));

        const archivedHabit = screen.findByText(archivedName);
        expect(archivedHabit).not.toBeNull();
    });

});