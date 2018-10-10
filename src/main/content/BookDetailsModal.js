import React from 'react';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import ButtonBase from '@material-ui/core/ButtonBase';

class BookDetailsModal extends React.Component {

    render() {
        const { onClose, opened, book } = this.props;

        const authorsJoined = book.authors ? book.authors.join(', ') : '';

        return (
            <div>
                <Dialog
                    fullScreen={false}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={opened}
                    onClose={onClose}
                    scroll="body">
                    <DialogContent>
                        <DialogContentText>
                            <ButtonBase style={{
                                display: 'block',
                                textAlign: 'initial',
                                width: '100%'
                            }}>
                                <CardMedia
                                    style={{
                                        height: 225,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'contain',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                    image={book.imageLinks ? book.imageLinks.smallThumbnail : "/images/image-not-found.png"}
                                    title={book.title}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="headline" component="h2">
                                        {book.title}
                                    </Typography>
                                    <Typography gutterBottom component="p">
                                        {book.subtitle}
                                    </Typography>
                                    <Typography gutterBottom variant="caption">
                                        {authorsJoined}
                                    </Typography>
                                    <Typography gutterBottom variant="caption">
                                        Pages: {book.pageCount}
                                    </Typography>
                                    <Typography gutterBottom variant="caption">
                                        Rating: {book.averageRating}
                                    </Typography>
                                </CardContent>
                            </ButtonBase>
                        </DialogContentText>

                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export default withMobileDialog()(BookDetailsModal);