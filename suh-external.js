/**
 * @ngdoc module
 * @module SuhExternal
 * @name SuhExternal
 * @description
 * A module to connect to external libraries. 
 * @todo {urgent} finish documentation.
 */
angular.module('SuhExternal',[]);
angular.module('SuhExternal')
	.directive('shFacebookShareCount', ['shFacebook',function (shFB) {
		return {
			restrict: 'A',
			scope:false,
			link: function ($S, $E, $A) {
				var url = document.URL; 
				if ($A.shFacebookShareCountUrl){
					url = $A.shFacebookShareCountUrl; 
				}else if ($A.shFacebookShareCount && $A.shFacebookShareCount !== ''){
					url = $A.shFacebookShareCount; 
				}
				$S.shFBShareCount = 0;
				shFB.shareCount(url)
					.then(function(e){
						$S.shFBShareCount = e; 
					},function(e){
						$S.shFBShareCount = 0; 
					}); 

			}
		};
	}]);

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
/**
 * @ngdoc service
 * @name  shGoogleAnalytics
 * @module SuhExternal
 * @description Handles google analytics code
 */
angular.module('SuhExternal')
	.factory('shGoogleAnalytics', ['$q','$http','shTrackingCode', function ($q,$http,_TC){
		var _ea = function(){
			this.init();
		};

		_ea.prototype = {
			/**
			 * @ngdoc method
			 * @name  shGoogleAnalytics#init
			 * @description initializes google analytics code
			 */
			init:function(){
				// var temp = this;
				// (function(i,s,o,g,r,a,m){
				// 	i['GoogleAnalyticsObject']=r;
				// 	i[r]=i[r]||function(){
				// 		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();
				// 		a=s.createElement(o),
				// 		m=s.getElementsByTagName(o)[0];
				// 	a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				// 	a.addEventListener('load',function(){
				// 		var ij = angular.element('html').injector();
				// 		ij.get('shGoogleAnalytics')
				// 			.postInit();
				// 	});
				// })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
			},
			/**
			 * @ngdoc method
			 * @name  shGoogleAnalytics#postInit
			 * @description performs post-initialization for google analytics
			 */
			postInit:function(){
				// ga('create', _TC, 'auto');  // Creates a tracker.
				// ga('send', 'pageview');
			},
			/**
			 * @ngdoc method
			 * @name shGoogleAnalytics#sendEvent
			 * @description sends an event to google analytics
			 * @param  {String} category the event category
			 * @param  {String} action   the event action
			 * @param  {String} label    the event label
			 * @param  {Integer} value    the event value
			 */
			sendEvent:function(category,action,label,value){
				var _df = $q.defer();
				// ga('send',{
				// 	'hitType':'event',
				// 	'eventCategory':category,
				// 	'eventAction':action,
				// 	'eventLabel':label,
				// 	'eventValue':value,
				// 	'hitCallback':function(){
				// 		_df.resolve();
				// 	}
				// });
def.resolve();
				return _df.promise;
			},
		};
	
		return new _ea();
	}]);
/**
 * @ngdoc service
 * @name shGoogleMaps
 * @module SuhExternal
 * @description 
 * A service to connect to Google Maps. 
 */

 angular.module('SuhExternal')
 	.factory('shGoogleMaps', [function () {
 		
 	
 		return {
 	
 		};
 	}]);
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
/** 
 * @ngdoc provider
 * @module SuhExternal
 * @name shFacebookProvider
 * @description
 * A provider for the {@link shFacebook shFacebook} service. 
 */
