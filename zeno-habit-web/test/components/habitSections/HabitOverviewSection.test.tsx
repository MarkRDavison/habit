import React from 'react';
import { AnyAction, Store } from 'redux';
import { Habit } from '../../../src/models/Habit';
import { setHabitsFetched, setHabitsRemoved } from '../../../src/store/habitReducer';
import createHabitStore, { RootState } from '../../../src/store/store';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import * as zcc from '@mark.davison/zeno-common-client';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import HabitOverviewSection from '../../../src/components/habitSections/HabitOverviewSection';

interface TestProps {
    score?: number
    month?: number
    year?: number
    total?: number
    colour: string
    habit: Habit
}

const renderComponentUnderTest = (
    props: TestProps,
    authProps: any,
    localStore: Store<RootState, AnyAction>,
    history: ReturnType<typeof createBrowserHistory>) => render(
        <zcc.AuthProvider value={authProps}>
            <Provider store={localStore}>
                <Router history={history}>
                    <HabitOverviewSection {...props} />
                </Router>
            </Provider>
        </zcc.AuthProvider>
    );

describe('HabitOverviewSection', () => {
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
        login: jest.fn(),
        logout: jest.fn()
    };

    test('component can be rendered when not loading', () => {
        var history = createBrowserHistory();
        history.push(`/habit/${habit.id}`);

        const props: TestProps = {
            score: 52,
            month: 12,
            year: 22,
            total: 512,
            colour: '#CC2222',
            habit: habit
        };

        renderComponentUnderTest(props, authProps, localStore, history);

        const HabitOverviewSection = screen.queryByTestId('HabitOverviewSection');
        expect(HabitOverviewSection).toBeValid();

        {   // Progress
            const HabitOverviewSection_ProgressForeground = screen.queryByTestId('HabitOverviewSection_ProgressForeground');
            expect(HabitOverviewSection_ProgressForeground).toBeValid();
            expect(HabitOverviewSection_ProgressForeground).toHaveAttribute('aria-valuenow', props.score!.toString());

            const HabitOverviewSection_ProgressBackground = screen.queryByTestId('HabitOverviewSection_ProgressBackground');
            expect(HabitOverviewSection_ProgressBackground).toBeValid();
            expect(HabitOverviewSection_ProgressBackground!.className).toContain('-determinate');
        }
        {   // Score
            const HabitOverviewSection_Label_Score = screen.queryByTestId('HabitOverviewSection_Label_Score');
            expect(HabitOverviewSection_Label_Score).toBeValid();
            expect(HabitOverviewSection_Label_Score).toHaveTextContent('Score');

            const HabitOverviewSection_Value_Score = screen.queryByTestId('HabitOverviewSection_Value_Score');
            expect(HabitOverviewSection_Value_Score).toBeValid();
            expect(HabitOverviewSection_Value_Score).toHaveTextContent(props.score!.toString());
        }
        {   // Month
            const HabitOverviewSection_Label_Month = screen.queryByTestId('HabitOverviewSection_Label_Month');
            expect(HabitOverviewSection_Label_Month).toBeValid();
            expect(HabitOverviewSection_Label_Month).toHaveTextContent('Month');

            const HabitOverviewSection_Value_Month = screen.queryByTestId('HabitOverviewSection_Value_Month');
            expect(HabitOverviewSection_Value_Month).toBeValid();
            expect(HabitOverviewSection_Value_Month).toHaveTextContent(props.month!.toString());
        }
        {   // Year
            const HabitOverviewSection_Label_Year = screen.queryByTestId('HabitOverviewSection_Label_Year');
            expect(HabitOverviewSection_Label_Year).toBeValid();
            expect(HabitOverviewSection_Label_Year).toHaveTextContent('Year');

            const HabitOverviewSection_Value_Year = screen.queryByTestId('HabitOverviewSection_Value_Year');
            expect(HabitOverviewSection_Value_Year).toBeValid();
            expect(HabitOverviewSection_Value_Year).toHaveTextContent(props.year!.toString());
        }
        {   // Total
            const HabitOverviewSection_Label_Total = screen.queryByTestId('HabitOverviewSection_Label_Total');
            expect(HabitOverviewSection_Label_Total).toBeValid();
            expect(HabitOverviewSection_Label_Total).toHaveTextContent('Total');

            const HabitOverviewSection_Value_Total = screen.queryByTestId('HabitOverviewSection_Value_Total');
            expect(HabitOverviewSection_Value_Total).toBeValid();
            expect(HabitOverviewSection_Value_Total).toHaveTextContent(props.total!.toString());
        }
    });

    test('component can be rendered when loading', () => {
        var history = createBrowserHistory();
        history.push(`/habit/${habit.id}`);
        localStore.dispatch(setHabitsRemoved([habit.id]));

        const props: TestProps = {
            score: 52,
            month: -12,
            year: -22,
            total: 512,
            colour: '#CC2222',
            habit: habit
        };

        renderComponentUnderTest(props, authProps, localStore, history);

        const HabitOverviewSection = screen.queryByTestId('HabitOverviewSection');
        expect(HabitOverviewSection).toBeValid();

        {   // Progress
            const HabitOverviewSection_ProgressForeground = screen.queryByTestId('HabitOverviewSection_ProgressForeground');
            expect(HabitOverviewSection_ProgressForeground).toBeNull();

            const HabitOverviewSection_ProgressBackground = screen.queryByTestId('HabitOverviewSection_ProgressBackground');
            expect(HabitOverviewSection_ProgressBackground).toBeValid();
            expect(HabitOverviewSection_ProgressBackground!.className).toContain('-indeterminate');
        }
        {   // Score
            const HabitOverviewSection_Label_Score = screen.queryByTestId('HabitOverviewSection_Label_Score');
            expect(HabitOverviewSection_Label_Score).toBeValid();
            expect(HabitOverviewSection_Label_Score).toHaveTextContent('Score');

            const HabitOverviewSection_Value_Score = screen.queryByTestId('HabitOverviewSection_Value_Score');
            expect(HabitOverviewSection_Value_Score).toBeValid();
            expect(HabitOverviewSection_Value_Score).not.toHaveTextContent(props.score!.toString());
        }
        {   // Month
            const HabitOverviewSection_Label_Month = screen.queryByTestId('HabitOverviewSection_Label_Month');
            expect(HabitOverviewSection_Label_Month).toBeValid();
            expect(HabitOverviewSection_Label_Month).toHaveTextContent('Month');

            const HabitOverviewSection_Value_Month = screen.queryByTestId('HabitOverviewSection_Value_Month');
            expect(HabitOverviewSection_Value_Month).toBeValid();
            expect(HabitOverviewSection_Value_Month).not.toHaveTextContent(props.month!.toString());
        }
        {   // Year
            const HabitOverviewSection_Label_Year = screen.queryByTestId('HabitOverviewSection_Label_Year');
            expect(HabitOverviewSection_Label_Year).toBeValid();
            expect(HabitOverviewSection_Label_Year).toHaveTextContent('Year');

            const HabitOverviewSection_Value_Year = screen.queryByTestId('HabitOverviewSection_Value_Year');
            expect(HabitOverviewSection_Value_Year).toBeValid();
            expect(HabitOverviewSection_Value_Year).not.toHaveTextContent(props.year!.toString());
        }
        {   // Total
            const HabitOverviewSection_Label_Total = screen.queryByTestId('HabitOverviewSection_Label_Total');
            expect(HabitOverviewSection_Label_Total).toBeValid();
            expect(HabitOverviewSection_Label_Total).toHaveTextContent('Total');

            const HabitOverviewSection_Value_Total = screen.queryByTestId('HabitOverviewSection_Value_Total');
            expect(HabitOverviewSection_Value_Total).toBeValid();
            expect(HabitOverviewSection_Value_Total).not.toHaveTextContent(props.total!.toString());
        }
    });
});