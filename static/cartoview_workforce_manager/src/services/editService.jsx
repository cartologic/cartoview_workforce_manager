import {getCRSFToken, hasTrailingSlash} from '../helpers/helpers.jsx'

export default class EditService {
    constructor(urls) {
        this.baseUrl = urls.baseUrl
    }

    save(instanceConfig, workers, dispatchers) {
        if (isNaN(id)) {
            const url = this.baseUrl + "apps/cartoview_workforce_manager/api/v1/project/"
            return fetch(url, {
                method: 'POST',
                credentials: "same-origin",
                headers: new Headers({
                    "Content-Type": "application/json; charset=UTF-8",
                    "X-CSRFToken": getCRSFToken()
                }),
                body: JSON.stringify(instanceConfig)
            }).then((response) => {
                return response.json()
            }).then((res) => {
                console.log("RESS", res.id)
                var dispatcher_url = '/apps/cartoview_workforce_manager/api/v1/project_dispatchers/'
                var addDispatcherPromises = [];
                for (var i = 0; i < dispatchers.length; i++) {
                    addDispatcherPromises.push(fetch(dispatcher_url, {
                        method: "POST",
                        credentials: "same-origin",
                        headers: new Headers({
                            "Content-Type": "application/json; charset=UTF-8",
                            "X-CSRFToken": getCRSFToken(),
                        }),
                        body: JSON.stringify({
                            "project": "/apps/cartoview_workforce_manager/api/v1/project/" + res.id + "/",
                            "dispatcher": {"username": dispatchers[i]}
                        })
                    }).then(function (response) {
                        if (response.status >= 400) {
                            throw new Error("Bad response from server");
                        }
                    }));
                }
                var worker_url = '/apps/cartoview_workforce_manager/api/v1/project_workers/'
                var addWorkersPromises = [];
                for (var j = 0; j < workers.length; j++) {
                    addWorkersPromises.push(
                        fetch(worker_url, {
                            method: "POST",
                            credentials: "same-origin",
                            headers: new Headers({
                                "Content-Type": "application/json; charset=UTF-8",
                                "X-CSRFToken": getCRSFToken(),
                            }),
                            body: JSON.stringify({
                                "project": "/apps/cartoview_workforce_manager/api/v1/project/" + res.id + "/",
                                "worker": {"username": workers[j]}
                            })
                        }).then(function (response) {
                            if (response.status >= 400) {
                                throw new Error("Bad response from server");
                            }
                        }));
                }

                // TODO: errors from all promises must be handled.
                Promise.all(addDispatcherPromises.concat(addWorkersPromises)).then(response => {
                    window.location.href = "/apps/cartoview_workforce_manager/" + res.id + "/view/"
                })


            })
        }
        else {
            console.log("edititnf", instanceConfig)
            const url = this.baseUrl + "apps/cartoview_workforce_manager/api/v1/project/" + id
            return fetch(url, {
                method: 'PUT',
                credentials: "same-origin",
                headers: new Headers({
                    "Content-Type": "application/json; charset=UTF-8",
                    "X-CSRFToken": getCRSFToken()
                }),
                body: JSON.stringify(instanceConfig)
            }).then((response) => {

                var del_url_dis = '/apps/cartoview_workforce_manager/api/v1/project/' + id + '/dispatchers/'
                var dispatchersPromise = new Promise((resolve, reject) => {
                    fetch(del_url_dis, {
                        method: "DELETE",
                        credentials: "same-origin",
                        headers: new Headers({
                            "Content-Type": "application/json; charset=UTF-8",
                        }),
                    }).then(function (response) {
                        if (response.status >= 400) {
                            throw new Error("Bad response from server");
                        }
                        else {
                            var dispatcher_url = '/apps/cartoview_workforce_manager/api/v1/project_dispatchers/'
                            var addDispatchersPromises = [];
                            for (var i = 0; i < dispatchers.length; i++) {
                                addDispatchersPromises.push(
                                    fetch(dispatcher_url, {
                                        method: "POST",
                                        credentials: "same-origin",
                                        headers: new Headers({
                                            "Content-Type": "application/json; charset=UTF-8",
                                            "X-CSRFToken": getCRSFToken(),

                                        }),
                                        body: JSON.stringify({
                                            "project": "/apps/cartoview_workforce_manager/api/v1/project/" + id + "/",
                                            "dispatcher": {"username": dispatchers[i]}
                                        })
                                    }).then(function (response) {
                                        if (response.status >= 400) {
                                            throw new Error("Bad response from server");
                                        }
                                    })
                                )
                            }
                            Promise.all(addDispatchersPromises).then(values => {
                                console.log('---dispatchers---')
                                console.log(values);
                                resolve(200);
                            })
                        }
                    })
                });


                var del_url_wor = '/apps/cartoview_workforce_manager/api/v1/project/' + id + '/workers/'
                var workersPromise = new Promise((resolve, reject) => {
                    fetch(del_url_wor, {
                        method: "DELETE",
                        credentials: "same-origin",
                        headers: new Headers({
                            "Content-Type": "application/json; charset=UTF-8",
                        }),
                    }).then(function (response) {
                        if (response.status >= 400) {
                            throw new Error("Bad response from server");
                        } else {
                            var addWorkersPromises = [];
                            var worker_url = '/apps/cartoview_workforce_manager/api/v1/project_workers/'
                            for (var j = 0; j < workers.length; j++) {
                                addWorkersPromises.push(
                                    fetch(worker_url, {
                                        method: "POST",
                                        credentials: "same-origin",
                                        headers: new Headers({
                                            "Content-Type": "application/json; charset=UTF-8",
                                            "X-CSRFToken": getCRSFToken(),
                                        }),
                                        body: JSON.stringify({
                                            "project": "/apps/cartoview_workforce_manager/api/v1/project/" + id + "/",
                                            "worker": {"username": workers[j]}
                                        })
                                    }).then(function (response) {
                                        if (response.status >= 400) {
                                            throw new Error("Bad response from server");
                                        }
                                    })
                                )
                                Promise.all(addWorkersPromises).then(values => {
                                    console.log('----workers----');
                                    console.log(values);
                                    resolve(200);
                                })
                            }
                        }
                    })
                });

                // TODO: errors from all promises must be handled.
                Promise.all([dispatchersPromise, workersPromise]).then(values => {
                    console.log('dispatchers & workers');
                    window.location.href = "/apps/cartoview_workforce_manager/" + id + "/view/"
                })
            })
        }
    }
}
