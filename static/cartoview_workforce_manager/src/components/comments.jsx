import React, { Component } from 'react';
import Moment from 'react-moment';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import DeleteIcon from 'material-ui-icons/Delete';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,

    }),
});
class Comments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            comments: [],
            comment: ""
        }
        this.getComments()
    }
    sendComment = () => {
        var comment = { "comment": this.state.comment, "task": { "pk": this.props.task } }
        console.log(comment)
        var url = '/apps/cartoview_workforce_manager/api/v1/comment/'
        fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
            }),
            body: JSON.stringify(comment)
        })
            .then(function (response) {

                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }

            }).then(() => {
                this.sendHistory()
                this.getComments()
            })
        this.setState({ comment: "" })
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    sendHistory = () => {
        var date = new Date()
        var dt = date.toUTCString()
        var text = { "text": username + " added a comment at " + dt, "task": { "pk": this.props.task } }
        var url = '/apps/cartoview_workforce_manager/api/v1/history/'
        fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
            }),
            body: JSON.stringify(text)
        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }

            }).then(() => {
            })
    }
    deleteComment = (id) => {
        var url = '/apps/cartoview_workforce_manager/api/v1/comment/' + id

        fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
            }),
        }).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
        }).then(() => {
            this.getComments()
        })
    }
    getComments = () => {
        var url = '/apps/cartoview_workforce_manager/api/v1/task/' + this.props.task + '/comments'
        fetch(url, {
            method: "GET",
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
            }),
        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json()
            }).then((data) => {
                this.setState({ "comments": data.objects })
            })
    }
    render() {
        const { classes } = this.props;
        return (
            <div style={{    padding: "20px"}}>
                <div>
                    <TextField
                        ref="comment"
                        id="comment"
                        value={this.state.comment}
                        onChange={this.handleChange('comment')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder="Add Comment"

                        fullWidth
                        margin="normal"
                    />
                </div>
                <div style={{ display: "flex", "paddingTop": 10 }}>
                    <div style={{ flexGrow: 1 }}></div>
                    <Button raised disabled={this.state.comment ? false : true} className={classes.button} onClick={this.sendComment} >
                        Comment
                     </Button>
                </div>
                <div style={{ "marginTop": "5%" }}>
                    {this.state.comments.map((comment, i) => {
                        return <div key={i} >
                            <div >
                                <Paper key={i} style={{ "padding": "1.5%", "marginTop": "1%" }}>

                                    <h4><img src={URLS.static + 'user'} style={{ "width": "5%", "marginRight": "1%" }} />{comment.commenter.username}
                                    </h4>
                                    <i style={{ "fontSize": "12px", "color": "gray" }}> Posted on <Moment
                                        format="YYYY/MM/DD">{comment.created_at}</Moment>
                                    </i>

                                    <p style={{ "padding": "20px", "border": "dashed 1px gainsboro", "borderRadius": "20px" }}>{comment.comment}

                                    </p>
                                    {comment.commenter.username == username &&

                                        <IconButton className={classes.button} aria-label="Delete" onClick={() => this.deleteComment(comment.id)}>
                                            <DeleteIcon />
                                        </IconButton>}
                                </Paper>



                            </div>
                        </div>


                    })}


                </div>
            </div>
        )
    }
}
export default withStyles(styles)(Comments)