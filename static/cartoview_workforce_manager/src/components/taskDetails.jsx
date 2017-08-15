import React, {Component} from 'react';
import Details from './details.jsx';
import Edit from './edit.jsx';

export default class TaskDetails extends Component {
    constructor(props) {
        super(props)

    }


    render() {
        return (
            <div>

                <div className="panel panel-default  ">
                    <br/>
                    <ul className="nav nav-tabs">

                        <li className="active"><a data-toggle="tab" href="#detail">Details</a></li>
                        <li><a data-toggle="tab" href="#edit">Edit</a></li>

                    </ul>

                    <div className="tab-content">
                        <div id="detail" className="tab-pane fade in active">
                            <Details task={this.props.task} mapid={this.props.mapid}/>
                        </div>
                        <div id="edit" className="tab-pane fade">
                            <br/>
                            <Edit task={this.props.task} mapid={this.props.mapid}/>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}
