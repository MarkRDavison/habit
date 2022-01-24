import React from 'react';
import * as zcc from '@mark.davison/zeno-common-client'
import NavBar from './FrameworkComponents/NavBar';
import { Route, Router, Switch } from 'react-router-dom';
import HomePage from './components/HomePage';
import HabitPage from './components/HabitPage';
import AlertBar from './FrameworkComponents/AlertBar';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

/* istanbul ignore next */
const App = (): JSX.Element => {
    return (
        <div>
            <Router history={history}>
                <NavBar />
                <AlertBar />
                <Switch>
                    <Route path='/public'>
                        <div>
                            <h1>zskdjfhlkjsdzfshjgkdblf</h1>
                        </div>
                    </Route>
                    <zcc.PrivateRoute path='/habit/:id' component={(): JSX.Element => <HabitPage />} />
                    <zcc.PrivateRoute path='/' component={(): JSX.Element => <HomePage />} />
                </Switch>
            </Router>
        </div>
    );
};

export default App;