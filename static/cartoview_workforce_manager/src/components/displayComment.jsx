import React, {Component} from 'react';
import Moment from 'react-moment';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
 
  }),
});
class DisplayComments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            comments: []
        }
        this.getComments()
    }
    sendComment = () => {
        var comment = {"comment": this.refs.comment.value, "task": {"pk": this.props.task}}
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
            this.getComments()
        })
        this.refs.comment.value = ""
    }
    deleteComment = (id) => {
        var url = '/apps/cartoview_workforce_manager/api/v1/comment/' + id
        fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
            }),
        })
            .then(function (response) {
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
            this.setState({"comments": data.objects})
        })
    }
    render() {
        const { classes } =this.props;
                return (
                    <div>
                        <Paper>
                            {this.state.comments.map((comment, i) => {
                                return	<Paper key={i} style={{"padding": "1.5%","marginTop": "1%"}}>
                                            <h4><img src={URLS.static+'user'} style={{"width": "5%","marginRight":"1%"}}/>{comment.commenter.username}
                                            </h4>
                                                <i style={{    "fontSize": "12px","color":"gray"}}> Posted on <Moment
                                                    format="YYYY/MM/DD">{comment.created_at}</Moment>
                                                </i>
                                                <p style={{    "padding": "20px","border": "dashed 1px gainsboro","borderRadius": "20px"}}>{comment.comment}
                                                </p>
                                        </Paper>
                            })}
                        </Paper>
                      <div>
                        {this.state.comments.length==0 && 
                        <Paper className={classes.root} >
                                <p>
                                No Comments Yet
                                </p>
                        </Paper>}
                      </div>
			        </div>

        )
    }
}
export default withStyles(styles)(DisplayComments);