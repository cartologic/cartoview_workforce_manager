import React, {Component} from 'react';
import Details from './details.jsx';
import Edit from './edit.jsx';
import TaskHistroy from './taskhistory.jsx'
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import PhoneIcon from 'material-ui-icons/Phone';
import FavoriteIcon from 'material-ui-icons/Favorite';
import PersonPinIcon from 'material-ui-icons/PersonPin';
import HistoryIcon from 'material-ui-icons/History';
import EditIcon from 'material-ui-icons/ModeEdit';

import { withStyles } from 'material-ui/styles';

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
         this.state={
             task:this.props.task,
             value: 0,
         }
    }
loadTask=()=>{
    this.setState({task: false})
        var url = '/apps/cartoview_workforce_manager/api/v1/task/' + this.props.task.id 
          fetch(url, {  method: "GET",
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

                this.setState({task: data})
            });


}
     handleChange = (event, value) => {
         this.setState({ value });
                                    };

    render() {
       const {classes, theme} = this.props;
        return (

                    
        <div className={classes.root}>
                <AppBar position="static">
                <Tabs value={this.state.value} onChange={this.handleChange} scrollable scrollButtons="off" centered>
                    <Tab icon={<PersonPinIcon />}  label="Details" onClick={this.loadTask} />
                    <Tab icon={<EditIcon />}  label="Edit" onClick={this.loadTask} />
                    <Tab icon={<HistoryIcon />}  label="History"/>
                
                </Tabs>
                </AppBar>
                {this.state.value === 0 && <TabContainer> { this.state.task &&<Details task={this.state.task} mapid={this.props.mapid} project={this.props.project} />}</TabContainer>}
                {this.state.value === 1 && <TabContainer> { this.state.task &&<Edit task={this.state.task} mapid={this.props.mapid} project={this.props.project} />}</TabContainer>}
                {this.state.value === 2 && <TabContainer> { this.state.task &&<TaskHistroy task={this.state.task}/>}</TabContainer>}

      </div>
    )
               
        
    }
}
export default withStyles(styles)(TaskDetails)