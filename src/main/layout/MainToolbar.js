import React, { Component } from 'react';
import {
    withStyles,
    AppBar,
    Toolbar
} from '@material-ui/core';

const style = theme => {
    console.log(theme);
    return ({
        appBar: {
            position: 'fixed',
            marginTop: 64,
            backgroundColor: theme.palette.background.default
            //backgroundColor: theme.palette.grey[500]
        },
        // button: {
        //     margin: theme.spacing.unit
        // }
    })
}

class MainToolbar extends Component {
    render() {
        const { classes, children } = this.props;
        return (
            <AppBar
                className={classes.appBar} square>
                <Toolbar variant="dense">
                    {children}
                    {/* <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}>
                        Add
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        disabled>
                        Delete
                    </Button> */}
                </Toolbar>
            </AppBar>
        )
    }
}

export default withStyles(style)(MainToolbar);
