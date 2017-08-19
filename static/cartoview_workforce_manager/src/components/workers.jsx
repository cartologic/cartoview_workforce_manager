import React, {Component} from 'react';
import {getCRSFToken} from '../helpers/helpers.jsx'


export default class Workers extends Component {
    constructor(props) {
        super(props)

        this.state = {
            workers: "",
            selectedWorkers: []
        }
 console.log(this.props.workers)
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

                this.setState({workers: data.objects})
            });

if(!isNaN(id)){

       var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id + "/workers"

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
                console.log(data.objects)
                this.setState({selectedWorkers: data.objects})
            });
    }
    }
check=(uri)=>{
    if(!isNaN(id))
     {

        for(var i=0;i<this.state.selectedWorkers.length;i++){
            if( this.state.selectedWorkers[i].worker)
          { if (this.state.selectedWorkers[i].worker.resource_uri==uri.resource_uri)

            { return true} }
            else{if (this.state.selectedWorkers[i]==uri.resource_uri)

            { return true} }
            }

     }


}

    save() {
console.log("worler",this.state.selectedWorkers)
        this.props.onComplete(this.state.selectedWorkers)

    }

    handleChange(e) {

    }

    render() {
        return (
			<div className="row">
				<div className="row">
					<div className="col-xs-5 col-md-4"></div>
					<div className="col-xs-7 col-md-8">

						<button
							style={{
                                display: "inline-block",
                                margin: "0px 3px 0px 3px"
                            }}
							className={this.state.success === true
                                ? "btn btn-primary btn-sm pull-right disabled"
                                : "btn btn-primary btn-sm pull-right"}
							onClick={this.save.bind(this)}>Save
						</button>
						<button
							style={{
                                display: "inline-block",
                                margin: "0px 3px 0px 3px"
                            }}
							className="btn btn-primary btn-sm pull-right disabled"
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
				<div className="row" style={{
                    marginTop: "3%"
                }}>

					<div className="col-xs-7 col-md-8">


					</div>
				</div>

				<h4> Please select project&#39;s workers </h4>
				<hr></hr>

                {this.state.workers && <div className="checkbox"> {this.state.workers.map((item) => {
                  if(item.username&&item.id>0){
                    return <div key={item.id}><label><input type="checkbox" value={item.resource_uri} checked={this.check(item)}
															onChange={(e) => {
                                                                var checkedArray = this.state.selectedWorkers;
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
