import { getCRSFToken, hasTrailingSlash } from '../helpers/helpers.jsx'
export default class EditService {
	constructor( urls ) {
		this.baseUrl = urls.baseUrl
		this.maps = [ ];
	}
	save( instanceConfig, id ) {
		const url = id
			? this.baseUrl + "apps/cartoview_feature_list/" + id + "/edit"
			: this.baseUrl + "apps/cartoview_feature_list/new"
		return fetch(hasTrailingSlash( url )
			? url
			: url + "/", {
			method: 'POST',
			credentials: "same-origin",
			headers: new Headers({"Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken( )}),
			body: JSON.stringify( instanceConfig )
		}).then(( response ) => response.json( ))
	}
}
