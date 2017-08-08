import React, {Component} from 'react';
import {getCRSFToken} from '../helpers/helpers.jsx'

export default class ProjectDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            project: "",

        }

        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + id
        console.log(url)
        fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken(),
                "Authorization": "Basic YWRtaW46YWRtaW4="
            })
        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data)
                this.setState({project: data})
            });

    }
    componentDidMount( ) {
console.log(this.props)
  	}

    render() {
        return (
          <div>
          <div className="col-md-2"></div>

                {this.state.project && < div className="col-md-8">
                <ul className="list-group">
                    <li className="list-group-item"><b>project abstract:</b> {this.state.project.title}</li>
                    <li className="list-group-item"><b>project abstract:</b> {this.state.project.abstract}</li>
                    <li className="list-group-item"><b>project was created by:</b> {this.state.project.owner}</li>
                    <li className="list-group-item"><b>project Dispatchers:</b> <div style={{'padding': '3%'}} >
                                                                                 <ul style={{"listStyleType":"square"}}>
                                                                                  { this.props.workers.map((worker,i)=>{
                                                                                    console.log(worker)
                                                                                     return <li key={i} >{worker.worker.username}</li>
                                                                                   })}

                                                                                    </ul></div></li>
                    <li className="list-group-item"><b>project workers :</b>


                      <div style={{'padding': '3%'}} >
                                                                                  <ul style={{"listStyleType":"square"}}>
                                                                                   { this.props.project.dispatchers.map((dispatcher,i)=>{
                                                                                     
                                                                                      return <li key={i} >{dispatcher.username}</li>
                                                                                    })}

                                                                                     </ul></div>
                    </li>
                </ul>

</div>
                }
          <div className="col-md-2"></div>
            </div> )
    }
}
