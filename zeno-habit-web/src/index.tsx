import { AuthContext, AuthEndpoints } from "@mark.davison/zeno-common-client";
import React from "react";
import ReactDOM from 'react-dom';
import App from "./App";
import config from "./util/config";

const authEndpoints: AuthEndpoints = {
    loginEndpoint: config.ZENO_HABIT_BFF_BASE_URI + '/auth/login',
    logoutEndpoint: config.ZENO_HABIT_BFF_BASE_URI + '/auth/logout',
    userEndpoint: config.ZENO_HABIT_BFF_BASE_URI + '/auth/user'
}

console.log(authEndpoints.userEndpoint);

ReactDOM.render(
<AuthContext
    {...authEndpoints}>
    <App />
</AuthContext>, document.getElementById("root"));