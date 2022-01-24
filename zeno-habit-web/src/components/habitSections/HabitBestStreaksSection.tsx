import React from 'react';
import { DispatchType, RootState } from '../../store/store';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

interface StateProps {

}
interface DispatchProps {

}
interface OwnProps {

}
interface WithRouterProps extends RouteComponentProps {
}

type OwnRouterProps = OwnProps & WithRouterProps;

type Props = StateProps & DispatchProps & OwnRouterProps;

const _HabitBestStreaksSection: React.FC<Props> = (props: Props) => {
    return (
        <div data-testid='HabitBestStreaksSection'>
            <h1>HabitBestStreaksSection</h1>
        </div>
    );
};

const mapStateToProps = (state: RootState, props: OwnRouterProps): StateProps => {
    return {

    };
};

const mapDispatchToProps = (dispatch: DispatchType, props: OwnRouterProps): DispatchProps => {
    return {

    };
}

const HabitBestStreaksSection = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(_HabitBestStreaksSection));
export default HabitBestStreaksSection;