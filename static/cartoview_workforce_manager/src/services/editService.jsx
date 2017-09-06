import { getCRSFToken, hasTrailingSlash } from '../helpers/helpers.jsx'
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
				headers: new Headers({ "Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken() }),
				body: JSON.stringify(instanceConfig)
			}).then((response) => { return response.json() }).then((res) => {
				console.log("RESS", res.id)
				var dispatcher_url = '/apps/cartoview_workforce_manager/api/v1/project_dispatchers/'
		    	for (var i = 0; i < dispatchers.length; i++) {
					fetch(dispatcher_url, {
						method: "POST",
						credentials: "same-origin",
						headers: new Headers({
							"Content-Type": "application/json; charset=UTF-8",
							"X-CSRFToken": getCRSFToken(),

						}),
						body: JSON.stringify({
							"project": "/apps/cartoview_workforce_manager/api/v1/project/" + res.id + "/",
							"dispatcher": { "username": dispatchers[i] }
						})
					})
						.then(function (response) {
							if (response.status >= 400) {
								throw new Error("Bad response from server");
							}

						})

				}

		        var worker_url = '/apps/cartoview_workforce_manager/api/v1/project_workers/'
				for (var j = 0; j < workers.length; j++) {
					fetch(worker_url, {
						method: "POST",
						credentials: "same-origin",
						headers: new Headers({
							"Content-Type": "application/json; charset=UTF-8",
							"X-CSRFToken": getCRSFToken(),

						}),
						body: JSON.stringify({
							"project": "/apps/cartoview_workforce_manager/api/v1/project/" + res.id + "/",
							"worker": { "username": workers[j] }
						})
					})
						.then(function (response) {
							if (response.status >= 400) {
								throw new Error("Bad response from server");
							}

						})

				}


				// window.location.href = "/apps/cartoview_workforce_manager/" + res.id + "/view/"
			})
		}





		else {
			const url = this.baseUrl + "apps/cartoview_workforce_manager/api/v1/project/" + id
			return fetch(url, {
				method: 'PUT',
				credentials: "same-origin",
				headers: new Headers({ "Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken() }),
				body: JSON.stringify(instanceConfig)
			}).then((response) => response.json())

			var del_url_dis = '/apps/cartoview_workforce_manager/api/v1/project/' + id + '/dispatchers/'
			fetch(del_url_dis, {
				method: "DELETE",
				credentials: "same-origin",
				headers: new Headers({
					"Content-Type": "application/json; charset=UTF-8",


				}),

			})
				.then(function (response) {
					if (response.status >= 400) {
						throw new Error("Bad response from server");
					}

				})

			var del_url_wor = '/apps/cartoview_workforce_manager/api/v1/project/' + id + '/workers/'
			fetch(del_url_wor, {
				method: "DELETE",
				credentials: "same-origin",
				headers: new Headers({
					"Content-Type": "application/json; charset=UTF-8",


				}),

			})
				.then(function (response) {
					if (response.status >= 400) {
						throw new Error("Bad response from server");
					}

				})



    		var dispatcher_url = '/apps/cartoview_workforce_manager/api/v1/project_dispatchers/'
			for (var i = 0; i < dispatchers.length; i++) {
				fetch(dispatcher_url, {
					method: "POST",
					credentials: "same-origin",
					headers: new Headers({
						"Content-Type": "application/json; charset=UTF-8",
						"X-CSRFToken": getCRSFToken(),

					}),
					body: JSON.stringify({
						"project": "/apps/cartoview_workforce_manager/api/v1/project/" + this.state.id + "/",
						"dispatcher": { "username": dispatchers[i] }
					})
				})
					.then(function (response) {
						if (response.status >= 400) {
							throw new Error("Bad response from server");
						}

					})

			}
			var worker_url = '/apps/cartoview_workforce_manager/api/v1/project_workers/'
			for (var j = 0; j < workers.length; j++) {
				fetch(worker_url, {
					method: "POST",
					credentials: "same-origin",
					headers: new Headers({
						"Content-Type": "application/json; charset=UTF-8",
						"X-CSRFToken": getCRSFToken(),

					}),
					body: JSON.stringify({
						"project": "/apps/cartoview_workforce_manager/api/v1/project/" + id + "/",
						"worker": { "username": workers[j] }
					})
				})
					.then(function (response) {
						if (response.status >= 400) {
							throw new Error("Bad response from server");
						}


					})


			}

			// window.location.href = "/apps/cartoview_workforce_manager/" + id + "/view/"

		}

	}
}
