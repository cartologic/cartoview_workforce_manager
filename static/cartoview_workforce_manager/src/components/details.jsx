import React, {Component} from 'react';

import Attachments from './attachments.jsx';
import ShowLocationMap from './showLocationMap.jsx';
import DisplayComments from './displayComment';
import DisplayAttachments from './displayAttachments';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import MenuIcon from 'material-ui-icons/Menu';
import ImageIcon from 'material-ui-icons/Image';
import CommentIcon from 'material-ui-icons/Comment';
import LocationIcon from 'material-ui-icons/LocationOn';





const styles = theme => ({
  paper: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
    overflowX: 'auto',
  },
});
class Details extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        const { classes } = this.props;
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
  <Paper className={classes.paper}>
   {!this.props.task &&<img src={URLS.static + 'cartoview_workforce_manager/loader'} />}                 
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b> <MenuIcon/>Basic Details</b></TableCell>
            <TableCell></TableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
              <TableRow >
                <TableCell><b>Title </b></TableCell>
                <TableCell>{this.props.task.title}</TableCell>
              </TableRow>
               {this.props.project.Project_config.includes("description") && <TableRow >
                <TableCell><b>Description</b></TableCell>
                <TableCell>{this.props.task.description}</TableCell>
              </TableRow>}
               <TableRow >
                <TableCell><b>Created by</b></TableCell>
                <TableCell>{this.props.task.created_by.username}</TableCell>
              </TableRow>
               <TableRow >
                <TableCell><b>Created At </b></TableCell>
                <TableCell>{day2 + "/" + month2 + "/" + year2}</TableCell>
              </TableRow>
                {this.props.project.Project_config.includes("priority") && <TableRow >
                <TableCell><b>Priority</b></TableCell>
                <TableCell>{this.props.task.priority}</TableCell>
              </TableRow>}
              {this.props.project.Project_config.includes("status")  && <TableRow >
                <TableCell><b>Status</b></TableCell>
                <TableCell>{this.props.task.status}</TableCell>
              </TableRow>}
              {this.props.project.Project_config.includes("due_date") && <TableRow >
                <TableCell><b>Due Date</b></TableCell>
                <TableCell>{day + "/" + month + "/" + year}</TableCell>
              </TableRow>}
               {this.props.project.Project_config.includes("assigned_to") &&  <TableRow >
                <TableCell><b>Assigned To</b></TableCell>
                <TableCell>{this.props.task.assigned_to.username}</TableCell>
              </TableRow>}
                 {this.props.project.Project_config.includes("work_order") && <TableRow >
                <TableCell><b>Work Order</b></TableCell>
                <TableCell>{this.props.task.work_order == 0 ?<span>No work order was specified for this task </span> : this.props.task.work_order}</TableCell>
              </TableRow>}
                 {this.props.project.Project_config.includes("Category")  && <TableRow >
                <TableCell><b>Category</b></TableCell>
                <TableCell>{this.props.task.Category}</TableCell>
              </TableRow>}
          
        </TableBody>
      </Table>
    </Paper>
                <Paper style={{"marginTop":"2%"}}>
                 <p style={{"padding":"1.5%","color":"rgba(0, 0, 0, 0.54)"}}><b> <ImageIcon/> Images</b></p>
                   <Divider/>
                    <div><DisplayAttachments task={this.props.task.id}/></div>
                </Paper>
              <Paper style={{"marginTop":"2%"}}>
                   <p style={{"padding":"1.5%","color":"rgba(0, 0, 0, 0.54)"}}><CommentIcon/> <b>Comments</b></p>
                   <Divider/>
                    <div><DisplayComments task={this.props.task.id}/></div>
                </Paper>
               <Paper style={{"marginTop":"2%"}}>
                  <p style={{"padding":"1.5%","color":"rgba(0, 0, 0, 0.54)"}}><LocationIcon/> <b>Location</b></p>
                   
                   
                   <Divider/>
                    <div><ShowLocationMap mapId={this.props.mapid} x={this.props.task.x} y={this.props.task.y} extent={this.props.task.extent}/></div>
                </Paper>
              
            </div>

        )
    }
}
export default withStyles(styles)(Details);
