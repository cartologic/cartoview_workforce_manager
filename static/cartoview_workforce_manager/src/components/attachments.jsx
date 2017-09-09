import React, {Component} from 'react';


export default class Attachments extends Component {
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

// this works
// let request = new XMLHttpRequest();
// request.open('POST', url);
// request.send(data);


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
            this.setState({"success": true})
            this.sendHistory()
            this.getImage()
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
    constructor(props) {
        super(props)
        this.state = {
            attachments: null,
            flag: null,
            success: false
        }
        this.getImage()
    }

    componentWillMount() {
        this.setState({"flag": false})
    }
    render() {

        return (
            <div>
                <input type="file" className="form-control" ref="img" name="image" style={{"marginBottom": "2%"}}/>
                {this.state.success && <div className="alert alert-info">
                    Your image was attached successfully.
                </div>}
                <button className="btn btn-default pull-right" style={{marginTop: "2%"}} onClick={this.sendImg}>upload
                </button>

                {this.state.attachments && <div className="container col-md-10">

                    <div id="myCarousel" className="carousel slide" data-ride="carousel">


                        <div className="carousel-inner">
                            {this.state.attachments.length>0 && <div className="item active">
                                <img src={this.state.attachments[0].image} style={{"width": "100%"}}/>
                            </div>}
                            {this.state.attachments.map((attach, i) => {
                                if (i > 0) {
                                    return <div className="item " key={i}>
                                        <img src={attach.image} style={{"width": "100%"}}/>
                                    </div>
                                }

                            })}

                        </div>


                        {this.state.flag && <a className="left carousel-control" href="#myCarousel" data-slide="prev">
                            <span className="glyphicon glyphicon-chevron-left"></span>

                        </a>}
                        {this.state.flag && <a className="right carousel-control" href="#myCarousel" data-slide="next">
                            <span className="glyphicon glyphicon-chevron-right"></span>

                        </a>}
                    </div>
                </div>}


            </div>

        )
    }
}
