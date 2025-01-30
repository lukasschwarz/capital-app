import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CapitalList from '../CapitalList';
import { updateCapitalAsync, removeCapitalAsync } from '../lib/thunks';

jest.mock('../lib/thunks', () => ({
    updateCapitalAsync: jest.fn(),
    removeCapitalAsync: jest.fn(),
}));

const mockStore = configureStore([]);

describe('CapitalList Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            capitals: { capitals: [{ id: 1, name: 'Berlin', country: 'Germany' }] },
        });
        store.dispatch = jest.fn();
    });

    test('should edit a capital and save changes', () => {
        render(
            <Provider store={store}>
                <CapitalList />
            </Provider>
        );

        // Start editing
        fireEvent.click(screen.getByText('Bearbeiten'));

        // Change input values
        fireEvent.change(screen.getByDisplayValue('Berlin'), { target: { value: 'Munich' } });
        fireEvent.change(screen.getByDisplayValue('Germany'), { target: { value: 'Deutschland' } });

        // Save changes
        fireEvent.click(screen.getByText('Speichern'));

        expect(updateCapitalAsync).toHaveBeenCalledWith({ id: 1, name: 'Munich', country: 'Deutschland' });
        expect(store.dispatch).toHaveBeenCalled();
    });

    test('should remove a capital when delete button is clicked', () => {
        render(
            <Provider store={store}>
                <CapitalList />
            </Provider>
        );

        fireEvent.click(screen.getByText('X'));
        expect(removeCapitalAsync).toHaveBeenCalledWith(1);
        expect(store.dispatch).toHaveBeenCalled();
    });
});
