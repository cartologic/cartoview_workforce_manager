import React, { Component } from 'react';


export default class Comments extends Component {
	constructor( props ) {
		super( props )

this.state={
    comments:[]
}
this.getComments()




		
	}

sendComment=()=>{

    console.log(this.refs.comment.value)
    var comment={"comment":this.refs.comment.value,"task":{"pk":this.props.task}}
     var url='/apps/cartoview_workforce_manager/api/v1/comment/'

		 fetch(url,{method:"POST",
		            credentials: "same-origin",
		            headers:new Headers({"Content-Type": "application/json; charset=UTF-8", "Authorization":"Basic YWRtaW46YWRtaW4="}),
					body:JSON.stringify(comment)
					})
                    .then(function(response) {
                        if (response.status >= 400) {
                        throw new Error("Bad response from server");
                        }
                       
                    }).then(()=> {
                    
                     this.getComments()
                    })
                    this.refs.comment.value=""

}





	getComments=()=>{
     var url='/apps/cartoview_workforce_manager/api/v1/task/'+this.props.task+'/comments'

		 fetch(url,{method:"GET",
		            credentials: "same-origin",
		            headers:new Headers({"Content-Type": "application/json; charset=UTF-8","Authorization":"Basic YWRtaW46YWRtaW4="}),
				
					})
                    .then(function(response) {
                       
                        if (response.status >= 400) {
                           
                        throw new Error("Bad response from server");
                        }
            
                      return response.json()

                       
                    }).then(( data ) => { this.setState({"comments":data.objects})
                   
                      })



    }

	render( ) {



		return ( 
<div>
        <div>
        <textarea ref="comment" className="form-control" rows="2" id="comment" placeholder="add comment"></textarea>
        </div>
  <div style={{"paddingTop": 10}}> 
  <button className="btn btn-primary pull-right" onClick={this.sendComment} >Comment</button>
  </div>
  <div style={{"marginTop":"5%"}}>
  {this.state.comments.map((comment,i)=>{

      return <div key={i} className="well well-sm" ><p><b>{comment.commenter.username}</b>: {comment.comment}</p>  </div>
  })}


</div>
</div>

)
	}
}
