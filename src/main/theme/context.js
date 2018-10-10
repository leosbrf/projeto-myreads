import { createContext } from 'react';

//Idea extracted and adapted from:
//https://medium.freecodecamp.org/meet-your-material-ui-your-new-favorite-user-interface-library-6349a1c88a8c
//
export const defaultContext = {
    color: 'blue',
    type: 'light',
    unit: 8,
    options: {
        color: ['blue', 'orange', 'red'],
        type: ['light', 'dark'],
        unit: [6, 8, 12, 14, 16]
    },
    handleConfigVarChange: () => { }
}

export const { Provider, Consumer } = createContext(defaultContext);