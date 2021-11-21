import React from 'react';
import * as zcc from '@mark.davison/zeno-common-client'
import NavBar from './FrameworkComponents/NavBar';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const App = (): JSX.Element => {

    const {
        user,
        isLoggedIn,
        isLoggingIn
    } = zcc.useAuth();

    return (
        <div>
            <BrowserRouter>
                <NavBar />
                <Switch>
                    <zcc.PrivateRoute path='/private' component={() => 
                    <div>
                        <h1>PRIVATE</h1>
                    </div>} />
                    <Route path='/'>
                        <div>
                            <h1>HOME</h1>
                        </div>
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;