import React, {Component} from 'react';
import {getCRSFToken} from '../helpers/helpers.jsx'


export default class Dispatchers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dispatchers: "",
            selectedDispatchers: [],
         
        }

        var url = '/apps/cartoview_workforce_manager/api/v1/user/'
        fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken(),

            })
        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then((data) => {

                this.setState({dispatchers: data.objects})
            });






if(!isNaN(id)){

       var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id + "/dispatchers"

        fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken(),

            })
        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then((data) => {

                this.setState({selectedDispatchers: data.objects})
            });
    }




    }
check=(uri)=>{

    if(!isNaN(id))
    {
        if(this.state.selectedDispatchers.length>0){
        for(var i=0;i<this.state.selectedDispatchers.length;i++){
            if( this.state.selectedDispatchers[i].dispatcher)
          { if (this.state.selectedDispatchers[i].dispatcher.resource_uri==uri.resource_uri)

            { return true} }
            else{if (this.state.selectedDispatchers[i]==uri.resource_uri)

            { return true} }
            }

    }}


}

    save() {

        let properConfig = {
            // here should pu the value of selected dispatchers

        }

         this.props.onComplete(this.state.selectedDispatchers)

    }

    handleChange(e) {

    }

    render() {
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
							onClick={this.save.bind(this)}>{"next "}
							<i className="fa fa-arrow-right"></i>
						</button>
						<button
							style={{
                                display: "inline-block",
                                margin: "0px 3px 0px 3px"
                            }}
							className="btn btn-primary btn-sm pull-right"
							onClick={() => this.props.onPrevious()}>
							<i className="fa fa-arrow-left"></i>{" Previous"}</button>


					</div>
				</div>
				<h4> Please select project&#39;s dispatchers </h4>
				<hr></hr>

                {this.state.dispatchers && <div className="checkbox"> {this.state.dispatchers.map((item) => {
                  if(item.username&&item.id>0){
                    return <div key={item.id}><label><input type="checkbox" value={item.resource_uri} checked={this.check(item)}
															onChange={(e) => {
                                                                var checkedArray = this.state.selectedDispatchers;
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
					/>{item.username}</label> <br/></div>}

                })
                }</div>}

			</div>
        )
    }
}
