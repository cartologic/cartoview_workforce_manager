import React, { Component } from 'react';
import t from 'tcomb-form';
import { getCRSFToken, hasTrailingSlash } from '../helpers/helpers.jsx'

import KeywordsInput from './KeywordsInput.jsx'



export default class Dispatchers extends Component {
	constructor( props ) {
	     super( props )		
		 this.state={
			 dispatchers: "",
			selectedDispatchers:[]
		 } 
		
         var url='/apps/cartoview_workforce_manager/api/v1/user/'
		 fetch(url,{method:"GET",headers:new Headers({"Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken( ),"Authorization":"Basic YWRtaW46YWRtaW4="})})
                    .then(function(response) {
                        if (response.status >= 400) {
                        throw new Error("Bad response from server");
                        }
                        return response.json();
                    })
                    .then((data)=> {
                    console.log(data.objects)
                     this.setState({dispatchers:data.objects})
                    });

//   this.changeEvent=this.changeEvente.bind(this)
	}







	save( ) {
		 console.log("checked",this.state.selectedDispatchers);
			let properConfig = {
				// here should pu the value of selected dispatchers 
			
			}
			this.props.onComplete(this.state.selectedDispatchers )
		
	}

handleChange(e){
	console.log( e.target.value)
}
	render( ) {
		return (
			<div className="row">
				<div className="row">
					<div className="col-xs-5 col-md-4">
					
					</div>
					<div className="col-xs-7 col-md-8">
						<button
							style={{
							display: "inline-block",
							margin: "0px 3px 0px 3px"
						}}
							className="btn btn-primary btn-sm pull-right"
							onClick={this.save.bind( this )}>{"next "}
							<i className="fa fa-arrow-right"></i>
						</button>
                     	<button
							style={{
							display: "inline-block",
							margin: "0px 3px 0px 3px"
						}}
							className="btn btn-primary btn-sm pull-right"
							onClick={( ) => this.props.onPrevious( )}>
							<i className="fa fa-arrow-left"></i>{" Previous"}</button>
					


					
					</div>
				</div>
			<h4>	Please select project&#39;s dispatchers </h4>
				<hr></hr>

				{this.state.dispatchers && <div className="checkbox"> { this.state.dispatchers.map((item) =>{
                return <div key={item.id}><label><input type="checkbox" value={item.resource_uri}   
				onChange={ (e)=>
							{ 
							        var checkedArray =this.state.selectedDispatchers;
									var selectedValue = e.target.value;
									if (e.target.checked === true) {

										checkedArray.push(selectedValue);
										this.setState({
										optionsChecked: checkedArray
										});

									} else {

										let valueIndex = checkedArray.indexOf(selectedValue);
										checkedArray.splice(valueIndex, 1);

										this.setState({
										optionsChecked: checkedArray
										});

        }

							}
							
						}
				 />{item.username } {console.log("this",this)}</label> <br/></div>

            })
        }</div>}
			
			</div>
		)
	}
}