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
function TabContainer(props) {
    return <div style={{ padding: 8 * 3 }}>{props.children}</div>;
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
            details: true
        }
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

    render() {
        const { classes, theme } = this.props;
        return (


            <div className={classes.root}>
                <IconButton className={classes.button} aria-label="Task History" color={this.state.history ? "primary" : ""} style={{ float: "right" }} onClick={() => {
                    this.loadTask
                    this.setState({ history: true, edit: false, details: false })
                    
                }}>
                    <HistoryIcon />
                </IconButton>
                <IconButton className={classes.button} aria-label="Edit Task" color={this.state.edit ? "primary" : ""} style={{ float: "right" }} onClick={() => {
                    this.loadTask
                    this.setState({ edit: true, history: false, details: false })
                    
                }}>
                    <EditIcon />
                </IconButton>

                <IconButton className={classes.button} aria-label="Task Details" color={this.state.details ? "primary" : ""} style={{ float: "right" }} onClick={() => {
                    this.loadTask
                    this.setState({ history: false, edit: false, details: true })
                    
                }}>
                    <DetailsIcon />
                </IconButton>
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