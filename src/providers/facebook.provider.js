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
		 * @ngdoc type
		 * @name Facebook
		 * @module SuhExternal
		 * @param {any} appId the application id. 
		 * @constructs
		 * @fires {FBLoginStatusChange}
		 * @fires {FBLogout}
		 * @description 
		 * A facebook API wrapper. 
		 */

		 /**
		  * @ngdoc event
		  * @name Facebook#FBLoginStatusChange
		  * @module SuhExternal
		  * @type {object}
		  * @eventType triggered on {@link Facebook#listeners listeners}
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
			 * @name Facebook#getPermissions
			 * @methodOf Facebook
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
			 * @name Facebook#hasPermission
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
			 * @name Facebook#resendPermissionRequest
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
			 * @name Facebook#login
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
			 * @name Facebook#logout
			 * @module SuhExternal
			 * @description 
			 * Logs the user out.
			 */
			logout:function(){
				FB.logout(angular.bind(this,this.onLogout));
			},
			/**
			 * @ngdoc method
			 * @name Facebook#onLogout
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
			 * @name Facebook#getLoginStatus
			 * @module SuhExternal
			 * @description
			 * Request login status, this method triggers the FB api requesting a login status update
			 * Once it returns it triggers {@link Facebook#FBLoginStatusChange FBLoginStatusChange} event.
			 * Any object wants to recieve the updates must add a listener to the status change. 
			 */
			getLoginStatus:function(){
				FB.getLoginStatus(angular.bind(this,this.onLoginStatusChange));
			},
			/**
			 * @ngdoc method
			 * @name Facebook#onLoginStatusChange
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
			 * @name Facebook#onLoaded
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
			 * @name Facebook#__get
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
			 * @name Facebook#__ui
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
		});
		shFacebook.prototype.constructor = _EM;
		
		/**
		 * @ngdoc service
		 * @name shFacebook
		 * @module SuhExternal
		 * @returns {Facebook} a new instance of the `Facebook` API wrapper object. 
		 * @description 
		 * Instantiates a Facebook API wrapper. 
		 */
		this.$get = [function(aId) {
			return new shFacebook(appId||aId);
		}];
	}]);