import React from 'react';
import { render } from '@testing-library/react';
import HabitPage from '../../src/components/HabitPage';
import * as zcc from '@mark.davison/zeno-common-client';
import { Provider } from 'react-redux';
import { RootState } from '../../src/store/store';
import { Store, AnyAction } from 'redux';
import createHabitStore from '../../src/store/store';
import { Route, Router } from 'react-router';
import { Habit } from '../../src/models/Habit';
import { setHabitsFetched } from '../../src/store/habitReducer';
import { createBrowserHistory } from 'history'
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import habitService from '@/services/habitService';

jest.mock('@/services/habitService', () => {
    return {
        patchHabit: jest.fn((habit: Habit) => Promise.resolve(habit))
    }
});

describe('HabitPage', () => {
    const habit: Habit = {
        id: '1',
        name: 'Habit Number 1',
        createdDate: 'today',
        createdByUserId: 'me',
        question: 'habit 1',
        archived: false
    };
    let localStore: Store<RootState, AnyAction>;

    beforeEach(() => {
        localStore = createHabitStore();
        localStore.dispatch(setHabitsFetched([habit]));
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

    test('renders the correct habit based on the /habit/:id match', () => {
        var history = createBrowserHistory();
        history.push(`/habit/${habit.id}`);
        const { queryByTestId } = render(
            <zcc.AuthProvider value={authProps}>
                <Provider store={localStore}>
                    <Router history={history}>
                        <Route path='/habit/:id'>
                            <HabitPage />
                        </Route>
                    </Router>
                </Provider>
            </zcc.AuthProvider>
        );

        const habitSummary = queryByTestId('HabitPage');
        expect(habitSummary).toBeValid();
        expect(habitSummary).toHaveTextContent(habit.name);
    });

    test('with valid habit can return to home', async () => {
        var history = createBrowserHistory();
        history.push(`/habit/${habit.id}`);
        const { queryByTestId } = render(
            <zcc.AuthProvider value={authProps}>
                <Provider store={localStore}>
                    <Router history={history}>
                        <Route path='/habit/:id'>
                            <HabitPage />
                        </Route>
                    </Router>
                </Provider>
            </zcc.AuthProvider>
        );

        const habitPage_ReturnButton = queryByTestId('HabitPage_ReturnButton');
        expect(habitPage_ReturnButton).toBeValid();

        act(() => userEvent.click(habitPage_ReturnButton!));

        expect(history.location.pathname).toBe('/');
    });

    test('renders nothing when no match is present', () => {
        var history = createBrowserHistory();
        history.push(`/habit/${habit.id + 55}`);
        const { queryByTestId } = render(
            <zcc.AuthProvider value={authProps}>
                <Provider store={localStore}>
                    <Router history={history}>
                        <Route path='/habit/:id'>
                            <HabitPage />
                        </Route>
                    </Router>
                </Provider>
            </zcc.AuthProvider>
        );

        const habitSummary = queryByTestId('HabitPage');
        expect(habitSummary).toBeNull();
    });

    test('clicking add button opens add occurence dialog', () => {
        var history = createBrowserHistory();
        history.push(`/habit/${habit.id}`);
        const { queryByTestId } = render(
            <zcc.AuthProvider value={authProps}>
                <Provider store={localStore}>
                    <Router history={history}>
                        <Route path='/habit/:id'>
                            <HabitPage />
                        </Route>
                    </Router>
                </Provider>
            </zcc.AuthProvider>
        );

        const habitPage_AddOccurenceButton = queryByTestId('HabitPage_AddOccurenceButton');
        expect(habitPage_AddOccurenceButton).toBeValid();

        act(() => userEvent.click(habitPage_AddOccurenceButton!));
        
        const addEntryDialog_CloseButton = queryByTestId('AddEntryDialog_CloseButton');
        expect(addEntryDialog_CloseButton).toBeValid();

        act(() => userEvent.click(addEntryDialog_CloseButton!));
    });

    test('clicking archive button archives the habit', async () => {
        var history = createBrowserHistory();
        history.push(`/habit/${habit.id}`);
        const { queryByTestId } = render(
            <zcc.AuthProvider value={authProps}>
                <Provider store={localStore}>
                    <Router history={history}>
                        <Route path='/habit/:id'>
                            <HabitPage />
                        </Route>
                    </Router>
                </Provider>
            </zcc.AuthProvider>
        );

        const habitPage_ArchiveOccurenceButton = queryByTestId('HabitPage_ArchiveOccurenceButton');
        expect(habitPage_ArchiveOccurenceButton).toBeValid();

        await act(async () => await userEvent.click(habitPage_ArchiveOccurenceButton!));

        expect(habitService.patchHabit).toBeCalled();
    });
});