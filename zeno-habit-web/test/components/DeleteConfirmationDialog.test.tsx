import React from "react";
import { render, screen } from '@testing-library/react';
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

jest.mock('@mark.davison/zeno-common', () => {
    return {
        logger: {
            trace: (text: unknown, ...params: unknown[]) => {},
            debug: (text: unknown, ...params: unknown[]) => {},
            info: (text: unknown, ...params: unknown[]) => {},
            warn: (text: unknown, ...params: unknown[]) => {},
            error: (text: unknown, ...params: unknown[]) => {}
        }
    }
});

describe('DeleteConfirmationDialog', () =>{

    const renderComponentUnderTest = (
        entityName: string,
        entityType: string,
        open: boolean,
        onClose: () => void,
        deleteCallback: () => Promise<boolean>
        ) => render(
        <div>
            <DeleteConfirmationDialog
                entityName={entityName}
                entityType={entityType}
                open={open}
                onClose={onClose}
                deleteCallback={deleteCallback} />
        </div>
    );

    test('When dialog is not open content is not rendered', () => {
        renderComponentUnderTest("", "", false, () => {}, () => Promise.resolve(false));

        const DeleteConfirmationDialog_DialogContentText = screen.queryByTestId('DeleteConfirmationDialog_DialogContentText');
        expect(DeleteConfirmationDialog_DialogContentText).toBeNull();
        
    });

    test('When dialog is open content is rendered with correct text', () => {
        const entityName = "Vacuum";
        const entityType = "Habit";
        renderComponentUnderTest(entityName, entityType, true, () => {}, () => Promise.resolve(false));

        const DeleteConfirmationDialog_DialogContentText = screen.queryByTestId('DeleteConfirmationDialog_DialogContentText');
        expect(DeleteConfirmationDialog_DialogContentText).not.toBeNull();
        
        expect(DeleteConfirmationDialog_DialogContentText).toHaveTextContent(`Are you sure you want to delete ${entityName}?`);

        
        const DeleteConfirmationDialog = screen.queryByTestId('DeleteConfirmationDialog');
        expect(DeleteConfirmationDialog).toBeValid();
        expect(DeleteConfirmationDialog).toHaveTextContent(`Delete ${entityType}`);
    });

    test('When dialog is open and cancel is clicked the dialog is closed', () => {
        let open = true;
        renderComponentUnderTest("", "", open, () => open = false, () => Promise.resolve(false));

        const DeleteConfirmationDialog_Cancel = screen.queryByTestId('DeleteConfirmationDialog_Cancel');
        expect(DeleteConfirmationDialog_Cancel).toBeValid();

        act(() => {
            userEvent.click(DeleteConfirmationDialog_Cancel!);
        });

        expect(open).toBeFalsy();
    });

    test('When dialog is open and delete is clicked dialog closes when deleteCallback returns true', async () => {
        let open = true;
        renderComponentUnderTest("", "", open, () => open = false, () => Promise.resolve(true));

        const DeleteConfirmationDialog_Delete = screen.queryByTestId('DeleteConfirmationDialog_Delete');
        expect(DeleteConfirmationDialog_Delete).toBeValid();

        await act(async () => {
            await userEvent.click(DeleteConfirmationDialog_Delete!);
        });

        expect(open).toBeFalsy();
    });

    test('When dialog is open and delete is clicked dialog remains open when deleteCallback returns false', async () => {
        let open = true;
        renderComponentUnderTest("", "", open, () => open = false, () => Promise.resolve(false));

        const DeleteConfirmationDialog_Delete = screen.queryByTestId('DeleteConfirmationDialog_Delete');
        expect(DeleteConfirmationDialog_Delete).toBeValid();

        await act(async () => {
            await userEvent.click(DeleteConfirmationDialog_Delete!);
        });

        expect(open).toBeTruthy();
    });

    test('When dialog is open and delete is clicked dialog remains open when deleteCallback throws', async () => {
        let open = true;
        renderComponentUnderTest("", "", open, () => open = false, () => { throw new Error(); });

        const DeleteConfirmationDialog_Delete = screen.queryByTestId('DeleteConfirmationDialog_Delete');
        expect(DeleteConfirmationDialog_Delete).toBeValid();

        await act(async () => {
            await userEvent.click(DeleteConfirmationDialog_Delete!);
        });

        expect(open).toBeTruthy();
    });
});