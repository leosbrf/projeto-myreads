import React, { Component, Fragment } from 'react';
import { withStyles, GridList, Paper, Typography } from '@material-ui/core';
import MainToolbar from './MainToolbar';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';

import "react-placeholder/lib/reactPlaceholder.css";

const styles = theme => ({
    root: {
        alignContent: 'start',
        marginTop: 113,
        marginBottom: 40,
        padding: theme.spacing.unit,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    resultText: {
        flexGrow: 1,
        marginTop: theme.spacing.unit * 4
    },
})

class GridListContent extends Component {

    constructor(props) {
        super(props);
        //a criacao do delegate deve ser feita no construtor, do contrário não consegue remover o event listener
        this.handleWindowResizeDelegate = this.handleWindowResize.bind(this);
    }

    state = {
        gridListCols: 8
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResizeDelegate);
        this.handleWindowResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResizeDelegate);
    }

    handleWindowResize() {
        const viewportWidth = Math.max(window.document.documentElement.clientWidth, window.innerWidth || 0);
        //160 tamanho médio das imagens
        this.setState({ gridListCols: Math.round(viewportWidth / 160) });
        //const viewportHeight = Math.max(window.document.documentElement.clientHeight, window.innerHeight  || 0)

    }

    render() {
        const { classes, toolbarButtons, items, ready, emptyMessage } = this.props;
        const { gridListCols } = this.state;

        let elements = [];
        for (let index = 0; index < gridListCols; index++) {
            elements.push(
                <RectShape
                    key={index}
                    color='lightgrey'
                    style={{
                        width: 140,
                        height: 184,
                        display: 'inline-block'
                    }} />);
        }
        const loadingPaceholder = (
            <div style={{ textAlign: 'center', marginTop: classes.root.padding }}>
                {elements}
            </div>
        );

        return (
            <Fragment>
                <MainToolbar children={toolbarButtons} />
                <Paper elevation={0} className={classes.root}>
                    <ReactPlaceholder
                        showLoadingAnimation
                        ready={ready}
                        customPlaceholder={loadingPaceholder}>
                        <GridList cols={gridListCols}>
                            {items && items.length ? items :
                                <Typography
                                    variant="display1"
                                    className={classes.resultText}>{emptyMessage}</Typography>}
                        </GridList>
                    </ReactPlaceholder>
                </Paper>
            </Fragment>
        )
    }
}

export default withStyles(styles)(GridListContent);
