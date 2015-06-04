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