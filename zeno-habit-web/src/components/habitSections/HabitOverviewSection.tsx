import React from 'react';
import { DispatchType, RootState } from '../../store/store';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Card, CircularProgress, Typography } from '@mui/material';
import { Habit } from '../../models/Habit';

interface StateProps {
    loading: boolean
}
interface DispatchProps {

}
interface OwnProps {
    habit: Habit
    score?: number
    month?: number
    year?: number
    total?: number
    colour: string // TODO: Comes from habit?
}
interface WithRouterProps extends RouteComponentProps {
}

type OwnRouterProps = OwnProps & WithRouterProps;

type Props = StateProps & DispatchProps & OwnRouterProps;

const progress = (loading: boolean, score: number | undefined, colour: string): JSX.Element => {
    return (
        <div style={{
            display: 'grid'
        }}>
            <CircularProgress
                data-testid='HabitOverviewSection_ProgressBackground'
                variant={loading ? 'indeterminate' : 'determinate'}
                value={100}
                sx={{
                    color: '#7e7e7e',
                    offsetPosition: -40,
                    gridColumn: 1,
                    gridRow: 1
                }} />
            {!loading && <CircularProgress
                data-testid='HabitOverviewSection_ProgressForeground'
                variant="determinate"
                value={score}
                sx={{
                    color: colour,
                    gridColumn: 1,
                    gridRow: 1
                }} />
            }
        </div>
    );
};

const getNumberText = (
    loading: boolean,
    signed: boolean,
    score: number | undefined,
    percentage: boolean
): string => {
    if (loading || score === undefined) {
        return String.fromCharCode(parseInt('U+2000', 16)); // TODO: BADDDDDD
    }
    const sign = (signed && score > 0)
        ? '+'
        : '';
    const suffix = percentage
        ? '%'
        : '';
    return `${sign}${score}${suffix}`;
};
const overviewSection = (
    loading: boolean,
    score: number | undefined,
    colour: string,
    signed: boolean,
    percentage: boolean,
    label: string
): JSX.Element => (
    <div>
        <Typography
            sx={{ fontWeight: 'bold' }}
            data-testid={`HabitOverviewSection_Value_${label}`}
            color={colour}>{getNumberText(loading, signed, score, percentage)}
        </Typography>
        <Typography
            data-testid={`HabitOverviewSection_Label_${label}`}
            color="text.secondary">
            {label}
        </Typography>
    </div>
);

const _HabitOverviewSection: React.FC<Props> = (props: Props) => {
    const {
        loading,
        score,
        month,
        year,
        total,
        colour
    } = props;

    return (
        <Card
            data-testid='HabitOverviewSection'
            variant='outlined'
            style={{
                margin: '2px',
                padding: '10px',
                background: '#cecece',
                borderColor: '#363636',
                borderWidth: 1
            }}>
            <Typography color={colour} gutterBottom>
                Overview
            </Typography>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly'
                }}>
                {progress(loading, score, colour)}
                {overviewSection(loading, score, colour, false, true, 'Score')}
                {overviewSection(loading, month, colour, true, true, 'Month')}
                {overviewSection(loading, year, colour, true, true, 'Year')}
                {overviewSection(loading, total, colour, false, false, 'Total')}
            </div>
        </Card>
    );
};

const mapStateToProps = (state: RootState, props: OwnRouterProps): StateProps => {
    return {
        // TODO: this needs to look at an enhanced habit view, not just the habit
        loading: state.habitState.habits.find(h => h.id === props.habit.id) === undefined
    };
};

const mapDispatchToProps = (dispatch: DispatchType, props: OwnRouterProps): DispatchProps => {
    return {

    };
}

const HabitOverviewSection = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(_HabitOverviewSection));
export default HabitOverviewSection;