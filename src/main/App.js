import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import { Consumer } from './theme/context';
import MainHeader from './layout/MainHeader';
import MyBooks from './content/MyBooks';
import BooksSearch from './content/BooksSearch';
import { SnackbarProvider } from 'notistack';

class App extends Component {
  render() {
    return (
      <Consumer>
        {({ options, handleConfigVarChange, ...configVars }) => (
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}>
            <Fragment>
              <MainHeader onThemePropsChanged={handleConfigVarChange} />
              <Route exact path='/' component={MyBooks} ></Route>
              <Route path='/search' component={BooksSearch} ></Route>
            </Fragment>
          </SnackbarProvider>
        )}
      </Consumer>
    );
  }
}

export default App;