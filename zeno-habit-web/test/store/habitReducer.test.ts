import { Habit } from "../../src/models/Habit";
import {
    HabitState,
    habitReducer,
    setHabitsFetched,
    setHabitsProgressing,
    setHabitsRemoved,
    setHabitFetchError,
    setHabitsAdded
} from "../../src/store/habitReducer";

const createHabit = (id: string = ''): Habit => {
    return { id: id, createdByUserId: '', name: '', createdDate: '', question: '' };
}

describe('habitReducer', () => {
    test('setting an empty list of habits returns the equivelant of the initial state', () => {
        const state = habitReducer(undefined, setHabitsFetched([]));

        expect(state.error).toBeUndefined();
        expect(state.progressing).toBeFalsy();
        expect(state.habits).toHaveLength(0);
    });

    test('setting habits progressing does nothing to the existing habits, but sets the progressing flag', () => {
        const initialState: HabitState = {
            error: 'an error',
            progressing: false,
            habits: [
                createHabit('1')
            ]
        };

        const state = habitReducer(initialState, setHabitsProgressing());

        expect(state.error).toBeUndefined();
        expect(state.progressing).toBeTruthy();
        expect(state.habits).toHaveLength(initialState.habits.length);
    });

    test('setting a non empty list of habits sets the list and clears the progressing flag', () => {
        const initialState: HabitState = {
            error: undefined,
            progressing: true,
            habits: []
        };
        const habits: Habit[] = [
            createHabit('1')
        ]
        const state = habitReducer(initialState, setHabitsFetched(habits));

        expect(state.error).toBeUndefined();
        expect(state.progressing).toBeFalsy();
        expect(state.habits).toHaveLength(habits.length);
    });

    test('removing a list of habits removes the corresponding habits from state', () => {
        const initialState: HabitState = {
            error: undefined,
            progressing: false,
            habits: [
                createHabit('1'), createHabit('2'), createHabit('3')
            ]
        };

        const state = habitReducer(initialState, setHabitsRemoved(['1', '3']));

        expect(state.error).toBeUndefined();
        expect(state.progressing).toBeFalsy();
        expect(state.habits).toHaveLength(1);
    });

    test('setting habit fetch error sets error and clears the fetching flag', () => {
        const error = 'An error occured';
        const state = habitReducer(undefined, setHabitFetchError(error));

        expect(state.error).toBeDefined();
        expect(state.progressing).toBeFalsy();
    });

    test('adding a list of habits adds to the habits from state', () => {
        const initialState: HabitState = {
            error: undefined,
            progressing: false,
            habits: [
                createHabit('1'), createHabit('2'), createHabit('3')
            ]
        };

        const state = habitReducer(initialState, setHabitsAdded([createHabit('4'), createHabit('5')]));

        expect(state.error).toBeUndefined();
        expect(state.progressing).toBeFalsy();
        expect(state.habits).toHaveLength(5);
    });
});