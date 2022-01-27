import { Occurence } from "../../src/models/Occurence";
import {
    OccurenceState,
    occurenceReducer,
    setOccurencesFetched,
    setOccurencesProgressing,
    setOccurencesRemoved,
    setOccurenceFetchError,
    setOccurencesAdded
} from "../../src/store/occurenceReducer";

const createOccurence = (id: string = ''): Occurence => {
    return { id: id, habitId: '', createdByUserId: '', createdDate: '', occurenceDate: new Date() };
}

describe('occurenceReducer', () => {
    test('setting an empty list of occurences returns the equivelant of the initial state', () => {
        const state = occurenceReducer(undefined, setOccurencesFetched([]));

        expect(state.error).toBeUndefined();
        expect(state.progressing).toBeFalsy();
        expect(state.occurences).toHaveLength(0);
    });

    test('setting occurences progressing does nothing to the existing occurences, but sets the progressing flag', () => {
        const initialState: OccurenceState = {
            error: 'an error',
            progressing: false,
            occurences: [
                createOccurence('1')
            ]
        };

        const state = occurenceReducer(initialState, setOccurencesProgressing());

        expect(state.error).toBeUndefined();
        expect(state.progressing).toBeTruthy();
        expect(state.occurences).toHaveLength(initialState.occurences.length);
    });

    test('setting a non empty list of occurences sets the list and clears the progressing flag', () => {
        const initialState: OccurenceState = {
            error: undefined,
            progressing: true,
            occurences: []
        };
        const occurences: Occurence[] = [
            createOccurence('1')
        ]
        const state = occurenceReducer(initialState, setOccurencesFetched(occurences));

        expect(state.error).toBeUndefined();
        expect(state.progressing).toBeFalsy();
        expect(state.occurences).toHaveLength(occurences.length);
    });

    test('removing a list of occurences removes the corresponding occurences from state', () => {
        const initialState: OccurenceState = {
            error: undefined,
            progressing: false,
            occurences: [
                createOccurence('1'), createOccurence('2'), createOccurence('3')
            ]
        };

        const state = occurenceReducer(initialState, setOccurencesRemoved(['1', '3']));

        expect(state.error).toBeUndefined();
        expect(state.progressing).toBeFalsy();
        expect(state.occurences).toHaveLength(1);
    });

    test('setting occurence fetch error sets error and clears the fetching flag', () => {
        const error = 'An error occured';
        const state = occurenceReducer(undefined, setOccurenceFetchError(error));

        expect(state.error).toBeDefined();
        expect(state.progressing).toBeFalsy();
    });

    test('adding a list of occurences increases the list in state', () => {
        const initialState: OccurenceState = {
            error: undefined,
            progressing: false,
            occurences: [
                createOccurence('1'), createOccurence('2'), createOccurence('3')
            ]
        };

        const state = occurenceReducer(initialState, setOccurencesAdded([
            createOccurence('4'),
            createOccurence('5')
        ]));

        expect(state.occurences).toHaveLength(5);
    })
});