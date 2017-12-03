import React, { Component } from 'react';
import Details from './details.jsx';
import Edit from './edit.jsx';
import TaskHistroy from './taskhistory.jsx'
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import PhoneIcon from 'material-ui-icons/Phone';
import FavoriteIcon from 'material-ui-icons/Favorite';
import PersonPinIcon from 'material-ui-icons/PersonPin';
import HistoryIcon from 'material-ui-icons/History';
import DetailsIcon from 'material-ui-icons/FeaturedPlayList';
import EditIcon from 'material-ui-icons/ModeEdit';
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import '../css/project.css'
import Grid from 'material-ui/Grid';
import Tooltip from 'material-ui/Tooltip';
function TabContainer(props) {
    return <div >{props.children}</div>;
}

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        // marginTop: theme.spacing.unit * 3,
        backgroundColor: theme.palette.background.paper,
    },
});

class TaskDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            task: this.props.task,
            value: 0,
            history: false,
            edit: false,
            details: true,
            auth:false
        }
    }
    checkDispatcher = () => {
     
    this.props.dispatchers.map((dispatcher) => {
       
      if (dispatcher.dispatcher.username === username) {
        this.setState({auth:true})

      }
    })
  }
    loadTask = () => {
        this.setState({ task: false })
        var url = '/apps/cartoview_workforce_manager/api/v1/task/' + this.props.task.id
        fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
            })
        })
            .then(function (response) {

                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json();
            })
            .then((data) => {

                this.setState({ task: data })
            });


    }
    handleChange = (event, value) => {
        this.setState({ value });
    };

  componentWillMount(){
      this.checkDispatcher()
      }
    render() {
        const { classes, theme } = this.props;
        console.log(this.state.auth)
        return (


            <div className={classes.root , this.props.open && classes.contentShift}>
              <Tooltip id="tooltip-top-start" title="History" placement="top-start">
                <IconButton className={classes.button} aria-label="Task History" color={this.state.history ? "primary" : "default"} style={{ float: "right" }} onClick={() => {
                    this.loadTask
                    this.setState({ history: true, edit: false, details: false })
                    
                }}>
                    <HistoryIcon />
                </IconButton>
                </Tooltip>
                  {this.state.auth &&  <Tooltip id="tooltip-top-start" title="Edit" placement="top-start">
                   
               <IconButton className={classes.button} aria-label="Edit Task" color={this.state.edit ? "primary" : "default"} style={{ float: "right" }} onClick={() => {
                    this.loadTask
                    this.setState({ edit: true, history: false, details: false })
                    
                }}>
               <EditIcon />
                </IconButton>
                
</Tooltip>}
  <Tooltip id="tooltip-top-start" title="Details" placement="top-start">
                <IconButton className={classes.button} aria-label="Task Details" color={this.state.details ? "primary" : "default"} style={{ float: "right" }} onClick={() => {
                    this.loadTask
                    this.setState({ history: false, edit: false, details: true })
                    
                }}>
                    <DetailsIcon />
                </IconButton>
                </Tooltip>
                {this.state.details && !this.state.history && !this.state.edit && <TabContainer>
                    {this.state.task &&

                        <div>


                            <Details task={this.state.task} mapid={this.props.mapid} project={this.props.project} />
                        </div>}
                </TabContainer>
                }
                {!this.state.history && this.state.edit && !this.state.details && <TabContainer> {this.state.task && <Edit task={this.state.task} mapid={this.props.mapid} project={this.props.project} />}</TabContainer>}
                {this.state.history && !this.state.edit && !this.state.details && <TabContainer> {this.state.task && <TaskHistroy task={this.state.task} />}</TabContainer>}
            </div>
        )


    }
}
export default withStyles(styles)(TaskDetails)