angular.module('SuhExternal')
	.provider('shFacebook', ['$q','shEventEmitter',function ($Q,_EM) {
		var appId = '', 
			loadFacebook = function loadFacebook(d,s,id,fn){
		    var js, fjs = d.getElementsByTagName(s)[0];
		    if (d.getElementById(id)) {
		    	if (fn){
		    		fn();
		    	}
		    	return;
		    }
		    js = d.createElement(s); js.id = id;
		    js.src = "//connect.facebook.net/en_US/sdk.js";
		    fjs.parentNode.insertBefore(js, fjs);
		},
		handleResponse = function handleResponse(e){
			if (!e || e.error) {
                defer.reject('Error occured');
            } else {
                defer.resolve(e);
            }
		},
		facebookResponse = function facebookResponse(defer){
			return handleResponse;
		};

		/**
		 * @ngdoc method
		 * @name shFacebookProvider#setResponseHandler
		 * @module SuhExternal
		 * @param {function} fn the function to use a response handler. 
		 * @description
		 * Sets the default response handler, this is useful for unit-testing 
		 * as mocks can be used instead. 
		 */
		this.setResponseHandler = function(fn){
			handleResponse = fn;
		};

		/**
		 * @ngdoc method
		 * @name shFacebookProvider#setResponseWrapper
		 * @module SuhExternal
		 * @param {function} fn the function to use as a response handler wrapper. 
		 * @description 
		 * Sets the default response handler wrapper of the provider. 
		 */
		this.setResponseWrapper = function(fn){
			facebookResponse = fn;
		};

		/**
		 * @ngdoc method
		 * @name shFacebookProvider#setAppId
		 * @module SuhExternal
		 * @param {any} id the Facebook application id. 
		 * @description
		 * Sets the Facebook application id. 
		 */

		this.setAppId = function(aId){
			appId = aId;
		};

		 /**
		  * @ngdoc event
		  * @name shFacebook#FBLoginStatusChange
		  * @module SuhExternal
		  * @type {object}
		  * @eventType triggered on {@link shFacebook#listeners listeners}
		  * @param {type} type the event type `FBLoginStatusChange`
		  * @param {object} data an object representing the change 
		  * @description
		  * Triggered whenever a change on the Facebook login status is introduced. 
		  * This includes: 
		  *
		  * 1. Login attempt
		  * 2. Logout attempt
		  * 3. Requesting login status
		  */

		 


		var shFacebook = function shFacebook(aId) {
			_EM.call(this);
			this.listeners = {};
			this.loginData = {};
			if (!aId){
				throw new Error('Facebook application ID cannot be empty'); 
			}
			this.appId = aId;
			if (!window.FB){
				window.fbAsyncInit = angular.bind(this,self.onLoaded,window.fbAsyncInit);
			}
			loadFacebook(document, 'script', 'facebook-jssdk',
				angular.bind(this,this.onLoaded()));
		};
		
		shFacebook.prototype = angular.extend({},_EM.prototype,{
			initialize:function(){
				FB.init({
					appId: this.appId,
					status: true, 
					cookie: true, 
					xfbml: true,
					version: 'v2.3'
				});
			},
			/**
			 * @ngdoc method
			 * @name shFacebook#getPermissions
			 * @module SuhExternal
			 * @returns {Promise} an angular promise
			 * @description
			 * Returns a promise that is resolved with the permissions and their status `granted` or `declined`
			 */
			getPermissions:function(){
				return this.__get('/me/permissions');
			},
			/**
			 * @ngdoc method
			 * @name shFacebook#hasPermission
			 * @module SuhExternal 
			 * @param {string|Array<string>} either a string representing a permission name, or an array of strings representing permission names. 
			 * @returns {Promise} an angular promise
			 * @description
			 * Returns a promise that is either resolved with a true or reject with a false, depending on the existence of the permission(s) 
			 */
			hasPermission:function(perm){
				return this.getPermissions()
					.then(function(e){
						var data = e.data || [],i,l=data.length,
						perms = angular.isArray(perm)?perm.slice(0):[perm],
						item,found=false;
						while((item=perms.shift())){
							found = false;
							for(i=0;i<l;i++){
								if (data[i].permission == item){
									found = true;
									break;
								}
							}
							if(!found){
								return false;
							}
						}
						return true;
					},function(f){
						return false;
					});
			},
			/**
			 * @ngdoc method
			 * @name shFacebook#resendPermissionRequest
			 * @module SuhExternal
			 * @param {Array<string>} perms an array of permissions to request. 
			 * @description
			 * Resends a login request with the requested permissions, this can be useful 
			 * if the user didn't approve all the permissions the first time he/she logged into
			 * the application. 
			 */
			resendPermissionRequest:function(perms){
				FB.login(this.onLoginStatusChange,{
					scope:perms,
					auth_type:'rerequest'
				});
			},
			/**
			 * @ngdoc method
			 * @name shFacebook#login
			 * @module SuhExternal
			 * @param {scope} the permissions to request for the app. 
			 * @description
			 * Sends a login request to Facebook, this will show a popup to go through 
			 * the login process. 
			 */
			login:function(scope){
				var s = scope?{'scope':scope}:undefined;
				FB.login(angular.bind(this,this.onLoginStatusChange),s);
			},
			/**
			 * @ngdoc method
			 * @name shFacebook#logout
			 * @module SuhExternal
			 * @description 
			 * Logs the user out.
			 */
			logout:function(){
				FB.logout(angular.bind(this,this.onLogout));
			},
			/**
			 * @ngdoc method
			 * @name shFacebook#onLogout
			 * @module SuhExternal
			 * @param {object} response
			 * @description
			 * This method is invoked internally once a logout request has returned. 
			 */
			onLogout:function(resp){
				this.trigger('FBLoginStatusChange',{
					type:'FBLoginStatusChange',
					data:{
						status:'logout',
						loginSuccess:false,
						appAccess:false,
						authResponse:resp.authResponse
					}
				});
			},
			/**
			 * @ngdoc method
			 * @name shFacebook#getLoginStatus
			 * @module SuhExternal
			 * @description
			 * Request login status, this method triggers the FB api requesting a login status update
			 * Once it returns it triggers {@link shFacebook#FBLoginStatusChange FBLoginStatusChange} event.
			 * Any object wants to recieve the updates must add a listener to the status change. 
			 */
			getLoginStatus:function(){
				FB.getLoginStatus(angular.bind(this,this.onLoginStatusChange));
			},
			/**
			 * @ngdoc method
			 * @name shFacebook#onLoginStatusChange
			 * @module SuhExternal
			 * @description
			 * Triggered internally upon a login status change. 
			 */
			onLoginStatusChange:function(resp){
				var e = {
					type:'FBLoginStatusChange',
					data:{
						status:'no_info',
						loginSuccess:false,
						appAccess:false,
						authResponse:resp.authResponse
					}
				};
				if (resp.status === 'connected'){
					e.data.status = 'connected';
					e.data.loginSuccess = true;
					e.data.appAccess = true;
				}else if (resp.status === 'not_authorized'){
					e.data.status = 'not_authorized';
					e.data.loginSuccess = true;
					e.data.appAccess = false;
				}
				this.loginData = e;
				this.trigger('FBLoginStatusChange',e);
			},
			/**
			 * @ngdoc method
			 * @name shFacebook#onLoaded
			 * @module SuhExternal
			 * @description
			 * Called internally once the FB api is loaded. 
			 */
			onLoaded:function(fn){
				if (fn && angular.isFunction(fn)){
					fn();
				}
				this.initialize();
			},
			/**
			 * @ngdoc method
			 * @name shFacebook#__get
			 * @module SuhExternal
			 * @param {string} url the url to send to the FB API. 
			 * @param {object} fields the fields to send along with the request. 
			 * @returns {Promise} an angular promise. 
			 * @description 
			 * Sends a request to Facebook OpenGraph. 
			 */
			__get:function(url,fields){
				var self = this, 
				d = $Q.defer();
				FB.api(url||'/me',fields||{},facebookResponse(d));
				return d.promise;
			},
			/**
			 * @ngdoc method
			 * @name shFacebook#__ui
			 * @module SuhExternal
			 * @param {string} url the url to send to the FB API. 
			 * @param {object} fields the fields to send along with the request. 
			 * @returns {Promise} an angular promise. 
			 * @todo {urgent} Add documentation
			 * @description 
			 * Sends a request to Facebook OpenGraph. 
			 */
			__ui:function(params){
				var d = $Q.defer();
				FB.ui(params,facebookResponse(d));
				return d.promise;
			},
			feedLink:function(obj){
				var a = angular.extend({},{
					method:'feed',
				},obj);
				return this.__ui(obj);
			},
			sendLink:function(url){
				return this.__ui({
					method:'send',
					href:url
				});
			},
			shareLink:function(url){
				return this.__ui({
					method:'share',
					href:url
				});
			},
			generateSendUrl:function(url,redirectUrl,display,to){
				var u= url.url || url, 
					ru = url.redirectUrl || redirectUrl || document.URL,
					disp = url.display || display,
					t = url.t || to;
				disp = disp?('&display='+disp):'';
				t = t?('&to='+t):''; 
				return 'http://www.facebook.com/dialog/send?'+
					'app_id=__APP_ID__'+
  					'&link=__URL__'+
  					'&redirect_uri=__REDIRECT_URL__'
  					.replace(/__APP_ID__/,this.appId)
  					.replace(/__URL__/,u)
  					.replace(/__REDIRECT_URL__/,ru)+disp+t;
			},
			shareOpenGraphStory:function(props,actionType){
				var a = props.actionType || actionType || 'og.likes',
					p = props.props || props;
				return this.__ui({
					method:'share_open_graph',
					action_type: a,
					action_properties: JSON.stringify(p)
				});
			},
			generateShareUrl:function(url,redirectUrl,disp){
				var u = url.url || url,
					ru = url.redirectUrl || redirectUrl || document.URL,
					d = url.display || disp || 'popup';
				return 'https://www.facebook.com/dialog/share?'+
					'app_id=__APP_ID__&display=__DISPLAY__&href=__URL__'+
					'&redirect_uri=__REDIRECT_URL__'
					.replace(/__APP_ID__/,this.appId)
					.replace(/__DISPLAY__/,d)
					.replace(/__URL__/,u)
					.replace(/__REDIRECT_URL__/,ru);
			},
			generateOpenGraphStoryUrl:function(actionType,props,redirectUrl,disp){
				var a = actionType.actionType || actionType || 'og.likes',
					pr = actionType.props || props,
					d = actionType.disp || disp || 'popup',
					u = actionType.redirectUrl || redirectUrl || document.URL;
				return 'https://www.facebook.com/dialog/share_open_graph?'+
					'app_id=__APP_ID__' +
					'&display=__DISPLAY__' +
	  				'&action_type=__ACTION_TYPE__' +
	  				'&action_properties='+JSON.stringify(pr)+
	  				'&redirect_uri=__REDIRECT_URL__'
	  				.replace(/__APP_ID__/,this.appId)
	  				.replace(/__DISPLAY__/,d)
	  				.replace(/__ACTION_TYPE__/,a)
	  				.replace(/__REDIRECT_URL__/,u);
			},
			shareCount:function(url){
				var def = $Q.defer();
				$H.get('https://graph.facebook.com/fql?q=SELECT%20like_count,%20total_count,%20share_count,%20click_count,%20comment_count%20FROM%20link_stat%20WHERE%20url%20=%20%27'+url+'%27')
					.success(function(t){
						def.resolve(t.share_count || 0);
					})
					.error(function(e){
						def.resolve(0); 
					});
				return def.promise;
			},
		});
		shFacebook.prototype.constructor = _EM;
		
		/**
		 * @ngdoc service
		 * @name shFacebook
		 * @module SuhExternal
		 * @property {Array} listeners 
		 * @fires {FBLoginStatusChange}
		 * @fires {FBLogout}
		 * @description 
		 * Instantiates a Facebook API wrapper. 
		 */
		this.$get = [function(aId) {
			return new shFacebook(appId||aId);
		}];
	}]);