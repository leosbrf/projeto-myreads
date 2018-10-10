import React, { Component, Fragment } from 'react';
import { withStyles, Grid, Paper } from '@material-ui/core';
import MainToolbar from './MainToolbar';

const styles = theme => ({
    container: {
        alignContent: 'start',
        //border: '1px solid',
        //flexFlow: 'column',
        marginTop: 120,
        marginBottom: 60,
        padding: theme.spacing.unit
    },
    item: {
        //border: '1px solid blue',
        //margin: 10,
        //padding: 10,
        //height: '100%'
    },
    paper: {
        padding: theme.spacing.unit * 2,
        backgroundColor: theme.palette.background.default
        //height: '100%'
    }
})

class GridContent extends Component {
    render() {
        const { classes, toolbarButtons, items } = this.props;


        return (
            <Fragment>
                <MainToolbar children={toolbarButtons} />
                <Grid container className={classes.container}>
                    <Grid id="mainContent" item xs={12} className={classes.item}>
                        <Paper elevation={0} className={classes.paper}>
                            {items}
                        </Paper>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

export default withStyles(styles)(GridContent);
