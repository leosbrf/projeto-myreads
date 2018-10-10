import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { withStyles, Button, GridListTile, GridListTileBar, IconButton, Menu, MenuItem, Tooltip, Tabs, Tab } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import MenuIcon from '@material-ui/icons/Menu';
import SortIcon from '@material-ui/icons/Sort';
import purple from '@material-ui/core/colors/purple';
import GridListContent from '../layout/GridListContent';
import { shelfMapper } from '../../util/Util';
import * as BooksAPI from '../../services/api/BooksAPI';
import { withSnackbar } from 'notistack';
import MainFooter from '../layout/MainFooter';
import BookDetailsModal from './BookDetailsModal';


const styles = theme => ({
    button: {
        margin: theme.spacing.unit
    },
    gridListTileBarTag: {
        backgroundColor: purple[500],
        height: '20%'
    },
    gridListTileBarTitle: {
        fontSize: 14
    },
    gridListTileBarSubTitle: {
        fontSize: 10
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.84)',
    },
    rightIcons: {
        position: 'absolute',
        right: theme.spacing.unit * 2
    },
    popper: {
        opacity: 1
    },
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
        fontSize: 14
    }
})

const shelves = ['currentlyReading', 'wantToRead', 'read'];

class MyBooks extends Component {

    state = {
        anchorEl: null,
        books: [],
        bookDetailsModalOpened: false,
        selectedBook: null,
        selectedCategory: null,
        sortBy: null,
        activeNavigationTab: 0,
        dataIsReady: false
    }

    componentDidMount() {
        this.getMyBooks();

        this.setActiveNavigationTab();
    }

    setActiveNavigationTab() {
        let selectedCategory = this.getSelectedCategory();
        let value = null;
        switch (selectedCategory) {
            case 'currentlyreading':
                value = 1;
                break;
            case 'wanttoread':
                value = 2;
                break;
            case 'read':
                value = 3;
                break;
            default:
                value = 0;
        }
        this.setState({ activeNavigationTab: value });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        let selectedCategory = this.getSelectedCategory();

        if (prevState.selectedCategory !== selectedCategory) {
            this.setState({ selectedCategory });
        }
    }

    getSelectedCategory = () => {
        const { location: { search } } = this.props;

        const queryString = new URLSearchParams(search);
        let selectedCategory = null;
        for (const param of queryString.entries()) {
            if (param[0] === 'category') {
                selectedCategory = param[1];
            }
        }

        return selectedCategory;
    }

    getMyBooks() {
        BooksAPI.getAll()
            .then((books) => {
                this.setState({ books, dataIsReady: true })
            });
    }

    handleOpenBookMenu = (event, book) => {
        this.setState({ anchorEl: event.currentTarget, selectedBook: book });
    };

    handleCloseBookMenu = () => {
        this.setState({ anchorEl: null, selectedBook: null });
    };

    handleBookDetailsModal = (book, opened) => {
        this.setState({ selectedBook: book, bookDetailsModalOpened: opened });
    }

    handleBookStatusChange(book, shelf) {
        shelf = shelf === 'remove' ? 'none' : shelf;

        const { onPresentSnackbar } = this.props;
        const message = shelf === 'none' ? 'Book was removed from shelf!' : `Book was added to ${shelfMapper(shelf)}!`;

        BooksAPI.update(book, shelf)
            .then((response) => {
                onPresentSnackbar('success', message);
                this.getMyBooks();
            })
    }

    handleSort = (event, sortBy) => this.setState({ sortBy });

    handleTabnavigationChange = (event, value) => {
        this.setState({ activeNavigationTab: value });
    };

