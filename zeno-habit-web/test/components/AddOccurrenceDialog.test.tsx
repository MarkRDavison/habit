import { Habit } from "@/models/Habit";
import { render, screen } from '@testing-library/react';
import { setHabitsFetched } from "@/store/habitReducer";
import createHabitStore, { RootState } from "@/store/store";
import { createBrowserHistory } from 'history'
import { Store, AnyAction } from "redux";
import * as zcc from '@mark.davison/zeno-common-client';
import React from "react";
import HabitPage from "@/components/HabitPage";
import { Provider } from "react-redux";
import { Router, Route } from "react-router";
import occurenceService, { OccurenceService } from "@/services/occurenceService";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

jest.mock('@mark.davison/zeno-common', () => {
    return {
        logger: {
            trace: (text: unknown, ...params: unknown[]) => {},
            debug: (text: unknown, ...params: unknown[]) => {},
            info: (text: unknown, ...params: unknown[]) => {},
            warn: (text: unknown, ...params: unknown[]) => {},
            error: (text: unknown, ...params: unknown[]) => {}
        }
    }
});
jest.mock('@/services/occurenceService', (): OccurenceService => {
    return {
        postOccurence: jest.fn(),
        getOccurencesWithinDateRange: jest.fn()
    };
});

describe('AddOccurenceDialog', () => {
    const habit: Habit = {
        id: '1',
        name: 'Habit Number 1',
        createdDate: 'today',
        createdByUserId: 'me',
        question: 'habit 1',
        archived: false
    };

    let localStore: Store<RootState, AnyAction>;

    beforeEach(async () => {
        localStore = createHabitStore();
        localStore.dispatch(setHabitsFetched([habit]));

        var history = createBrowserHistory();
        history.push(`/habit/${habit.id}`);
        render(
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
        const habitPage_AddOccurenceButton = screen.queryByTestId('HabitPage_AddOccurenceButton');
        expect(habitPage_AddOccurenceButton).toBeValid();

        await userEvent.click(habitPage_AddOccurenceButton!);
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

    test('Add button is disabled when date is not selected', async () => {        
        const addEntryDialog_Submit = screen.queryByTestId('AddEntryDialog_Submit');
        expect(addEntryDialog_Submit).toBeDisabled();
    });

    test('Cancel button is enabled when date is not selected', async () => {        
        const addEntryDialog_Cancel = screen.queryByTestId('AddEntryDialog_Cancel');
        expect(addEntryDialog_Cancel).toBeEnabled();
    });

    test('Close button is enabled when date is not selected', async () => {        
        const addEntryDialog_Close = screen.queryByTestId('AddEntryDialog_CloseButton');
        expect(addEntryDialog_Close).toBeEnabled();
    });

    test('Setting date value enables add button', () => {    
        const addEntryDialog_DateInput = screen.queryByTestId<HTMLInputElement>('AddEntryDialog_DateInput');
        expect(addEntryDialog_DateInput).toBeValid(); 

        act(() => userEvent.type(addEntryDialog_DateInput!, '2020-01-01'));

        const addEntryDialog_Submit = screen.queryByTestId('AddEntryDialog_Submit');
        expect(addEntryDialog_Submit).toBeEnabled();
    });

    test('Submitting date where the post succeeds closes the dialog', async () => {    
        const addEntryDialog_DateInput = screen.queryByTestId<HTMLInputElement>('AddEntryDialog_DateInput');
        expect(addEntryDialog_DateInput).toBeValid(); 

        act(() => userEvent.type(addEntryDialog_DateInput!, '2020-01-01'));

        const addEntryDialog_Submit = screen.queryByTestId('AddEntryDialog_Submit');
        expect(addEntryDialog_Submit).toBeEnabled();

        var postOccurenceFn = jest.fn();
        occurenceService.postOccurence = postOccurenceFn;

        await act(async () => {
            await userEvent.click(addEntryDialog_Submit!);
        });

        expect(postOccurenceFn).toBeCalled();
    });

    test('Submitting date where the post fails keeps the dialog open', async () => {    
        const addEntryDialog_DateInput = screen.queryByTestId<HTMLInputElement>('AddEntryDialog_DateInput');
        expect(addEntryDialog_DateInput).toBeValid(); 

        act(() => userEvent.type(addEntryDialog_DateInput!, '2020-01-01'));

        const addEntryDialog_Submit = screen.queryByTestId('AddEntryDialog_Submit');
        expect(addEntryDialog_Submit).toBeEnabled();

        var postOccurenceFn = jest.fn(() => {
            throw Error("POST failed");
        });
        occurenceService.postOccurence = postOccurenceFn;

        await act(async () => {
            await userEvent.click(addEntryDialog_Submit!);
        });

        expect(postOccurenceFn).toBeCalled();
    });

});