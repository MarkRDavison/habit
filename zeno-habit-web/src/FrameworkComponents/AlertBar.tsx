import React from 'react';
import { connect } from 'react-redux';
import { Alert, AlertActionTypes, AlertState, clearAlert } from '../store/alertReducer';
import { DispatchType, RootState } from '../store/store';

interface StateProps {
    alertState: AlertState
}
interface DispatchProps {
    dismissAlert: () => void
}

type Props = StateProps & DispatchProps;

const getStyle = (alert: Alert): React.CSSProperties => {
    let backgroundColour: string;
    switch (alert) {
        case Alert.Success:
            backgroundColour = '#00FF00';
            break;
        case Alert.Info:
            backgroundColour = '#ADD8E6';
            break;
        case Alert.Warning:
            backgroundColour = '#FFFF00';
            break;
        case Alert.Error:
            backgroundColour = '#FF0000';
            break;
        /* istanbul ignore next */
        default:
            backgroundColour = '#000000';
            break;
    }
    return {
        background: backgroundColour
    };
}

const _AlertBar: React.FC<Props> = (props: Props) => {
    const {
        alertState,
        dismissAlert
    } = props;

    if (alertState.type === Alert.Clear) {
        return null;
    }

    return (
        <div data-testid='AlertBar' style={getStyle(alertState.type)}>
            <div>{alertState.message}</div>
            <button
                onClick={dismissAlert}
                data-testid='AlertBarDismissButton'>x</button>
        </div>
    );
};

const mapStateToProps = (state: RootState): StateProps => {
    return {
        alertState: state.alertState
    };
};

const mapDispatchToProps = (dispatch: DispatchType): DispatchProps => {
    return {
        dismissAlert: (): AlertActionTypes => dispatch(clearAlert())
    };
}

const AlertBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(_AlertBar);
export default AlertBar;