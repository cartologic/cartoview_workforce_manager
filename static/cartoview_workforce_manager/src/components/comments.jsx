import React, {Component} from 'react';
import Moment from 'react-moment';
export default class Comments extends Component {
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
            this.sendHistory()
            this.getComments()
        })
        this.refs.comment.value = ""
    }
    sendHistory=()=>{
        var date=new Date()
        var dt=date.toUTCString()
        var text = {"text": username+ " added a comment at "+ dt, "task": {"pk": this.props.task}}
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
            this.setState({"comments": data.objects})
        })
    }
    render() {
        return (
			<div>
				<div>
					<textarea ref="comment" className="form-control" rows="2" id="comment"
							  placeholder="add comment"></textarea>
				</div>
				<div style={{"paddingTop": 10}}>
					<button className="btn btn-default pull-right" onClick={this.sendComment}>Comment</button>
				</div>
				<div style={{"marginTop": "5%"}}>
                    {this.state.comments.map((comment, i) => {
                        return <div key={i} className="well ">
							<div className="media">
								<div className="media-body">
									<h4 className="media-heading"><img src={URLS.static+'user'} style={{"width": "5%","marginRight":"1%"}}/>{comment.commenter.username}
										<small><i> Posted on <Moment
											format="YYYY/MM/DD">{comment.created_at}</Moment></i></small>
									</h4>
									<p>{comment.comment}</p>
								</div>
              {  comment.commenter.username==username &&
								<button className="btn btn-link pull-right "
										style={{"color": "indianred", "padding": "0%"}}
										onClick={() => this.deleteComment(comment.id)}>Delete
								</button>}


							</div>
						</div>


                    })}


				</div>
			</div>

        )
    }
}
