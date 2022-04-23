import { logger } from '@mark.davison/zeno-common';
import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import React, { useState } from 'react';

interface OwnProps {
    onClose: () => void
    deleteCallback: () => Promise<boolean>
    open: boolean
    entityType: string
    entityName: string
}

type Props = OwnProps;

const _DeleteConfirmationDialog: React.FC<Props> = (props: Props) => {
    const [submitting, setSubmitting] = useState(false);

    const submit = async (): Promise<void> => {
        setSubmitting(true);
        let success = false;

        try {
            success = await props.deleteCallback();
        }
        catch (e) {
            logger.error(e);
        }
        setSubmitting(false);
        if (success) {
            props.onClose();
        }
    };

    return (
        <Dialog
            data-testid='DeleteConfirmationDialog'
            open={props.open}
            onClose={props.onClose}>
            <DialogTitle>Delete {props.entityType}</DialogTitle>
            <Box position="absolute" top={0} right={0}>
                <IconButton data-testid='DeleteConfirmationDialog_CloseButton' onClick={props.onClose}>
                    <Close />
                </IconButton>
            </Box>
            <DialogContentText
                data-testid='DeleteConfirmationDialog_DialogContentText'>
                Are you sure you want to delete {props.entityName}?
            </DialogContentText>
            <DialogActions>
                <Button data-testid='DeleteConfirmationDialog_Cancel' color="secondary" onClick={props.onClose}>Cancel</Button>
                <Button data-testid='DeleteConfirmationDialog_Delete' type='submit' onClick={submit} disabled={submitting} color="primary">Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

const DeleteConfirmationDialog = _DeleteConfirmationDialog;
export default DeleteConfirmationDialog;