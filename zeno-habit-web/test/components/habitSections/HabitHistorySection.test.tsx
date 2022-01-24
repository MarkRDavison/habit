import React from 'react';
import { AnyAction, Store } from 'redux';
import { Habit } from '../../../src/models/Habit';
import { setHabitsFetched } from '../../../src/store/habitReducer';
import createHabitStore, { RootState } from '../../../src/store/store';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import * as zcc from '@mark.davison/zeno-common-client';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import HabitHistorySection from '../../../src/components/habitSections/HabitHistorySection';

const renderComponentUnderTest = (
    authProps: any,
    localStore: Store<RootState, AnyAction>,
    history: ReturnType<typeof createBrowserHistory>) => render(
        <zcc.AuthProvider value={authProps}>
            <Provider store={localStore}>
                <Router history={history}>
                    <HabitHistorySection />
                </Router>
            </Provider>
        </zcc.AuthProvider>
    );

describe('HabitHistorySection', () => {
    const habit: Habit = {
        id: '1',
        name: 'Habit Number 1',
        createdDate: 'today',
        createdByUserId: 'me',
        question: 'habit 1'
    };
    let localStore: Store<RootState, AnyAction>;

    beforeEach(() => {
        localStore = createHabitStore();
        localStore.dispatch(setHabitsFetched([habit]));
    });

    const authProps = {
        isLoggedIn: true,
        isLoggingIn: false,
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

    test('component can be rendered', () => {
        var history = createBrowserHistory();
        history.push(`/habit/${habit.id}`);

        renderComponentUnderTest(authProps, localStore, history);

        const HabitHistorySection = screen.queryByTestId('HabitHistorySection');
        expect(HabitHistorySection).toBeValid();
    });
});