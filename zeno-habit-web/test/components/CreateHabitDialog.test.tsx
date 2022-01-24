import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateHabitDialog from '../../src/components/CreateHabitDialog';
import * as zcc from '@mark.davison/zeno-common-client';
import { Provider } from 'react-redux';
import { RootState } from '../../src/store/store';
import { Store, AnyAction } from 'redux';
import createHabitStore from '../../src/store/store';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history'
import { Habit } from '../../src/models/Habit';

jest.mock('../../src/services/habitService', () => {
    return {
        postHabit: async (habit: Habit): Promise<Habit> => {
            return await Promise.resolve({
                ...habit,
                id: 'valid id1'
            });
        }
    }
});

const renderCreateHabitDialog = (
    open: boolean,
    authProps: any,
    localStore: Store<RootState, AnyAction>,
    history: ReturnType<typeof createBrowserHistory>) => render(
        <zcc.AuthProvider value={authProps}>
            <Provider store={localStore}>
                <Router history={history}>
                    <CreateHabitDialog open={open} onClose={() => { }} />
                </Router>
            </Provider>
        </zcc.AuthProvider>
    );

describe('CreateHabitDialog', () => {
    let localStore: Store<RootState, AnyAction>;

    beforeEach(() => {
        localStore = createHabitStore();
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

    test('null user renders nothing', () => {
        var history = createBrowserHistory();
        renderCreateHabitDialog(true, { ...authProps, user: null }, localStore, history);
        const CreateHabitDialog = screen.queryByTestId('CreateHabitDialog');
        expect(CreateHabitDialog).toBeNull();
    });

    test('Initial page is rendered with title', () => {
        var history = createBrowserHistory();
        renderCreateHabitDialog(true, authProps, localStore, history);
        const CreateHabitDialog = screen.queryByTestId('CreateHabitDialog');
        expect(CreateHabitDialog).toBeValid();
        expect(CreateHabitDialog).toHaveTextContent('Create Habit');
    });

    test('can add data to the form', () => {
        var history = createBrowserHistory();
        renderCreateHabitDialog(true, authProps, localStore, history);

        const nameData = 'the name';
        const questionData = 'the question';

        const nameInput = screen.queryByTestId<HTMLInputElement>('zeno-form-input-name');
        const questionInput = screen.queryByTestId<HTMLInputElement>('zeno-form-input-question');

        expect(nameInput).toBeValid();
        expect(questionInput).toBeValid();

        userEvent.type(nameInput!, nameData);
        userEvent.type(questionInput!, questionData);

        expect(nameInput).toHaveValue(nameData);
        expect(questionInput).toHaveValue(questionData);
    });

    test('submitting an invalid form cannot be done as submit button is disabled', async () => {
        var history = createBrowserHistory();
        renderCreateHabitDialog(true, authProps, localStore, history);

        userEvent.type(screen.queryByTestId<HTMLInputElement>('zeno-form-input-name')!, 'the name');

        let submit = screen.queryByTestId<HTMLInputElement>('zeno-form-input-submit');
        expect(submit).toBeValid();
        expect(submit).toBeDisabled();
    });

    test('submitting a valid form disables it, then re-enables it after submitting', async () => {
        var history = createBrowserHistory();
        renderCreateHabitDialog(true, authProps, localStore, history);

        const nameData = 'the name';
        const questionData = 'the question';

        userEvent.type(screen.queryByTestId<HTMLInputElement>('zeno-form-input-name')!, nameData);
        userEvent.type(screen.queryByTestId<HTMLInputElement>('zeno-form-input-question')!, questionData);

        const submit = screen.queryByTestId<HTMLInputElement>('zeno-form-input-submit');
        expect(submit).toBeValid();
        expect(submit).toBeEnabled();

        userEvent.click(submit!);
        expect(submit).toBeDisabled();

        await waitFor(() => expect(submit).toBeEnabled(), { timeout: 500 });
    });
});