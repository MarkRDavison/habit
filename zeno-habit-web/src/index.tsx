import { AuthContext, AuthEndpoints } from '@mark.davison/zeno-common-client';
import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from '@/App';
import createHabitStore from './store/store';
import config from './util/config';

const authEndpoints: AuthEndpoints = {
    loginEndpoint: config.ZENO_HABIT_BFF_BASE_URI + '/auth/login',
    logoutEndpoint: config.ZENO_HABIT_BFF_BASE_URI + '/auth/logout',
    userEndpoint: config.ZENO_HABIT_BFF_BASE_URI + '/auth/user'
}

axios.defaults.baseURL = config.ZENO_HABIT_BFF_BASE_URI;
axios.defaults.withCredentials = true;

const store = createHabitStore()

ReactDOM.render(
    <Provider store={store}>
        <AuthContext
            {...authEndpoints}>
            <App />
        </AuthContext>
    </Provider>, document.getElementById('root'));