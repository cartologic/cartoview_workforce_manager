import { getCRSFToken, hasTrailingSlash } from '../helpers/helpers.jsx'
export default class EditService {
	constructor( urls ) {
		this.baseUrl = urls.baseUrl
		
	}
	save( instanceConfig, id ) {
		const url = id
			? this.baseUrl + "apps/cartoview_workforce_manager/" + id + "/edit"
			: this.baseUrl + "apps/cartoview_workforce_manager/api/v1/project/"
		return fetch(hasTrailingSlash( url )
			? url
			: url + "/", {
			method: 'POST',
			credentials: "same-origin",
			headers: new Headers({"Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken( ),"Authorization":"Basic YWRtaW46YWRtaW4="}),
			body: JSON.stringify( instanceConfig )
		}).then(( response ) => response.json( ))
	}
}
