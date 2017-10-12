import React, {Component} from 'react';
import {getCRSFToken} from '../helpers/helpers.jsx'
import TaskDetails from './taskDetails.jsx'
import TaskHistroy from './taskhistory.jsx'
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table'
import Paper from 'material-ui/Paper';

export default class MyTasks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:true,
            tasks: [],
            selectedtask:this.props.selected
        }
        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + this.props.id + '/tasks/?assigned_to__username='+username
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

                this.setState({tasks: data.objects,loading:false})
            });

    }

componentWillReceiveProps(nextprops)
{
    this.setState({selectedtask:null})

console.log("will reciedbde")
}
componentDidMount(){

}
  render() {   
        const {classes, theme} = this.props;
        console.log(this.props)
        return (  <Paper className={classes.paper}>
           

			
                {this.state.tasks.length != 0 && !this.state.selectedtask && !this.state.loading&&
				 <Table>
            <TableHead>
              <TableRow>
                <TableCell >
                  Title</TableCell>
                {this.props.project.Project_config.includes("assigned_to") &&< TableCell > Assigned to < /TableCell>}
                {this.props.project.Project_config.includes("priority") && <TableCell>Priority</TableCell>}
                {this.props.project.Project_config.includes("status") &&< TableCell > Status < /TableCell>}

              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.tasks.map(item => {
                return (
                  <TableRow key={item.id} hover onClick={() => {
                    this.setState({"selectedtask": item})
                  }}>
                    <TableCell>{item.title}</TableCell>
                    {this.props.project.Project_config.includes("assigned_to") &&< TableCell > {
                      item.assigned_to.username
                        ? item.assigned_to.username
                        : "-"
                    } < /TableCell>}
                    {this.props.project.Project_config.includes("priority") && <TableCell>{item.priority
                        ? item.priority
                        : '-'}</TableCell>}
                    {this.props.project.Project_config.includes("status") &&< TableCell > {
                      item.status
                        ? item.status
                        : '-'
                    } < /TableCell>}

                  </TableRow>
                );
              })}
            </TableBody>
          </Table>}

                {
                    this.state.selectedtask &&
					<div>
					
							<TaskDetails task={this.state.selectedtask} project={this.props.project} classes={this.props.classes}/>
						
					</div> }

                {!this.state.tasks.length && !this.state.loading &&
                <div>
					<p> You don&#39;t have Tasks </p>
				</div>

                }
			
      </Paper>  )
    }
}
