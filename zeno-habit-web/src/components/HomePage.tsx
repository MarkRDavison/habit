import React, { useEffect } from 'react';
import * as zc from '@mark.davison/zeno-common';
import * as zcc from '@mark.davison/zeno-common-client';
import { DispatchType, RootState } from '../store/store';
import { connect } from 'react-redux';
import { HabitState, setHabitsFetched, setHabitsProgressing } from '../store/habitReducer';
import HomePageHabitSummary from './HomePageHabitSummary';
import CreateHabitDialog from './CreateHabitDialog';
import habitService from '../services/habitService';
import { Switch, Typography } from '@mui/material';
import { setOccurencesFetched, setOccurencesProgressing } from '../store/occurenceReducer';
import occurenceService from '../services/occurenceService';
import Constants from '../models/Helpers';

interface StateProps {
    habitState: HabitState
}
interface DispatchProps {
    fetchHabitsWithNOccurence: () => Promise<void>
}
interface OwnProps {

}

type Props = StateProps & DispatchProps & OwnProps;
const _HomePage: React.FC<Props> = (props: Props) => {
    const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
    const [fetched, setFetched] = React.useState<boolean>(false);
    const [showArchived, setShowArchived] = React.useState<boolean>(false);
    const {
        user,
        logout
    } = zcc.useAuth();
    const {
        habitState,
        fetchHabitsWithNOccurence
    } = props;

    /* istanbul ignore next */
    useEffect(() => {
        if (!fetched) {
            setFetched(true);
            fetchHabitsWithNOccurence().then().catch(zc.logger.error)
        }
    }, [fetched, setFetched, habitState, fetchHabitsWithNOccurence]);

    /* istanbul ignore next */
    const closeDialog = (): void => setDialogOpen(false);
    const openDialog = (): void => setDialogOpen(true);


    if (user === null) {
        return (<React.Fragment></React.Fragment>);
    }

    const days = 5;
    const now = new Date();
    let daysArray: {
        dayS: string,
        day: number
    }[] = [];

    for (let iter = 0; iter < days; iter++) {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - iter);

        daysArray = daysArray.concat({
            dayS: Constants.DaysMap[date.getDay()].slice(0, 3),
            day: date.getDate()
        });
    }
 
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setShowArchived(event.target.checked);
    };

    return (
        <div data-testid='HomePage'>
            <h1>HOME</h1>
            <button data-testid='HomePage_LOGOUT' onClick={logout}>LOGOUT</button>
            <button data-testid='HomePage_AddHabit' onClick={openDialog}>ADD HABIT</button>
            <div>{user.name}</div>
            <Switch data-testid='HomePage_SwitchShowArchived' checked={showArchived} onChange={handleChange} name="checked" />
            <p>^^ SHOW ARCHIVED</p>
            <div>There are {habitState.habits.filter(_ => !_.archived || showArchived).length} habits</div>
            <div style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                justifyContent: 'flex-start'
            }}>
                {
                    daysArray.map(d => (
                        <div data-testid={`HomePageHabitSummary_Recent_${d.day}`} key={d.day} style={{
                            margin: 10
                        }}>
                            <Typography
                                sx={{ fontWeight: 'bold' }}
                                data-testid=''>
                                {d.dayS}
                            </Typography>
                            <Typography
                                data-testid=''
                                color="text.secondary">
                                {d.day}
                            </Typography>
                        </div>
                    ))
                }
            </div>
            {
                habitState.habits.filter(_ => !_.archived || showArchived).map(h => (
                    <HomePageHabitSummary habitId={h.id} key={h.id} colour={'#CC2244'} />
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
        fetchHabitsWithNOccurence: async (): Promise<void> => {
            dispatch(setHabitsProgressing());
            dispatch(setOccurencesProgressing());
            const habits = await habitService.getHabits();
            const habitIds = habits.map(h => h.id);
            const today = new Date();
            const start = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDay() - 5);
            const occurences = await occurenceService.getOccurencesWithinDateRange(habitIds, start, today);
            dispatch(setHabitsFetched(habits));
            dispatch(setOccurencesFetched(occurences));
        }
    };
}

const HomePage = connect(
    mapStateToProps,
    mapDispatchToProps
)(_HomePage);
export default HomePage;