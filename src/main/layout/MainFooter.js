import React, { Component } from 'react';
import { withStyles, Paper } from '@material-ui/core';

const styles = theme => ({
    root: {
        //margin: `${theme.spacing.unit * 3}px auto`,
        //padding: theme.spacing.unit * 2,
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        minHeight: 48
    }
})

class MainFooter extends Component {

    state = {
        value: 0,
    };

    componentDidMount() {

    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {

        const { classes, buttons } = this.props;

        return (
            <Paper square classes={classes}>
                {buttons ? buttons : (<br />)}
            </Paper>

        )
    }

}

export default withStyles(styles)(MainFooter);
