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
import HabitCalendarSection, { getCalendarHistory } from '../../../src/components/habitSections/HabitCalendarSection';

interface TestProps {
    today: Date
    colour: string // TODO: Comes from habit?
}

const renderComponentUnderTest = (
    props: TestProps,
    authProps: any,
    localStore: Store<RootState, AnyAction>,
    history: ReturnType<typeof createBrowserHistory>) => render(
        <zcc.AuthProvider value={authProps}>
            <Provider store={localStore}>
                <Router history={history}>
                    <HabitCalendarSection {...props} />
                </Router>
            </Provider>
        </zcc.AuthProvider>
    );

describe('HabitCalendarSection', () => {
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

        const props: TestProps = {
            today: new Date(),
            colour: 'green'
        };

        renderComponentUnderTest(props, authProps, localStore, history);

        const HabitCalendarSection = screen.queryByTestId('HabitCalendarSection');
        expect(HabitCalendarSection).toBeValid();
    });

    test('Calendar stuff works', () => {
        const weeks = 3;
        const monthDetails = getCalendarHistory(new Date(2022, 0, 12), weeks);

        expect(weeks).toBeGreaterThanOrEqual(3);
        expect(monthDetails).toHaveLength((weeks - 1) * 7 + 4);
        {
            expect(monthDetails[0]).toHaveProperty('year', 2022);
            expect(monthDetails[0]).toHaveProperty('month', 0);
            expect(monthDetails[0]).toHaveProperty('monthS', 'January');
            expect(monthDetails[0]).toHaveProperty('day', 12);
            expect(monthDetails[0]).toHaveProperty('dayS', 'Wednesday');
        }
        {
            expect(monthDetails[12]).toHaveProperty('year', 2021);
            expect(monthDetails[12]).toHaveProperty('month', 11);
            expect(monthDetails[12]).toHaveProperty('monthS', 'December');
            expect(monthDetails[12]).toHaveProperty('day', 31);
            expect(monthDetails[12]).toHaveProperty('dayS', 'Friday');
        }
        {
            expect(monthDetails[17]).toHaveProperty('year', 2021);
            expect(monthDetails[17]).toHaveProperty('month', 11);
            expect(monthDetails[17]).toHaveProperty('monthS', 'December');
            expect(monthDetails[17]).toHaveProperty('day', 26);
            expect(monthDetails[17]).toHaveProperty('dayS', 'Sunday');
        }
    });
});