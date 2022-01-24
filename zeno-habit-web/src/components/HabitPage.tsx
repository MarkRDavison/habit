import React from 'react';
import { DispatchType, RootState } from '../store/store';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Habit } from '../models/Habit';
import HabitOverviewSection from './habitSections/HabitOverviewSection';
import HabitScoreSection from './habitSections/HabitScoreSection';
import HabitHistorySection from './habitSections/HabitHistorySection';
import HabitCalendarSection from './habitSections/HabitCalendarSection';
import HabitBestStreaksSection from './habitSections/HabitBestStreaksSection';
import HabitFrequencySection from './habitSections/HabitFrequencySection';

interface StateProps {
    habit: Habit | undefined
}
interface DispatchProps {
    returnHome: () => void
}
interface OwnProps {

}
interface WithRouterProps extends RouteComponentProps<{ id: string }> {
}

type OwnRouterProps = OwnProps & WithRouterProps;

type Props = StateProps & DispatchProps & OwnRouterProps;

const _HabitPage: React.FC<Props> = (props: Props) => {

    const {
        returnHome,
        habit
    } = props;

    if (habit === undefined) {
        return null;
    }

    const colour = '#4dd0e1';

    return (
        <div data-testid='HabitPage'>
            <button
                data-testid='HabitPage_ReturnButton'
                onClick={returnHome}>{'<--'}</button>
            <h1>{habit.name}</h1>
            <h3>{habit.question}</h3>
            <HabitOverviewSection
                habit={habit}
                score={62}
                month={-23}
                year={23}
                total={5}
                colour={colour} />
            <HabitScoreSection />
            <HabitHistorySection />
            <HabitCalendarSection
                colour={colour}
                today={new Date(2022, 0, 19)} />
            <HabitBestStreaksSection />
            <HabitFrequencySection />
        </div>
    );
};

const mapStateToProps = (state: RootState, props: OwnRouterProps): StateProps => {
    const habitId = props.match.params.id;
    return {
        habit: state.habitState.habits.find(h => h.id == habitId)
    };
};

const mapDispatchToProps = (dispatch: DispatchType, props: OwnRouterProps): DispatchProps => {
    return {
        returnHome: (): void => props.history.push('/')
    };
}

const HabitPage = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(_HabitPage));
export default HabitPage;