    render() {
        const { classes } = this.props;
        const { anchorEl, books, bookDetailsModalOpened, selectedCategory, selectedBook, sortBy, activeNavigationTab, dataIsReady } = this.state;
        const open = Boolean(anchorEl);

        let filteredBooks = [...books];
        let addToCategoryLink = { pathname: '/search' }
        if (selectedCategory) {
            addToCategoryLink = { pathname: '/search', search: `?categorytoadd=${selectedCategory}` };
            filteredBooks = filteredBooks.filter(book => book.shelf.toLowerCase() === selectedCategory);
        }

        if (sortBy === 'asc') {
            filteredBooks = filteredBooks.sort((a, b) => {
                return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
            });
        } else if (sortBy === 'desc') {
            filteredBooks = filteredBooks.sort((a, b) => {
                return a.title > b.title ? -1 : a.title < b.title ? 1 : 0;
            });
        }

        const buttons = (
            <Fragment>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    component={Link}
                    to={addToCategoryLink}>
                    Add
                </Button>
                <ToggleButtonGroup value={sortBy} exclusive onChange={this.handleSort} className={classes.rightIcons}>
                    <ToggleButton value="asc">
                        <Tooltip title="Sort Ascending">
                            <SortIcon style={{ transform: 'rotate(180deg)' }} />
                        </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="desc">
                        <Tooltip title="Sort Descending">
                            <SortIcon />
                        </Tooltip>
                    </ToggleButton>
                </ToggleButtonGroup>
                {/* <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    disabled>
                    Delete
                </Button> */}
            </Fragment>
        )

        const navigationTabs = (
            <Tabs
                value={activeNavigationTab}
                onChange={this.handleTabnavigationChange}
                indicatorColor="primary"
                textColor="primary"
                centered>
                <Tab label="ALL"
                    component={Link}
                    to={{ pathName: '/' }} />
                <Tab label="READING"
                    component={Link}
                    to={{
                        pathname: '/',
                        search: `?category=currentlyreading`
                    }} />
                <Tab label="WANT TO READ"
                    component={Link}
                    to={{
                        pathName: '/',
                        search: '?category=wanttoread'
                    }} />
                <Tab label="READ"
                    component={Link}
                    to={{
                        pathName: '/',
                        search: '?category=read'
                    }} />
            </Tabs>
        )


        let contextMenu = null;

        if (selectedBook) {
            contextMenu = (
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={this.handleCloseBookMenu}>
                    {
                        shelves.map(shelf => (
                            <MenuItem
                                key={shelf}
                                disabled={selectedBook.shelf === shelf}
                                onClick={() => {
                                    this.handleCloseBookMenu();
                                    this.handleBookStatusChange(selectedBook, shelf);
                                }}>
                                {shelfMapper(shelf)}
                            </MenuItem>
                        ))
                    }
                    <MenuItem
                        disabled={!selectedBook.shelf}
                        onClick={() => {
                            this.handleCloseBookMenu();
                            this.handleBookStatusChange(selectedBook, 'remove');
                        }}>
                        Remove
              </MenuItem>
                </Menu>
            );
        }

        const booksElements = filteredBooks.map(book => {

            const actionIcon =
                (
                    <IconButton
                        hidden={true}
                        className={classes.icon}
                        onClick={(e) => this.handleOpenBookMenu(e, book)}>
                        <MenuIcon />
                    </IconButton>
                );

            const authorsJoined = book.authors ? book.authors.join(', ') : '';

            return (

                <GridListTile key={book.id}>
                    <Tooltip title={book.title} placement="top" classes={{
                        popper: classes.popper,
                        tooltip: classes.tooltip
                    }}>
                        <div>
                            <div
                                style={{ textAlign: 'center', cursor: 'pointer' }}
                                onClick={() => this.handleBookDetailsModal(book, true)}>

                                <img
                                    src={book.imageLinks ? book.imageLinks.smallThumbnail : "/images/image-not-found.png"}
                                    alt={book.title}
                                    style={{ width: 150, height: 200 }} />

                                {book.shelf && !selectedCategory ?
                                    <GridListTileBar
                                        classes={{
                                            root: classes.gridListTileBarTag,
                                            title: classes.gridListTileBarTitle
                                        }}
                                        title={shelfMapper(book.shelf)}
                                        titlePosition="top" /> : null}
                            </div>


                            <GridListTileBar
                                title={book.title}
                                subtitle={authorsJoined}
                                actionIcon={actionIcon}
                                classes={{
                                    title: classes.gridListTileBarTitle,
                                    subtitle: classes.gridListTileBarSubTitle
                                }} />
                        </div>
                    </Tooltip>
                </GridListTile>
            )
        });

        return (
            <Fragment>
                <GridListContent toolbarButtons={buttons} items={booksElements} ready={dataIsReady} emptyMessage="A room without books is like a body without a soul." />
                <MainFooter buttons={navigationTabs} />
                {selectedBook ? <BookDetailsModal
                    book={selectedBook}
                    opened={bookDetailsModalOpened}
                    onClose={() => this.handleBookDetailsModal(null, false)} /> : null}
                {contextMenu}
            </Fragment>
        )
    }
}

export default withStyles(styles)(withSnackbar(MyBooks));
