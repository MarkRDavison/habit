import { Habit } from '@/models/Habit';
import { OccurenceCreationProps } from '@/models/Occurence';
import occurenceService from '@/services/occurenceService';
import { setOccurencesAdded, setOccurencesProgressing } from '@/store/occurenceReducer';
import { DispatchType } from '@/store/store';
import { logger } from '@mark.davison/zeno-common';
import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogTitle, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

interface StateProps {

}

interface DispatchProps {
    submitAddEntry: (occurence: OccurenceCreationProps) => Promise<boolean>
}

interface OwnProps {
    habit: Habit
    onClose: () => void
    open: boolean
}

type OwnRouterProps = OwnProps & RouteComponentProps;

type Props = StateProps & DispatchProps & OwnRouterProps;

const _AddEntryDialog: React.FC<Props> = (props: Props) => {
    const [submitting, setSubmitting] = useState(false);
    const [date, setDate] = useState('');

    const submit = async (): Promise<void> => {
        setSubmitting(true);
        let success = false;

        /* istanbul ignore next */
        if (date === null) {
            return;
        }
        
        const parsedDate = new Date(date);
        const occurenceDate = new Date(Date.UTC(
            parsedDate.getFullYear(),
            parsedDate.getMonth(),
            parsedDate.getDate()
        ));

        try {
            await props.submitAddEntry({
                habitId: props.habit.id,
                occurenceDate: occurenceDate
            });
            success = true;
        }
        catch (e) {
            logger.error(e);
        }
        setSubmitting(false);
        if (success) {
            props.onClose();
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setDate(e.target.value);
        e.preventDefault();
    };

    return (
        <Dialog
            data-testid='AddEntryDialog'
            open={props.open}
            onClose={props.onClose}>
            <DialogTitle>Add Entry</DialogTitle>
            <Box position="absolute" top={0} right={0}>
                <IconButton data-testid='AddEntryDialog_CloseButton' onClick={props.onClose}>
                    <Close />
                </IconButton>
            </Box>
            <div>
                <input
                    data-testid='AddEntryDialog_DateInput' 
                    type="date" 
                    value={date} 
                    onChange={onChange} />
            </div>
            <DialogActions>
                <Button data-testid='AddEntryDialog_Cancel' color="secondary" onClick={props.onClose}>Cancel</Button>
                <Button data-testid='AddEntryDialog_Submit' type='submit' onClick={submit} disabled={submitting || date === null || date.length === 0} color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
};

const mapDispatchToProps = (dispatch: DispatchType, props: OwnRouterProps): DispatchProps => {
    return {
        submitAddEntry: async (occurence: OccurenceCreationProps): Promise<boolean> => {
            dispatch(setOccurencesProgressing());
            const newOccurence = await occurenceService.postOccurence(occurence);
            dispatch(setOccurencesAdded([newOccurence]));
            return true;
        }
    };
}

const AddEntryDialog = withRouter(connect(
    null,
    mapDispatchToProps
)(_AddEntryDialog));
export default AddEntryDialog;