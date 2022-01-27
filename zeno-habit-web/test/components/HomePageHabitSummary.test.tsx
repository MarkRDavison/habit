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
import { Occurence, OccurenceCreationProps } from '../../src/models/Occurence';
import { setOccurencesFetched } from '../../src/store/occurenceReducer';

jest.mock('../../src/services/occurenceService', () => {
    return {
        postOccurence: async (occurence: OccurenceCreationProps): Promise<Occurence> => {
            return await Promise.resolve({
                ...occurence,
                id: 'valid id1',
                createdByUserId: 'me',
                createdDate: new Date().toISOString(),
            });
        }
    }
});

describe('HomePageHabitSummary', () => {

    const addDays = (date: Date, days: number): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

    const userId = 'me';
    const now = new Date(); // TODO: A better way of testing date related things
    const habit: Habit = {
        id: '1',
        name: 'Habit Number 1',
        createdDate: 'a week ago',
        createdByUserId: userId,
        question: '1?'
    };
    const occurences: Occurence[] = [
        {
            id: '3',
            createdByUserId: userId,
            createdDate: 'yesterday',
            habitId: habit.id,
            occurenceDate: addDays(now, -1)
        },
        {
            id: '2',
            createdByUserId: userId,
            createdDate: 'yesterday',
            habitId: habit.id,
            occurenceDate: addDays(now, -2)
        },
        {
            id: '1',
            createdByUserId: userId,
            createdDate: 'yesterday',
            habitId: habit.id,
            occurenceDate: addDays(now, -3)
        }
    ];
    let localStore: Store<RootState, AnyAction>;

    beforeEach(() => {
        localStore = createHabitStore();
        localStore.dispatch(setHabitsFetched([habit]));
        localStore.dispatch(setOccurencesFetched(occurences));
    });

    test('Displays the name of the habit', () => {
         render(
            <Provider store={localStore}>
                <MemoryRouter>
                    <HomePageHabitSummary habitId={habit.id} colour={'red'} />
                </MemoryRouter>
            </Provider>
        );

        const habitSummary = screen.queryByTestId(`HomePageHabitSummary_${habit.id}`);
        expect(habitSummary).toBeValid();
        expect(habitSummary).toHaveTextContent(habit.name);
    });

    test('habit not in the store renders nothing', () => {
        const id = 'idontexist';
         render(
            <Provider store={localStore}>
                <MemoryRouter>
                    <HomePageHabitSummary habitId={id} colour={'red'} />
                </MemoryRouter>
            </Provider>
        );

        const habitSummary = screen.queryByTestId(`HomePageHabitSummary_${id}`);
        expect(habitSummary).toBeNull();
    });

    test('clicking the summary navigates to the detailed habit view', async () => {
         render(
            <Provider store={localStore}>
                <MemoryRouter>
                    <HomePageHabitSummary habitId={habit.id} colour={'red'} />
                </MemoryRouter>
            </Provider>
        );

        const habitSummary = screen.queryByTestId(`HomePageHabitSummary_${habit.id}`);
        expect(habitSummary).toBeValid();

        await act(async () => {
            fireEvent.click(habitSummary!);
        });
    });

    test('clicking on an existing occurence does not create a new occurence', async () => {
        render(
            <Provider store={localStore}>
                <MemoryRouter>
                    <HomePageHabitSummary habitId={habit.id} colour={'red'} />
                </MemoryRouter>
            </Provider>
        );

        const occurence = screen.queryByTestId(`HomePageHabitSummary_Recent_${occurences[0].occurenceDate.getUTCDate()}`);
        expect(occurence).toBeValid();
        
        await act(async () => {
            fireEvent.click(occurence!);
        });
    });

    test('clicking on a non existant occurence creates a new occurence', async () => {
        render(
            <Provider store={localStore}>
                <MemoryRouter>
                    <HomePageHabitSummary habitId={habit.id} colour={'red'} />
                </MemoryRouter>
            </Provider>
        );

        const occurence = screen.queryByTestId(`HomePageHabitSummary_Recent_${now.getUTCDate()}`);
        expect(occurence).toBeValid();
        
        await act(async () => {
            fireEvent.click(occurence!);
        });

        expect(localStore.getState().occurenceState.occurences).toHaveLength(occurences.length + 1);
    });

});