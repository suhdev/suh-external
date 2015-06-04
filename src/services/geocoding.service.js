/**
 * @ngdoc service
 * @name  shGoogleGeocoding
 * @module SuhExternal
 * @description Handles google geocoding API requests
 */
angular.module('SuhExternal')
	.factory('shGoogleGeocoding', ['$http','$q', '$window', function($http,$q,$window){
		var geo = function(){
			MRL.BasicCtrl.call(this,{},[]); 
			/**
			 * @ngdoc property
			 * @name shGoogleGeocoding#_d
			 * @type {Promise}
			 * @description holds a promise that is resolved when the API is appropriately loaded
			 */
			this._d = $q.defer();
			/**
			 * @ngdoc property
			 * @name  shGoogleGeocoding#_initialized
			 * @description indicates whether the API is appropriately loaded or not
			 * @type {Boolean}
			 */
			this._initialized = false;
			/**
			 * @ngdoc property
			 * @name shGoogleGeocoding#coder
			 * @description holds a reference to the service geocoder used to contact Google Maps servers
			 * @type {google.maps.Geocoder}
			 */
			this.coder = null;
			/**
			 * @ngdoc property
			 * @name  shGoogleGeocoding#coder
			 * @description holds a reference to the map object used to query Google Maps servers
			 * @type {google.maps.Map}
			 */
			this.map = null;
			/**
			 * @ngdoc property
			 * @name  shGoogleGeocoding#apiKey
			 * @description holds the API key used to communicate with Google Maps servers
			 * @type {String}
			 */
			this.apiKey = '';
			window.onGoogleMapsLoaded = function(){
				var ig = angular.element('html').injector();
				ig.get('Geocoding')
					.postInit();
			};
			//this.init();
			this.postInit();
		};
		geo.prototype = {
			/**
			 * @ngdoc method
			 * @name shGoogleGeocoding#init
			 * @description initializes Google maps API 
			 */
			init:function(){
				if (this._initialized){
					throw _GE(0x0001,'Google Maps API already initialized');
				}
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.async = true;
				script.src = 'http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false&callback=onGoogleMapsLoaded';
				document.body.appendChild(script);

			},
			/**
			 * @ngdoc method
			 * @name  shGoogleGeocoding#postInit
			 * @description performs post initialization of the Google Maps API.
			 */
			postInit:function(){
				if (this._initialized){
					throw _GE(0x0001,'Google Maps API already initialized');
				}
				this._initialized = true;

				this.coder = new google.maps.Geocoder();
				//59.338750, 18.068570
				var latlng = new google.maps.LatLng(59.338750,18.068570);
				var mapOptions = {
					zoom :12,
					center:latlng
				};

				if (jQuery('#hidden-map-canvas').length === 0)
					jQuery('body').append('<div id="hidden-map-canvas" style="display:none;"></div>');
				if (jQuery('#hidden-map-canvas').length > 0){

					this.map = new google.maps.Map(document.getElementById('hidden-map-canvas'), mapOptions);

					this.apiKey = 'AIzaSyBjleysc7ZBJdUdGgeUxTQgbMEer-yFBfU';
				}
				this._d.resolve();
				//this.trigger('GoogleMapsLibLoaded',{});
			},
			/**
			 * @ngdoc method
			 * @name  shGoogleGeocoding#ready
			 * @description returns the initialization promise of the API initialization.
			 */
			ready:function(){
				return this._d.promise;
			},
			/**
			 * @ngdoc method
			 * @name  shGoogleGeocoding#geocodeAddress
			 * @description geocode a given address using the name of the address
			 */
			geocodeAddress:function(address){
				var _df = $q.defer();
				this.coder.geocode({'address':address},
					function(results,status){
					if (status === google.maps.GeocoderStatus.OK){
						_df.resolve(results);
					}else{
						_df.reject(status);
					}
				});
				return _df.promise;
			},
			/**
			 * @ngdoc method
			 * @name  shGoogleGeocoding#reverseGeocode
			 * @description [description]
			 * @param  {object} latlng the longitude and latitute object to reverve geocode
			 */
			reverseGeocode:function(latlng){
				var _df = $q.defer();
				this.coder.geocode({'latLng':latlng},function(results,status){
					if (status === google.maps.GeocoderStatus.OK){
						_df.resolve(results);
					}else{
						_df.reject(status);
					}
				});
				return _df.promise;
			}
		};
		return new geo();
}]);