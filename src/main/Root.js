import React, { Component } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import * as colors from '@material-ui/core/colors';
import App from './App';
import { defaultContext, Provider } from './theme/context';

class Root extends Component {
    state = defaultContext;

    handleConfigVarChange = name => ({ attribute: { value } }) => {
        this.setState({ [name]: value })
    }


    render() {
        const { state, state: { type, color, unit }, handleConfigVarChange } = this;

        const theme = createMuiTheme({
            palette: {
                type,
                primary: colors[color]
            },
            spacing: {
                unit
            }
        })
        return (
            <Provider
                value={{
                    ...state,
                    handleConfigVarChange
                }}>
                <MuiThemeProvider theme={theme}>
                    <App />
                </MuiThemeProvider>
            </Provider>
        )
    }
}

export default Root;
