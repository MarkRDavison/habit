import React from 'react';
import { DispatchType, RootState } from '../../store/store';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Card, Typography } from '@mui/material';

interface StateProps {

}
interface DispatchProps {

}
interface OwnProps {
    today: Date
    colour: string // TODO: Comes from habit?
}
interface WithRouterProps extends RouteComponentProps {
}

type OwnRouterProps = OwnProps & WithRouterProps;

type Props = StateProps & DispatchProps & OwnRouterProps;

const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getNumberOfDays = (year: number, month: number): number => {
    return 40 - new Date(year, month, 40).getDate();
}
interface HistoryThing {
    year: number
    month: number
    monthS: string
    day: number
    dayS: string
}
export const getCalendarHistory = (lastDay: Date, weeksBack: number): HistoryThing[] => {
    const dayLast = lastDay.getDay();
    const dayOfMonth = lastDay.getDate();
    let month = lastDay.getMonth();
    let year = lastDay.getFullYear();

    const history: HistoryThing[] = [];

    let iter = 0;
    for (let weirdWeekDayIndex = dayLast; weirdWeekDayIndex >= 0; weirdWeekDayIndex--) {
        history.push({
            year: year,
            month: month,
            monthS: monthMap[month],
            day: dayOfMonth - iter,
            dayS: daysMap[weirdWeekDayIndex]
        });
        iter++;
    }

    let dayOffset = -iter;
    for (let weekOffset = 0; weekOffset < weeksBack - 1; weekOffset++) {
        for (let dayOfWeek = 6; dayOfWeek >= 0; dayOfWeek--) {
            const day = dayOfMonth - 7 * weekOffset - 6 + dayOfWeek;
            if (day + dayOffset === 0) {
                month--;
                if (month < 0) {
                    month += 12;
                    year--;
                }
                const daysInMonth = getNumberOfDays(year, month);
                dayOffset += daysInMonth;
            }
            history.push({
                year: year,
                month: month,
                monthS: monthMap[month],
                day: day + dayOffset,
                dayS: daysMap[dayOfWeek]
            });
        }
    }

    return history;
}

interface CellData {
    day: number,
    month: number,
    year: number,
    valid: boolean
}

const calendarControl = (
    date: Date,
    colour: string
): JSX.Element => {
    // TODO: Get the width of the 3 letter days etc and replace the magic 90
    const cellWidth = 24;
    const weeks = parseInt(((window.innerWidth - 90) / (cellWidth + 4)).toFixed());

    const monthDetails = getCalendarHistory(date, weeks);

    const columns = weeks;
    const rows = 7;

    const missing = rows - (monthDetails.length % rows);
    const invalidColor = '#999999';

    const proper = (): JSX.Element => {

        const outputGrid: CellData[][] = [];

        for (let y = 0; y < rows; y++) {
            outputGrid.push([]);
            for (let x = 0; x < columns; x++) {
                outputGrid[y].push({
                    day: 0,
                    month: 0,
                    year: 0,
                    valid: Math.random() < 0.5
                });
            }
        }

        let ii = 1;
        for (let xx = weeks - 1; xx >= 0; xx--) {
            for (let yy = rows - 1; yy >= 0; yy--) {
                if (ii > missing) {
                    outputGrid[yy][xx].day = monthDetails[ii - missing - 1].day;
                    outputGrid[yy][xx].month = monthDetails[ii - missing - 1].month;
                    outputGrid[yy][xx].year = monthDetails[ii - missing - 1].year;
                }
                ii++;
            }
        }

        let keyY = 0;
        let keyX = 0;
        return (
            <tbody>
                {
                    outputGrid.map(row => (
                        <tr key={keyY++}>
                            {row.map(cell => <th key={keyY * rows + keyX++}>
                                <div style={{
                                    width: cellWidth,
                                    height: cellWidth,
                                    background: cell.day > 0 ? (cell.valid ? colour : invalidColor) : 'transparent'
                                }}>
                                    {cell.day > 0 ? cell.day : null}
                                </div>
                            </th>)}
                            <th key={`dow-${keyY}`}>
                                <div style={{
                                    marginLeft: 10,
                                    fontWeight: 'bold'
                                }}>
                                    {daysMap[keyY - 1].slice(0, 3).toUpperCase()}
                                </div>
                            </th>
                        </tr>
                    ))
                }
            </tbody >
        );
    };

    return (
        <div
            data-testid='HabitOverviewSection_Calendar'>
            <table>
                {proper()}
            </table>
        </div>
    );
};

const _HabitCalendarSection: React.FC<Props> = (props: Props) => {
    const {
        colour,
        today
    } = props;

    return (
        <Card
            data-testid='HabitCalendarSection'
            variant='outlined'
            style={{
                margin: '2px',
                padding: '10px',
                background: '#cecece',
                borderColor: '#363636',
                borderWidth: 1
            }}>
            <Typography color={colour} gutterBottom>
                Calendar
            </Typography>
            <div>
                {calendarControl(today, colour)}
            </div>
        </Card>
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

const HabitCalendarSection = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(_HabitCalendarSection));
export default HabitCalendarSection;