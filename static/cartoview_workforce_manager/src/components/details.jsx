import React, {Component} from 'react';
// import Comments from './comments';
import Attachments from './attachments.jsx';
import ShowLocationMap from './showLocationMap.jsx';
import DisplayComments from './displayComment';
import DisplayAttachments from './displayAttachments';
export default class Details extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        var date = new Date(this.props.task.due_date)
        var day = date.getDate()
        var month = date.getMonth();
        var year = date.getFullYear()

        var date2 = new Date(this.props.task.created_at)
        var day2 = date2.getDate()
        var month2 = date2.getMonth();
        var year2 = date2.getFullYear()


        return (

            <div style={{"padding": "2%"}}>
                <div className="panel panel-primary">
                    <div className="panel-heading">Basic Details</div>
                    <div className="panel-body" style={{"padding": 0}}>

                        <table className="table">

                            <tbody>
                            <tr>
                                <td><b>Title </b></td>
                                <td style={{"width": "70%"}}>{this.props.task.title}</td>

                            </tr>
                            <tr>
                                <td><b>Description</b></td>
                                <td style={{"width": "70%"}}>{this.props.task.description}</td>

                            </tr>
                            <tr>
                                <td><b>Created by</b></td>
                                <td style={{"width": "70%"}}>{this.props.task.created_by.username}</td>

                            </tr>
                            <tr>
                                <td><b>Created At </b></td>
                                <td style={{"width": "70%"}}>{day2 + "/" + month2 + "/" + year2}</td>

                            </tr>
                            {this.props.task.priority&&<tr>
                                <td><b>Priority</b></td>
                                <td style={{"width": "70%"}}>{this.props.task.priority}</td>                              
                            </tr>}
                             {this.props.task.status &&<tr>
                                <td><b>Status</b></td>
                                <td style={{"width": "70%"}}>{this.props.task.status}</td>
                                                    
                            </tr>}
                            <tr>
                                <td><b>Due Date</b></td>
                                <td style={{"width": "70%"}}>{day + "/" + month + "/" + year}</td>

                            </tr>
                            <tr>
                                <td><b>Assigned To</b></td>
                                <td style={{"width": "70%"}}>{this.props.task.assigned_to.username}</td>

                            </tr>
                            <tr>
                                <td><b>Work Order</b></td>
                                <td style={{"width": "70%"}}>{this.props.task.work_order == 0 ?<span>No work order was specified for this task </span> : this.props.task.work_order}
                                </td>

                            </tr>
                               {this.props.task.Category &&<tr>
                                <td><b>Task Category</b></td>
                                <td style={{"width": "70%"}}>{this.props.task.Category}</td>
                                            </tr>}
                            </tbody>
                        </table>


                    </div>


                </div>


                <div className="panel panel-primary">
                    <div className="panel-heading">Images</div>
                    <div className="panel-body"><DisplayAttachments task={this.props.task.id}/></div>
                </div>

                <div className="panel panel-primary">
                    <div className="panel-heading">Comments</div>
                    <div className="panel-body"><DisplayComments task={this.props.task.id}/></div>
                </div>
                <div className="panel panel-primary">
                    <div className="panel-heading">Location</div>
                    <div className="panel-body"><ShowLocationMap mapId={this.props.mapid} x={this.props.task.x} y={this.props.task.y} extent={this.props.task.extent}/></div>
                </div>
            </div>

        )
    }
}
