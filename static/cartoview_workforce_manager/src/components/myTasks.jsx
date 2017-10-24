import React, { Component } from 'react';
import { getCRSFToken } from '../helpers/helpers.jsx'
import TaskDetails from './taskDetails.jsx'
import TaskHistroy from './taskhistory.jsx'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Paper from 'material-ui/Paper';
import ReactPaginate from 'react-paginate';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';

export default class MyTasks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            tasks: [],
            pageCount: 0,
            pagedTasks: [],
            perPage:6,
            selectedtask: this.props.selected
        }
        var url = '/apps/cartoview_workforce_manager/api/v1/project/' + this.props.id + '/tasks/?assigned_to__username=' + username
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

                this.setState({ tasks: data.objects, loading: false, pageCount: Math.ceil(data.objects.length / this.state.perPage) },()=>
                { var pagedTasks = this.state.tasks.slice(0, this.state.perPage);
                  this.setState({ pagedTasks: pagedTasks })
                 
                  })
            });

    }

    componentWillReceiveProps(nextprops) {
        this.setState({ selectedtask: null })

        console.log("will reciedbde")
    }
    componentDidMount() {

    }
      handlePageClick = (data) => {
    var pagedTasks = this.state.tasks.slice(data.selected * this.state.perPage, (data.selected + 1) * this.state.perPage);
    this.setState({ pagedTasks: pagedTasks })

  }
    render() {
        const { classes, theme } = this.props;
        console.log(this.props)
        return (<Paper className={classes.paper}>



            {this.state.pagedTasks.length != 0 && !this.state.selectedtask && !this.state.loading &&
              <div>
                <Table>
                    <TableHead>
                        <TableRow>
                           <TableCell style={{"padding": "0" ,"textAlign": "center"}} >
                                Title</TableCell>
                            {this.props.project.Project_config.includes("assigned_to") &&<TableCell style={{"padding": "0" ,"textAlign": "center"}} > Assigned to < /TableCell>}
                {this.props.project.Project_config.includes("priority") &&<TableCell style={{"padding": "0" ,"textAlign": "center"}}>Priority</TableCell>}
                                {this.props.project.Project_config.includes("status") && < TableCell > Status < /TableCell>}

              </TableRow>
            </TableHead>
            <TableBody>
                                    {this.state.pagedTasks.map(item => {
                                        return (
                                            <TableRow className={"hoverPointer"} key={item.id} hover onClick={() => {
                                                this.setState({ "selectedtask": item })
                                            }}>
                                               <TableCell style={{"padding": "0" ,"textAlign": "center"}}>{item.title}</TableCell>
                                                {this.props.project.Project_config.includes("assigned_to") && < TableCell style={{"padding": "0" ,"textAlign": "center"}}  > {
                                                    item.assigned_to.username
                                                        ? item.assigned_to.username
                                                        : "-"
                                                } </TableCell>}
                                                {this.props.project.Project_config.includes("priority") &&<TableCell style={{"padding": "0" ,"textAlign": "center"}}>{item.priority
                                                    ? item.priority
                                                    : '-'}</TableCell>}
                                                {this.props.project.Project_config.includes("status") && < TableCell > {
                                                    item.status
                                                        ? item.status
                                                        : '-'
                                                } </TableCell>}

                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
 {this.state.pageCount > 1 && <ReactPaginate previousLabel={<ChevronLeftIcon/>} nextLabel={<ChevronRightIcon/>} breakLabel={<a href="" > ...</a>} breakClassName={"break-me"} pageCount={this.state.pageCount} marginPagesDisplayed={2} pageRangeDisplayed={5} onPageChange={this.handlePageClick} containerClassName={"pagination"} subContainerClassName={"pages pagination"} activeClassName={"active"} />}
</div>
}

          

                {
                                        this.state.selectedtask &&
                                        <div>

                                            <TaskDetails task={this.state.selectedtask} project={this.props.project} classes={this.props.classes} />

                                        </div>}

                                    {!this.state.tasks.length && !this.state.loading &&
                                        <div style={{ "padding": "5%","textAlign": "center"}}>
                                            <p className="formated"> You don&#39;t have Tasks </p>
                                        </div>

                                    }
			
      </Paper>  )
    }
}
