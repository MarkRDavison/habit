import { Card, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Habit } from '../models/Habit';
import { DispatchType, RootState } from '../store/store';
import DoneIcon from '@mui/icons-material/Done';
import { Occurence, OccurenceCreationProps } from '../models/Occurence';
import { setOccurencesAdded, setOccurencesProgressing } from '../store/occurenceReducer';
import occurenceService from '../services/occurenceService';
import Constants from '../models/Helpers';

interface StateProps {
    habit: Habit | undefined
    occurences: Occurence[]
}
interface DispatchProps {
    openHabit: (id: string) => void
    postOccurence: (occurence: OccurenceCreationProps) => Promise<void>
}
interface OwnProps {
    habitId: string
    colour: string
}

type OwnRouterProps = OwnProps & RouteComponentProps;

type Props = StateProps & DispatchProps & OwnRouterProps;

const progress = (score: number | undefined, colour: string): JSX.Element => {
    const thickness = 6;
    const size = 24;
    return (
        <div style={{
            display: 'grid'
        }}>
            <CircularProgress
                data-testid='HomePageHabitSummary_ProgressBackground'
                variant={'determinate'}
                thickness={thickness}
                size={size}
                value={100}
                sx={{
                    color: '#7e7e7e',
                    offsetPosition: -40,
                    gridColumn: 1,
                    gridRow: 1
                }} />
            <CircularProgress
                data-testid='HomePageHabitSummary_ProgressForeground'
                variant="determinate"
                thickness={thickness}
                size={size}
                value={score}
                sx={{
                    color: colour,
                    gridColumn: 1,
                    gridRow: 1
                }} />
        </div>
    );
};

const _HomePageHabitSummary: React.FC<Props> = (props: Props) => {
    const {
        habit,
        occurences,
        openHabit,
        postOccurence,
        colour
    } = props;

    const days = 5;
    const now = new Date();
    let daysArray: {
        dayS: string,
        date: Date,
        occurence: Occurence | undefined
    }[] = [];

    for (let iter = 0; iter < days; iter++) {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - iter);
        const existingOccurence = occurences.find(o => {
            return o.occurenceDate.getFullYear() === date.getFullYear() &&
                o.occurenceDate.getMonth() === date.getMonth() &&
                o.occurenceDate.getDate() === date.getDate();
        });
        daysArray = daysArray.concat({
            dayS: Constants.DaysMap[date.getDay()].slice(0, 3),
            date: date,
            occurence: existingOccurence
        });
    }

    if (habit === undefined) {
        return null;
    }

    const onOccurenceClicked = async (habitId: string, occurence: Occurence | undefined, date: Date): Promise<void> => {
        if (occurence === undefined) {
            const newOccurence: OccurenceCreationProps = {
                habitId: habitId,
                occurenceDate: new Date(Date.UTC(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                ))
            };
            await postOccurence(newOccurence)
        }
    }

    return (
        <Card
            
            variant='outlined'
            style={{
                margin: '2px',
                padding: '10px',
                background: '#cecece',
                borderColor: '#363636',
                borderWidth: 1
            }}>
            <div
                data-testid={`HomePageHabitSummary_${habit.id}`}
                onClick={(): void => openHabit(habit.id)}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                {progress(60, colour)}
                <Typography color={colour} gutterBottom>
                    {habit.name}
                </Typography>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                justifyContent: 'flex-start'
            }}>
                {
                    daysArray.map(d => (
                        <div
                            data-testid={`HomePageHabitSummary_Recent_${d.date.getDate()}`}
                            key={d.date.getDate()}
                            onClick={async (): Promise<void> => onOccurenceClicked(habit.id, d.occurence, d.date)}
                            style={{
                            margin: 10
                        }}>
                            <DoneIcon                                
                                fontSize='medium'
                                htmlColor={d.occurence !== undefined ? colour : 'grey'} />
                        </div>
                    ))
                }
            </div>
        </Card>
    );
};

const mapStateToProps = (state: RootState, props: OwnRouterProps): StateProps => {
    return {
        habit: state.habitState.habits.find(h => h.id == props.habitId),
        occurences: state.occurenceState.occurences.filter(o => o.habitId == props.habitId)
    };
};

const mapDispatchToProps = (dispatch: DispatchType, props: OwnRouterProps): DispatchProps => {
    return {
        openHabit: (id: string): void => props.history.push(`/habit/${id}`),
        postOccurence: async (occurence: OccurenceCreationProps): Promise<void> => {
            dispatch(setOccurencesProgressing())
            const newOccurence = await occurenceService.postOccurence(occurence);
            dispatch(setOccurencesAdded([newOccurence]))
        }
    };
}
const HomePageHabitSummary = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(_HomePageHabitSummary));
export default HomePageHabitSummary;