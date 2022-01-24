import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import HomePageHabitSummary from '../../src/components/HomePageHabitSummary';
import { Habit } from '../../src/models/Habit';
import { Provider } from 'react-redux';
import { Store, AnyAction } from 'redux';
import { RootState } from '../../src/store/store';
import createHabitStore from '../../src/store/store';
import { setHabitsFetched } from '../../src/store/habitReducer';
import { MemoryRouter } from 'react-router';

describe('HomePageHabitSummary', () => {

    const habit: Habit = {
        id: '1',
        name: 'Habit Number 1',
        createdDate: 'today',
        createdByUserId: 'me',
        question: '1?'
    };
    let localStore: Store<RootState, AnyAction>;

    beforeEach(() => {
        localStore = createHabitStore();
        localStore.dispatch(setHabitsFetched([habit]));
    });

    test('Displays the name of the habit', () => {
        const { queryByTestId } = render(
            <Provider store={localStore}>
                <MemoryRouter>
                    <HomePageHabitSummary habitId={habit.id} />
                </MemoryRouter>
            </Provider>
        );

        const habitSummary = queryByTestId(`HomePageHabitSummary_${habit.id}`);
        expect(habitSummary).toBeValid();
        expect(habitSummary).toHaveTextContent(habit.name);
    });

    test('habit not in the store renders nothing', () => {
        const id = 'idontexist';
        const { queryByTestId } = render(
            <Provider store={localStore}>
                <MemoryRouter>
                    <HomePageHabitSummary habitId={id} />
                </MemoryRouter>
            </Provider>
        );

        const habitSummary = queryByTestId(`HomePageHabitSummary_${id}`);
        expect(habitSummary).toBeNull();
    });

    test('clicking the summary navigates to the detailed habit view', async () => {
        const { queryByTestId } = render(
            <Provider store={localStore}>
                <MemoryRouter>
                    <HomePageHabitSummary habitId={habit.id} />
                </MemoryRouter>
            </Provider>
        );

        const habitSummary = queryByTestId(`HomePageHabitSummary_${habit.id}`);
        expect(habitSummary).toBeValid();

        await act(async () => {
            fireEvent.click(habitSummary!);
        });
    });

});