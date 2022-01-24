import { Alert, alertReducer, clearAlert, setErrorAlert, setInfoAlert, setSuccessAlert, setWarningAlert } from "../../src/store/alertReducer";

describe('alertReducer', () => {

    test('clearAlert has no message and clear status', () => {
        const state = alertReducer(undefined, clearAlert());

        expect(state.message).toBe(undefined);
        expect(state.type).toBe(Alert.Clear);
    });

    test('setWarningAlert sets message and warning status', () => {
        const msg = 'Warning message';
        const payload = setWarningAlert(msg);

        const state = alertReducer(undefined, payload);

        expect(state.message).toBe(msg);
        expect(state.type).toBe(Alert.Warning);
    });

    test('setErrorAlert sets message and Error status', () => {
        const msg = 'Error message';
        const payload = setErrorAlert(msg);

        const state = alertReducer(undefined, payload);

        expect(state.message).toBe(msg);
        expect(state.type).toBe(Alert.Error);
    });

    test('setInfoAlert sets message and Info status', () => {
        const msg = 'Info message';
        const payload = setInfoAlert(msg);

        const state = alertReducer(undefined, payload);

        expect(state.message).toBe(msg);
        expect(state.type).toBe(Alert.Info);
    });

    test('setSuccessAlert sets message and Success status', () => {
        const msg = 'Success message';
        const payload = setSuccessAlert(msg);

        const state = alertReducer(undefined, payload);

        expect(state.message).toBe(msg);
        expect(state.type).toBe(Alert.Success);
    });

});
