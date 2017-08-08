import React, { Component } from 'react';


export default class ProjectEdit extends Component {
	constructor( props ) {
		super( props )

	}


save=()=>{
console.log("title",this.refs.title.value)
console.log("title",this.refs.abstract)
}

	render( ) {
		return (<div className="container">
						<div className="col-md-2"></div>
			<div className="well col-md-8">
<div className="headers"><b>Edit general </b></div>
			    <div className="form-group">
						<br/>
			      <label>Project Title</label>
			      <input type="text" ref="title" className="form-control" id="usr" defaultValue={this.props.project.title}/>
			    </div>
			    <div className="form-group" >
			      <label>Project Abstract</label>
			      <input className="form-control"  ref="abstract" id="pwd"  defaultValue={this.props.project.abstract}/>
			    </div>
 <button type="button" className="btn btn-primary" style={{"pullRight":"true" }} onClick={this.save}>Save</button>


<hr/>


















	<ul className="list-group">
			 <div className="headers"><b>Edit Project Dispatchers</b> </div><div style={{'padding': '3%'}} >
																																	 <ul style={{"listStyleType":"disc"}}>
																																		{ this.props.workers.map((worker,i)=>{
																																			console.log(worker)
																																			 return <li key={i} >{worker.worker.username}</li>
																																		 })}

																																			</ul></div>
																																	<div className="headers"><b>Edit project workers </b></div>


				<div style={{'padding': '3%'}} >
																																		<ul style={{"listStyleType":"disc"}}>
																																		 { this.props.project.dispatchers.map((dispatcher,i)=>{

																																				return <li key={i} >{dispatcher.username}</li>
																																			})}

																																			 </ul></div>

	</ul>















			</div>
	<div className="col-md-2"></div>
	</div>
		 )
	}
}
