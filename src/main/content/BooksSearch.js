import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { withStyles, Button, TextField, GridListTile, GridListTileBar, IconButton, Menu, MenuItem, Tooltip } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import purple from '@material-ui/core/colors/purple';
import GridListContent from '../layout/GridListContent';
import { debounce, shelfMapper } from '../../util/Util';
import * as BooksAPI from '../../services/api/BooksAPI';
import BookDetailsModal from './BookDetailsModal';
import { withSnackbar } from 'notistack';
import MainFooter from '../layout/MainFooter';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  inputRoot: {
    width: '100%'
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

class BooksSearch extends Component {

  constructor(props) {
    super(props);
    this.searchBooksDebounced = debounce(this.searchBooks.bind(this), 300);
  }

  state = {
    anchorEl: null,
    searchTerm: null,
    books: [],
    bookDetailsModalOpened: false,
    selectedBook: null, 
    dataIsReady: true
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.searchTerm !== this.state.searchTerm) {
      this.searchBooksDebounced(this.state.searchTerm);
    }
  }

  searchBooks = (searchTerm) => {
    if (searchTerm) {
      this.setState({ books: [], dataIsReady: false })

      Promise.all([BooksAPI.getAll(), BooksAPI.search(searchTerm)]).then((values) => {
        const myBooks = values[0];
        const books = values[1];

        if (books.error) {
          this.setState({ books: [], dataIsReady: true })
        } else if (books && books.length) {
          if (myBooks) {
            myBooks.forEach((myBook) => {
              let book = books.find((book) => myBook.id === book.id);
              if (book) {
                book.shelf = myBook.shelf;
              }
            });
          }

          this.setState({ books, dataIsReady: true })
        }

      });
    } else {
      this.setState({ books: [], dataIsReady: true });
    }
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

  handleSearchTermChanged = searchTerm => {
    this.setState({ searchTerm });
  }

  handleBookStatusChange(book, shelf) {
    const { onPresentSnackbar } = this.props;
    shelf = shelf === 'remove' ? 'none' : shelf;
    const message = shelf === 'nonw' ? 'Book was removed from shelf!' : `Book was added to ${shelfMapper(shelf)}!`;

    BooksAPI.update(book, shelf)
      .then((response) => {
        onPresentSnackbar('success', message);
        this.searchBooks(this.state.searchTerm);
      })
  }

  render() {
    const { classes } = this.props;
    const { anchorEl, books, bookDetailsModalOpened, selectedBook, dataIsReady } = this.state;
    const open = Boolean(anchorEl);

    const buttons = (
      <Fragment>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          component={Link}
          to={{
            pathname: '/',
          }}>
          Back
          </Button>
        <TextField
          autoFocus
          placeholder="Search"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
          onChange={(event) => this.handleSearchTermChanged(event.target.value)} />
      </Fragment>
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

    const booksElements = books.map(book => {

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

                {book.shelf ?
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
        <GridListContent toolbarButtons={buttons} items={booksElements} ready={dataIsReady} emptyMessage="So many books, so little time..." />
        <MainFooter />
        {selectedBook ? <BookDetailsModal
          book={selectedBook}
          opened={bookDetailsModalOpened}
          onClose={() => this.handleBookDetailsModal(null, false)} /> : null}
        {contextMenu}
      </Fragment>

    )
  }
}

export default withStyles(styles)(withSnackbar(BooksSearch));
