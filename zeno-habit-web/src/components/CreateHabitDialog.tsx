import * as zcc from '@mark.davison/zeno-common-client';
import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { Habit } from '../models/Habit';
import Constants from '../models/Helpers';
import habitService from '../services/habitService';
import { setHabitsAdded, setHabitsProgressing } from '../store/habitReducer';
import { DispatchType } from '../store/store';

interface StateProps {

}
interface DispatchProps {
    habitAdding: (habit: Habit) => Promise<Habit>
}
interface OwnProps {
    onClose?: () => void
    open: boolean
}

interface CreateHabitFormData {
    name: string
    question: string
}
interface CreateHabitFormResponse {
    habit: Habit
}

type OwnRouterProps = OwnProps & RouteComponentProps;

type Props = StateProps & DispatchProps & OwnRouterProps;


const _CreateHabitDialog: React.FC<Props> = (props: Props) => {
    const [navigation, setNavigation] = useState<string | undefined>(undefined);
    const {
        user
    } = zcc.useAuth();

    if (user === null) {
        return (<React.Fragment></React.Fragment>);
    }

    if (navigation) {
        return (<Redirect to={navigation} />);
    }

    const handleSubmitCreateHabit = async (values: CreateHabitFormData, user: zcc.UserProfile): Promise<{ success: boolean, response: CreateHabitFormResponse }> => {
        const newHabit = await props.habitAdding({
            id: Constants.EmptyGuid,
            createdDate: `${new Date().getUTCDate()}`,
            createdByUserId: user.sub,
            name: values.name,
            question: values.question
        });
        return {
            success: true,
            response: {
                habit: newHabit
            }
        };
    };

    const validator: zcc.Validate<CreateHabitFormData> =
        (_values, _touched, required, _reason): zcc.ValidationResult<CreateHabitFormData> => {
            return {
                errors: {
                    name: undefined,
                    question: undefined
                },
                required: required
            };
        };
    const afterSubmit = (success: boolean, response: CreateHabitFormResponse): void => {
        if (success) {
            setNavigation(`/habit/${response.habit.id}`);
        }
    };
    const initialValues: CreateHabitFormData = {
        name: '',
        question: ''
    };
    const required: zcc.Required<CreateHabitFormData> = {
        name: true,
        question: true
    };
    return (
        <Dialog
            data-testid='CreateHabitDialog'
            open={props.open}
            onClose={props.onClose}>
            <DialogTitle>Create Habit</DialogTitle>
            <Box position="absolute" top={0} right={0}>
                <IconButton onClick={props.onClose}>
                    <Close />
                </IconButton>
            </Box>
            <zcc.Form<CreateHabitFormData, CreateHabitFormResponse>
                initialValues={initialValues}
                validator={validator}
                afterSubmit={afterSubmit}
                handleSubmit={(v): Promise<{ success: boolean, response: CreateHabitFormResponse }> => handleSubmitCreateHabit(v, user)}
                required={required} >
                {(isSubmitting, invalidRequired): React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> =>
                    <zcc.BaseForm>
                        <DialogContent>
                            <zcc.BaseInput type='text' name='name' disabled={isSubmitting} label='Name' />
                            <zcc.BaseErrorMessage name="name" />
                            <zcc.BaseInput type='text' name='question' disabled={isSubmitting} label='Question' />
                            <zcc.BaseErrorMessage name='question' />
                        </DialogContent>
                        <DialogActions>
                            <Button data-testid='zeno-form-input-cancel' color="secondary" onClick={props.onClose}>Cancel</Button>
                            <Button data-testid='zeno-form-input-submit' type='submit' disabled={isSubmitting || invalidRequired} color="primary">Add</Button>
                        </DialogActions>
                    </zcc.BaseForm>
                }
            </zcc.Form>
        </Dialog>
    );
};

const mapDispatchToProps = (dispatch: DispatchType): DispatchProps => {
    return {
        habitAdding: async (habit: Habit): Promise<Habit> => {
            dispatch(setHabitsProgressing());
            const newHabit = await habitService.postHabit(habit);
            dispatch(setHabitsAdded([newHabit]));
            return newHabit;
        }
    };
}

const CreateHabitDialog = withRouter(connect(
    null,
    mapDispatchToProps
)(_CreateHabitDialog));
export default CreateHabitDialog;