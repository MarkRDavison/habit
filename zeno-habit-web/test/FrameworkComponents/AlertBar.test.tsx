import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import AlertBar from '../../src/FrameworkComponents/AlertBar';
import { RootState } from '../../src/store/store';
import { Alert, clearAlert, setErrorAlert, setInfoAlert, setSuccessAlert, setWarningAlert } from '../../src/store/alertReducer';
import { AnyAction, Store } from 'redux';
import createHabitStore from '../../src/store/store';
import userEvent from '@testing-library/user-event';

describe('AlertBar', () => {
    let localStore: Store<RootState, AnyAction>;

    beforeEach(() => {
        localStore = createHabitStore();
    });

    test('is not visible when alert state type is Clear', () => {
        localStore.dispatch(clearAlert());
        const { queryByTestId } = render(
            <Provider store={localStore}>
                <AlertBar />
            </Provider>
        );

        const alertBar = queryByTestId('AlertBar');
        expect(alertBar).toBeNull();
    });

    test('is visible when alert state type is Success', () => {
        const msg = 'SUCCESS MESSAGE';
        localStore.dispatch(setSuccessAlert(msg));
        const { queryByTestId } = render(
            <Provider store={localStore}>
                <AlertBar />
            </Provider>
        );

        const alertBar = queryByTestId('AlertBar');
        expect(alertBar).toBeValid();
        expect(alertBar).toHaveTextContent(msg);
    });

    test('is visible when alert state type is Info', () => {
        const msg = 'INFO MESSAGE';
        localStore.dispatch(setInfoAlert(msg));
        const { queryByTestId } = render(
            <Provider store={localStore}>
                <AlertBar />
            </Provider>
        );

        const alertBar = queryByTestId('AlertBar');
        expect(alertBar).toBeValid();
        expect(alertBar).toHaveTextContent(msg);
    });

    test('is visible when alert state type is Warning', () => {
        const msg = 'WARNING MESSAGE';
        localStore.dispatch(setWarningAlert(msg));
        const { queryByTestId } = render(
            <Provider store={localStore}>
                <AlertBar />
            </Provider>
        );

        const alertBar = queryByTestId('AlertBar');
        expect(alertBar).toBeValid();
        expect(alertBar).toHaveTextContent(msg);
    });

    test('is visible when alert state type is Error', () => {
        const msg = 'ERROR MESSAGE';
        localStore.dispatch(setErrorAlert(msg));
        const { queryByTestId } = render(
            <Provider store={localStore}>
                <AlertBar />
            </Provider>
        );

        const alertBar = queryByTestId('AlertBar');
        expect(alertBar).toBeValid();
        expect(alertBar).toHaveTextContent(msg);
    });

    test('dismiss alert button dismisses the alert', async () => {
        const msg = 'INFO MESSAGE';
        localStore.dispatch(setInfoAlert(msg));
        const { queryByTestId } = render(
            <Provider store={localStore}>
                <AlertBar />
            </Provider>
        );

        const alertBarDismissButton = queryByTestId('AlertBarDismissButton');
        expect(alertBarDismissButton).toBeValid();

        await userEvent.click(alertBarDismissButton!);

        const rootState: RootState = localStore.getState();
        expect(rootState.alertState.message).toBeUndefined();
        expect(rootState.alertState.type).toBe(Alert.Clear);
    });


});