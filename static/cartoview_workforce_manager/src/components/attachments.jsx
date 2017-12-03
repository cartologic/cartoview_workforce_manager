import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import MenuItem from 'material-ui/Menu/MenuItem';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { SnackbarContent } from 'material-ui/Snackbar';
import Snackbar from 'material-ui/Snackbar';
import AddIcon from 'material-ui-icons/Add';
const styles = theme => ({
    root: {
     display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      background: theme.palette.background.paper,
    },
    gridList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    title: {
      color: theme.palette.primary[200],
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
  });
class Attachments extends Component {
     constructor(props) {
        super(props)
        this.state = {
            attachments: null,
            flag: null,
            success: false,
            open: false,
            vertical: null,
            horizontal: null,
          
        }
        this.getImage()
    }
    handleClick = state => () => {
        this.setState({ open: true, ...state });
      };
    
      handleRequestClose = () => {
          console.log(
              "handel close"
          )
        this.setState({ "open": false,"success":false });

      };
getNext=()=>{

}
    getImage = () => {
        var url = '/apps/cartoview_workforce_manager/api/v1/attachment/?task__id=' + this.props.task
        fetch(url, {
            method: "GET",
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
            }),
        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return response.json()
            }).then((data) => {
            if (data.objects.length > 0) {
                this.setState({"flag": true})
            }
            this.setState({"attachments": data.objects})
        })

    }
    sendImg = () => {
        let data = new FormData();
        data.append('action', 'ADD');
        data.append('task', `/apps/cartoview_workforce_manager/api/v1/task/${this.props.task}/`);
        data.append('image', this.refs.img.files[0])
console.log(data)


        var url = '/apps/cartoview_workforce_manager/api/v1/attachment/'

        fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: new Headers({ }),
            body: data
        })
            .then(function (response) {

                if (response.status >= 400) {

                    throw new Error("Bad response from server");
                }

                return response

            }).then(() => {
            this.setState({"success": true,open:true})
            this.sendHistory()
            this.getImage()
            this.refs.img.value=""
        })


    }
sendHistory=()=>{
        var date=new Date()
        var dt=date.toUTCString()
        var text = {"text": username+ " added a photo at "+ dt, "task": {"pk": this.props.task}}
        var url = '/apps/cartoview_workforce_manager/api/v1/history/'

        fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",

            }),
            body: JSON.stringify(text)
        })
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server");
                }

            }).then(() => {
        })
       
    }
   
    componentWillMount() {
        this.setState({"flag": false})
    }
    handleChooseFileClick=()=> {
        setTimeout(() => {
          this._inputLabel.click();
        }, 50);
      }
    render() {
        const vertical="bottom", horizontal="center"
        const { classes } = this.props;
        console.log(this.refs)
        return (
           <div>
               <div style={{    margin: "10px"}}>
      <input type="file" name="file" ref="img" id="file" className="input-file"  defaultValue={this.state.image} style={{ "marginBottom": "2%" }} />
        
  
  <label htmlFor="file" ref={x => this._inputLabel = x} className="para">
    <Button dense fab color="primary" label="Choose a File" onTouchTap={this.handleChooseFileClick.bind(this)}>
    <AddIcon/>
   
    </Button>
    &nbsp; Add Photo
  </label>
</div>

            
         {this.state.success&&<Snackbar
         anchorOrigin={{ vertical, horizontal }}
         open={open}
         onRequestClose={this.handleRequestClose}
         SnackbarContentProps={{
           'aria-describedby': 'message-id',
         }}
         message={<span id="message-id">"Your image was attached successfully."</span>}
       />}
                <div style={{ display: "flex", "paddingTop": 10 }}>
                    <div style={{ flexGrow: 1 }}></div>
                    <Button style={{ margin:"2%"}} raised className={classes.button} onClick={this.sendImg} >
                        Upload
                     </Button>
                </div>
                {this.state.attachments &&<div className={classes.root}>
                    <GridList className={classes.gridList} cols={2.5}>
                        {this.state.attachments.map((tile,i) => (
                        <GridListTile key={i}>
                            <img src={tile.image}  />
                            <GridListTileBar
                            title=""
                            classes={{
                                root: classes.titleBar,
                            
                            }}
                            
                            />
                        </GridListTile>
                        ))}
                    </GridList>
    </div>}


            </div>

        )
    }
}
export default withStyles(styles)(Attachments)