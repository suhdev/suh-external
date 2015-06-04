/**
 * @ngdoc service
 * @name shGooglePlaces
 * @module SuhExternal
 * @description 
 * Handles communication with Google places API. 
 * @requires shGoogleGeocoding
 */
angular.module('SuhExternal')
	.factory('shGooglePlaces', ['$q','shGoogleGeocoding', 
	function($q,_EG){
		var places = function(){
			this.init();
		};

		places.prototype = {
			/**
			 * @ngdoc method
			 * @name  shGooglePlaces#init
			 * @description initializes the google places service
			 */
			init:function(){
				this.map = _EG.map;
				this.bounds = new google.maps.LatLngBounds(
					new google.maps.LatLng(59.224443, 17.776862),
					new google.maps.LatLng(59.427841, 18.198229)

					);
				this.places = new google.maps.places.PlacesService(this.map);
				this._initialized = true;
			},
			/**
			 * @ngdoc method
			 * @name shGooglePlaces#performSearch
			 * @description
			 * convenience method to call the google places API
			 * @param {String} m the method to call on the places service
			 * @param {object} req the request object
			 */
			performSearch:function(m,req){
				var _df = $q.defer();
				if (this._initialized){
					this.places[m](req,jQuery.proxy(function(r,status){
						if (status !== google.maps.places.PlacesServiceStatus.OK){
							_df.reject(status);
						}else{
							_df.resolve(r);
						}
					},this));
				}else{
					_df.reject();
				}
				return _df.promise;
			},
			/**
			 * @ngdoc method
			 * @name  shGooglePlaces#nearbySearchByBounds
			 * @description 
			 * searches google places by a given bound
			
			 */
			nearbySearchByBounds:function(latLngBounds){
				return this.performSearch('nearbySearch',{
					bounds:latLngBounds,
				});
			},
			/**
			 * @ngdoc method
			 * @name  shGooglePlaces#nearbySearchByLocation
			 * @description searches google places by a given location
			 * @param  {float} lat [description]
			 * @param  {float} lng [description]
			 * @param  {float} rad [description]
			 */
			nearbySearchByLocation:function(lat,lng,rad){
				return this.performSearch('nearbySearch',{
					location:new google.maps.LatLng(lat,lng),
					radius:rad
				});
			},
			/**
			 * @ngdoc method
			 * @name  shGooglePlaces#getPlaceDetails
			 * @description gets the details of a given place using its reference 
			 * @param  {string} ref place reference on google places 
			 */
			getDetails:function(ref){
				return this.performSearch('getDetails',{
					reference:ref
				});
			},
			/**
			 * @ngdoc method
			 * @name  shGooglePlaces#radarSearch
			 * @description performs a radar search given a radar search request
			 * @param  {object} req the radar search request
			 */
			radarSearch:function(req){
				return this.performSearch('radarSearch',req);
			},
			/**
			 * @ngdoc method
			 * @name  shGooglePlaces#textSearch
			 * @description performs a text search given a search query
			 * @param  {String} searchQuery the search query
			 */
			textSearch:function(searchQuery){
				return this.performSearch('textSearch',{
					query:searchQuery,
					bounds:this.bounds
				});
			}
		};

		return new places();
}]);