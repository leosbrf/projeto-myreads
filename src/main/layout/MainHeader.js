import React, { Component } from 'react'
import { withStyles, AppBar, Toolbar, Typography, IconButton, Tooltip } from '@material-ui/core';
//import {InvertColors as InvertColorsIcon} from '@material-ui/icons';
import InvertColorsIcon from '@material-ui/icons/InvertColors';

const style = theme => ({
  root: {
    position: 'fixed',
    //backgroundColor: theme.palette.background.paper
  },
  grow: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    }
  }
})

class MainHeader extends Component {

  state = {
    dark: false
  }

  handleOnInvertColors = (callBack) => {
    this.setState((prevState) => {
      let type = prevState.dark ? 'light' : 'dark';

      callBack('type')({ attribute: { value: type } });
      return { dark: !prevState.dark }
    })
  }

  render() {
    const { classes, onThemePropsChanged } = this.props;
    return (
      <AppBar className={classes.root}>
        <Toolbar>
          <Typography variant="display1" color="inherit" className={classes.grow}>My Reads</Typography>
          <div className={classes.sectionDesktop}>
            <Tooltip title="Invert Background Color">
              <IconButton color="inherit" onClick={() => this.handleOnInvertColors(onThemePropsChanged)}>
                <InvertColorsIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}

export default withStyles(style)(MainHeader);
