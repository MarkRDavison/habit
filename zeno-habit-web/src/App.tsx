import React from 'react';
import * as zcc from '@mark.davison/zeno-common-client'
import NavBar from './FrameworkComponents/NavBar';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import config from './util/config';

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
                        <button onClick={async () => {
                            const response = await axios.get(`${config.ZENO_HABIT_BFF_BASE_URI}/api/habit`, {
                                withCredentials: true
                            });
                            alert(JSON.stringify(response.data));
                        }}>API CALL</button>
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