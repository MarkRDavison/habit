import { Habit } from '../models/Habit';

const SET_HABITS_PROGRESSING = 'SET_HABITS_PROGRESSING';
const SET_HABITS_FETCHED = 'SET_HABITS_FETCHED';
const SET_HABITS_ADDED = 'SET_HABITS_ADDED';
const SET_HABITS_UPDATED = 'SET_HABITS_UPDATED';
const SET_HABITS_REMOVED = 'SET_HABITS_REMOVED';
const SET_HABIT_PROGRESS_ERROR = 'SET_HABIT_PROGRESS_ERROR';

export interface HabitState {
    habits: Habit[]
    progressing: boolean
    error: string | undefined
};

const initialState: HabitState = {
    habits: [],
    progressing: false,
    error: undefined
};

interface HabitsFetchedAction {
    type: typeof SET_HABITS_FETCHED,
    payload: Habit[]
};

interface HabitsAddedAction {
    type: typeof SET_HABITS_ADDED,
    payload: Habit[]
};

interface HabitsUpdatedAction {
    type: typeof SET_HABITS_UPDATED,
    payload: Habit[]
};

interface HabitsFetchingAction {
    type: typeof SET_HABITS_PROGRESSING
};

interface HabitsRemovedAction {
    type: typeof SET_HABITS_REMOVED
    payload: string[]
};

interface HabitFetchErrorAction {
    type: typeof SET_HABIT_PROGRESS_ERROR
    payload: string
}

export type HabitActionTypes =
    HabitsFetchedAction |
    HabitsAddedAction |
    HabitsUpdatedAction |
    HabitsFetchingAction |
    HabitsRemovedAction |
    HabitFetchErrorAction;

export function setHabitsFetched(habits: Habit[]): HabitActionTypes {
    return {
        type: SET_HABITS_FETCHED,
        payload: habits
    };
};

export function setHabitsAdded(habits: Habit[]): HabitActionTypes {
    return {
        type: SET_HABITS_ADDED,
        payload: habits
    };
};

export function setHabitsUpdated(habits: Habit[]): HabitActionTypes {
    return {
        type: SET_HABITS_UPDATED,
        payload: habits
    };
};

export function setHabitsProgressing(): HabitActionTypes {
    return {
        type: SET_HABITS_PROGRESSING
    };
};

export function setHabitsRemoved(ids: string[]): HabitActionTypes {
    return {
        type: SET_HABITS_REMOVED,
        payload: ids
    };
}

export function setHabitFetchError(error: string): HabitActionTypes {
    return {
        type: SET_HABIT_PROGRESS_ERROR,
        payload: error
    };
};

export function habitReducer(
    state = initialState,
    action: HabitActionTypes
): HabitState {
    /* istanbul ignore next */
    if (action === undefined || action === null) {
        return state;
    }

    switch (action.type) {
        case SET_HABITS_PROGRESSING:
            return {
                ...state,
                error: undefined,
                progressing: true
            };
        case SET_HABITS_FETCHED:
            return {
                ...state,
                progressing: false,
                habits: action.payload
            };
        case SET_HABITS_ADDED:
            return {
                ...state,
                habits: [...state.habits.concat(action.payload)]
            };
        case SET_HABITS_UPDATED:
            return {
                ...state,
                habits: [...action.payload.concat(state.habits.filter(_ => !action.payload.find(p => p.id == _.id)))]
            };
        case SET_HABITS_REMOVED:
            return {
                ...state,
                habits: [...state.habits.filter(h => !action.payload.includes(h.id))]
            };
        case SET_HABIT_PROGRESS_ERROR:
            return {
                ...state,
                error: action.payload,
                progressing: false
            };
    }

    /* istanbul ignore next */
    return state;
}