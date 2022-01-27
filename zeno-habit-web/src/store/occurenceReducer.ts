import { Occurence } from '../models/Occurence';

const SET_OCCURENCES_PROGRESSING = 'SET_OCCURENCES_PROGRESSING';
const SET_OCCURENCES_FETCHED = 'SET_OCCURENCES_FETCHED';
const SET_OCCURENCES_ADDED = 'SET_OCCURENCES_ADDED';
const SET_OCCURENCES_REMOVED = 'SET_OCCURENCES_REMOVED';
const SET_OCCURENCE_PROGRESS_ERROR = 'SET_OCCURENCE_PROGRESS_ERROR';

export interface OccurenceState {
    occurences: Occurence[]
    progressing: boolean
    error: string | undefined
};

const initialState: OccurenceState = {
    occurences: [],
    progressing: false,
    error: undefined
};

interface OccurencesFetchedAction {
    type: typeof SET_OCCURENCES_FETCHED,
    payload: Occurence[]
};

interface OccurencesAddedAction {
    type: typeof SET_OCCURENCES_ADDED,
    payload: Occurence[]
};

interface OccurencesFetchingAction {
    type: typeof SET_OCCURENCES_PROGRESSING
};

interface OccurencesRemovedAction {
    type: typeof SET_OCCURENCES_REMOVED
    payload: string[]
};

interface OccurenceFetchErrorAction {
    type: typeof SET_OCCURENCE_PROGRESS_ERROR
    payload: string
}

export type OccurenceActionTypes =
    OccurencesFetchedAction |
    OccurencesAddedAction |
    OccurencesFetchingAction |
    OccurencesRemovedAction |
    OccurenceFetchErrorAction;

export function setOccurencesFetched(occurences: Occurence[]): OccurenceActionTypes {
    return {
        type: SET_OCCURENCES_FETCHED,
        payload: occurences
    };
};

export function setOccurencesAdded(occurences: Occurence[]): OccurenceActionTypes {
    return {
        type: SET_OCCURENCES_ADDED,
        payload: occurences
    };
};

export function setOccurencesProgressing(): OccurenceActionTypes {
    return {
        type: SET_OCCURENCES_PROGRESSING
    };
};

export function setOccurencesRemoved(ids: string[]): OccurenceActionTypes {
    return {
        type: SET_OCCURENCES_REMOVED,
        payload: ids
    };
}

export function setOccurenceFetchError(error: string): OccurenceActionTypes {
    return {
        type: SET_OCCURENCE_PROGRESS_ERROR,
        payload: error
    };
};

export function occurenceReducer(
    state = initialState,
    action: OccurenceActionTypes
): OccurenceState {
    /* istanbul ignore next */
    if (action === undefined || action === null) {
        return state;
    }

    switch (action.type) {
        case SET_OCCURENCES_PROGRESSING:
            return {
                ...state,
                error: undefined,
                progressing: true
            };
        case SET_OCCURENCES_FETCHED:
            return {
                ...state,
                progressing: false,
                occurences: action.payload
            };
        case SET_OCCURENCES_ADDED:
            return {
                ...state,
                occurences: [...state.occurences.concat(action.payload)]
            };
        case SET_OCCURENCES_REMOVED:
            return {
                ...state,
                occurences: [...state.occurences.filter(o => !action.payload.includes(o.id))]
            };
        case SET_OCCURENCE_PROGRESS_ERROR:
            return {
                ...state,
                error: action.payload,
                progressing: false
            };
    }

    /* istanbul ignore next */
    return state;
}