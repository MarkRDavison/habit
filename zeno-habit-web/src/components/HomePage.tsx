import React, { useEffect } from 'react';
import * as zc from '@mark.davison/zeno-common';
import * as zcc from '@mark.davison/zeno-common-client';
import { DispatchType, RootState } from '../store/store';
import { connect } from 'react-redux';
import { HabitState, setHabitsFetched, setHabitsProgressing } from '../store/habitReducer';
import HomePageHabitSummary from './HomePageHabitSummary';
import CreateHabitDialog from './CreateHabitDialog';
import habitService from '../services/habitService';

interface StateProps {
    habitState: HabitState
}
interface DispatchProps {
    fetchHabits: () => Promise<void>
}
interface OwnProps {

}

type Props = StateProps & DispatchProps & OwnProps;

const _HomePage: React.FC<Props> = (props: Props) => {
    const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
    const {
        user,
        logout
    } = zcc.useAuth();
    const {
        habitState,
        fetchHabits
    } = props;


    /* istanbul ignore next */
    useEffect(() => {
        // TODO: Need to have some way of saying yes i've fetched and there's nothing!
        if (!habitState.progressing && habitState.habits.length === 0) {
            fetchHabits().catch(zc.logger.error)
        }
    }, [habitState, fetchHabits]);

    /* istanbul ignore next */
    const closeDialog = (): void => setDialogOpen(false);
    const openDialog = (): void => setDialogOpen(true);


    if (user === null) {
        return (<React.Fragment></React.Fragment>);
    }

    return (
        <div data-testid='HomePage'>
            <h1>HOME</h1>
            <button data-testid='HomePage_LOGOUT' onClick={logout}>LOGOUT</button>
            <button data-testid='HomePage_AddHabit' onClick={openDialog}>ADD HABIT</button>
            <div>{user.name}</div>
            <div>There are {habitState.habits.length} habits</div>
            {
                habitState.habits.map(h => (
                    <HomePageHabitSummary habitId={h.id} key={h.id} />
                ))
            }
            <CreateHabitDialog open={dialogOpen} onClose={closeDialog} />
        </div>
    );
};

const mapStateToProps = (state: RootState): StateProps => {
    return {
        habitState: state.habitState
    };
};
/* istanbul ignore next */
const mapDispatchToProps = (dispatch: DispatchType): DispatchProps => {
    return {
        fetchHabits: async (): Promise<void> => {
            dispatch(setHabitsProgressing());
            const habits = await habitService.getHabits();
            dispatch(setHabitsFetched(habits));
        }
    };
}

const HomePage = connect(
    mapStateToProps,
    mapDispatchToProps
)(_HomePage);
export default HomePage;