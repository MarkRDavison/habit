import React from 'react';
import { logger } from '@mark.davison/zeno-common'
import { 
    Form, 
    Errors, 
    Touched, 
    FormValidationReason, 
    ValidationResult, 
    Validate, 
    Required, 
    BaseForm, 
    BaseInput, 
    FormProps,
    BaseErrorMessage
} from '@mark.davison/zeno-common-client'

interface FormData {
    username: string
    password: string
}

const FormComponent = (props: FormProps<FormData>): JSX.Element => {
    return (
        <Form<FormData>
            initialValues={props.initialValues}
            required={props.required}
            validator={props.validator}
            handleSubmit={props.handleSubmit}
            afterSubmit={props.afterSubmit}>
            {props.children}
        </Form>
    );
};

const App = (): JSX.Element => {
    const initialData: FormData = {
        username: '',
        password: ''
    };
    const required: Required<FormData> = {
        username: false,
        password: false
    };

    const props: FormProps<FormData> = {
        initialValues: initialData,
        validator: (values: FormData, touched: Touched<FormData>, required: Touched<FormData>, reason: FormValidationReason): ValidationResult<FormData> => {
            return {
                errors: {
                    username: undefined,
                    password: undefined
                },
                required: required
            };
        },
        required: required,
        handleSubmit: (formData: FormData): Promise<boolean> => {
            logger.debug(`Handle Submit: ${JSON.stringify(formData)}`)
            return Promise.resolve(false)
        },
        afterSubmit: (success: boolean) => {
            logger.debug(`AfterSubmit: ${success}`)
        },
        children: (isSubmitting, invalidRequired) =>
        <BaseForm>
            <BaseInput type="text" name="username" disabled={isSubmitting} label="Username" />
            <BaseErrorMessage name="username" />
            <BaseInput type="password" name="password" disabled={isSubmitting} label="Password" />
            <BaseErrorMessage name="password" />
            <BaseInput type="submit" name="submit" label="Login" disabled={isSubmitting || invalidRequired}/>
            {invalidRequired ? <div data-testid='invalid-required-div' /> : <div/> }
        </BaseForm>
            
    }

    return (
        <div>
            {FormComponent(props)}
        </div>
    );
}

export default App;