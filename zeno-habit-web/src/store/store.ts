import { Action, applyMiddleware, combineReducers, createStore, Dispatch, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { alertReducer } from './alertReducer';
import { habitReducer } from './habitReducer';
import { occurenceReducer } from './occurenceReducer';

const rootReducer = combineReducers({
    alertState: alertReducer,
    habitState: habitReducer,
    occurenceState: occurenceReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export type GetStateType = () => RootState;
export type DispatchType = Dispatch<Action<unknown>>;

const createHabitStore = (): Store => createStore(
    rootReducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
);

export default createHabitStore;