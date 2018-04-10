import React, { Component } from 'react';
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
import Moment from 'react-moment';

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
    return (
      <div >
        <Paper className={classes.paper}>
          {!this.props.task && <img src={URLS.static + '/loader'} />}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <div style={{ display: "flex" }}>
                    <div>
                      <MenuIcon />
                    </div>
                    <div style={{ fontSize: "19px" }}>
                      Details
                </div>
                  </div>
                </TableCell>
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
                <TableCell> <Moment format="YYYY/MM/DD">{this.props.task.created_at}</Moment></TableCell>
              </TableRow>
              {this.props.project.Project_config.includes("priority") && <TableRow >
                <TableCell><b>Priority</b></TableCell>
                <TableCell>{this.props.task.priority}</TableCell>
              </TableRow>}
              {this.props.project.Project_config.includes("status") && <TableRow >
                <TableCell><b>Status</b></TableCell>
                <TableCell>{this.props.task.status}</TableCell>
              </TableRow>}
              {this.props.project.Project_config.includes("due_date") && <TableRow >
                <TableCell><b>Due Date</b></TableCell>
                <TableCell> <Moment format="YYYY/MM/DD">{this.props.task.due_date}</Moment></TableCell>
              </TableRow>}
              {this.props.project.Project_config.includes("assigned_to") && <TableRow >
                <TableCell><b>Assigned To</b></TableCell>
                <TableCell>{this.props.task.assigned_to.username}</TableCell>
              </TableRow>}
              {this.props.project.Project_config.includes("work_order") && <TableRow >
                <TableCell><b>Work Order</b></TableCell>
                <TableCell>{this.props.task.work_order == 0 ? <span>No work order was specified for this task </span> : this.props.task.work_order}</TableCell>
              </TableRow>}
              {this.props.project.Project_config.includes("Category") && <TableRow >
                <TableCell><b>Category</b></TableCell>
                <TableCell>{this.props.task.Category}</TableCell>
              </TableRow>}
            </TableBody>
          </Table>
        </Paper>
        <Paper style={{ "marginTop": "2%" }}>
          <div style={{ display: "flex","padding": "1.5%", "color": "rgba(0, 0, 0, 0.54)" }}>
            <div>
              <ImageIcon />
            </div>
            <div style={{ fontSize: "19px" }}>
              Images
                </div>
          </div>
          <Divider />
          <div><DisplayAttachments task={this.props.task.id} /></div>
        </Paper>
        <Paper style={{ "marginTop": "2%" }}>
          <div style={{ display: "flex" ,"padding": "1.5%", "color": "rgba(0, 0, 0, 0.54)"}}>
            <div>
              <CommentIcon />
            </div>
            <div style={{ fontSize: "19px" }}>
              Comments
                </div>
          </div>
          <Divider />
          <div><DisplayComments task={this.props.task.id} /></div>
        </Paper>
        <Paper style={{ "marginTop": "2%" }}>
          <div style={{ display: "flex","padding": "1.5%", "color": "rgba(0, 0, 0, 0.54)"}}>
            <div>
              <LocationIcon />
            </div>
            <div style={{ fontSize: "19px",  }}>
              Location
                </div>
          </div>
          <Divider />
          <div><ShowLocationMap mapId={this.props.mapid} x={this.props.task.x} y={this.props.task.y} extent={this.props.task.extent} /></div>
        </Paper>
      </div>
    )
  }
}
export default withStyles(styles)(Details);
