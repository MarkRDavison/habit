import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Habit } from '../models/Habit';
import { DispatchType, RootState } from '../store/store';

interface StateProps {
    habit: Habit | undefined
}
interface DispatchProps {
    openHabit: (id: string) => void
}
interface OwnProps {
    habitId: string
}

type OwnRouterProps = OwnProps & RouteComponentProps;

type Props = StateProps & DispatchProps & OwnRouterProps;

const _HomePageHabitSummary: React.FC<Props> = (props: Props) => {
    const {
        habit,
        openHabit
    } = props;

    if (habit === undefined) {
        return null;
    }

    return (
        <div
            style={{
                background: '#cccccc',
                border: '2px solid #665566',
                width: '100%'
            }}
            data-testid={`HomePageHabitSummary_${habit.id}`}
            onClick={(): void => openHabit(habit.id)}>
            {habit.name}
        </div>
    );
};

const mapStateToProps = (state: RootState, props: OwnRouterProps): StateProps => {
    return {
        habit: state.habitState.habits.find(h => h.id == props.habitId)
    };
};

const mapDispatchToProps = (dispatch: DispatchType, props: OwnRouterProps): DispatchProps => {
    return {
        openHabit: (id: string): void => props.history.push(`/habit/${id}`)
    };
}
const HomePageHabitSummary = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(_HomePageHabitSummary));
export default HomePageHabitSummary;