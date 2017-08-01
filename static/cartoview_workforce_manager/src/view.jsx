import React from 'react';
import { render, findDOMNode } from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import injectTapEventPlugin from 'react-tap-event-plugin';
import enLocaleData from 'react-intl/locale-data/en';
import enMessages from '@boundlessgeo/sdk/locale/en';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService';
import LayerList from '@boundlessgeo/sdk/components/LayerList';
import ol from 'openlayers';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import BaseMapModal from '@boundlessgeo/sdk/components/BaseMapModal';
import Zoom from '@boundlessgeo/sdk/components/Zoom';
import Legend from '@boundlessgeo/sdk/components/Legend';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import $ from "jquery";
import TaskManager from "./components/TaskManager.jsx"
import CustomTheme from './theme';
import './app.css';
injectTapEventPlugin( );
addLocaleData( enLocaleData );
export default class ReactClient extends React.Component {
	constructor( props ) {
		super( props )
		this.state = {
			data: [],
			loading: true,
			config: {
				mapId: map_id
			}
		}
		this.map = new ol.Map({
			layers: [new ol.layer.Tile({title: 'OpenStreetMap', source: new ol.source.OSM( )})],
			view: new ol.View({
				center: [
					0, 0
				],
				zoom: 3,
				minZoom: 3,
				maxZoom: 19
			})
		});
		this.map.once('postrender', ( event ) => {
			$( ".se-pre-con" ).fadeOut( "slow" );
		})
	}
	update( config ) {
		if ( config && config.mapId ) {
			var url = mapUrl;
			fetch(url, {
				method: "GET",
				credentials: 'include'
			}).then(( response ) => {
				if ( response.status == 200 ) {
					return response.json( );
				}
			}).then(( config ) => {
				if ( config ) {
					MapConfigService.load( MapConfigTransformService.transform( config ), this.map, "/proxy?url=" );

				}
			});
		}
	}
	componentWillMount( ) {
		this.update( this.state.config );
	}
	getChildContext( ) {
		return {muiTheme: getMuiTheme( CustomTheme )};
	}
	componentDidMount( ) {
		this.map.setTarget(findDOMNode( this.refs.map ));
	}
	_toggleBaseMapModal( ) {
		this.refs.basemapmodal.getWrappedInstance( ).open( );
	}
	render( ) {
		const basemap_button = appConfig.showBaseMapSwitcher
			? <FloatingActionButton
					className="basemap_button"
					onTouchTap={this._toggleBaseMapModal.bind( this )}
					mini={true}>
					<i className="fa fa-map" aria-hidden="true"></i>
				</FloatingActionButton>
			: "";
		const base_map_modal = appConfig.showBaseMapSwitcher
			? <BaseMapModal ref='basemapmodal' map={this.map}/>
			: "";
		let layerlist = appConfig.showLayerSwitcher
			? <LayerList
					allowFiltering={true}
					includeLegend={appConfig.showLegend
					? true
					: false}
					showOpacity={true}
					showDownload={true}
					showGroupContent={true}
					showZoomTo={true}
					allowReordering={true}
					map={this.map}/>
			: '';
		let zoom = appConfig.showZoombar
			? <Zoom map={this.map}/>
			: '';
		return (
			<div className="full-height-width">
				{basemap_button}
				<div ref="map" className="map"></div>
				<TaskManager map={this.map}></TaskManager>
				{layerlist}
				{base_map_modal}
				{zoom}
			</div>
		)
	}
}
ReactClient.childContextTypes = {
	muiTheme: React.PropTypes.object
};
render(
	<IntlProvider locale='en' messages={enMessages}>
	<ReactClient></ReactClient>
</IntlProvider>, document.getElementById( 'root' ))
