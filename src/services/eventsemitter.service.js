/**
 * @ngdoc service
 * @name shEventEmitter
 * @module SuhExternal
 * @description
 * A service exposing the {@link EventEmitter EventEmitter} constructor to be inherited by
 * other classes. 
 * @returns {constructor} the {@link EventEmitter EventEmitter} constructor
 */

angular.module('SuhExternal')
	.factory('shEventEmitter', [function () {
		/**
		 * @ngdoc type 
		 * @name EventEmitter
		 * @module SuhExternal
		 * @description
		 * An abstract class providing basic implementation for event emitters. 
		 * This class is intended to be inherited from by other classes. 
		 */
		function Emitter(){
			/**
			 * @ngdoc property
			 * @name EventEmitter#listeners
			 * @module SuhExternal
			 * @type {object}
			 * @propertyOf EventEmitter
			 * @description
			 * An object literal in which the keys are the events names, and 
			 * the values are arrays of listeners. 
			 */
			this.listeners = {};
		}

		Emitter.prototype = {
			/**
			 * @ngdoc method
			 * @name EventEmitter#addEventListener
			 * @module SuhExternal
			 * @param {string} evtName the event name (or type)
			 * @param {function} listener the listener function to call when the event is triggered. 
			 * @param {object} [ctx] the object on which the listener should be called. 
			 * @description 
			 * Add an event listener to a given event type. 
			 */
			addEventListener:function(evtName,listener,ctx){
				this.listeners = this.listeners || {};
				this.listeners[evtName] = this.listeners[evtName] || [];
				this.listeners[evtName].push(ctx?angular.bind(ctx,listener):listener);
			},

			/**
			 * @ngdoc method
			 * @name EventEmitter#removeEventListener
			 * @module SuhExternal
			 * @param {string} evtName the event name (or type)
			 * @param {function} listener the listener function to to remove. 
			 * @description 
			 * Removes an event listener from a given event.  
			 */
			removeEventListener:function(evtName,listener){
				if (!this.listeners[evtName]){
					throw new Error("Event '"+evtName+"' is not registered.");
				}
				var i = this.listeners[evtName].indexOf(listener);
				if (i !== -1){
					this.listeners.splice(i,1);
				}
			},

			/**
			 * @ngdoc method
			 * @name EventEmitter#trigger
			 * @module SuhExternal
			 * @param {string} evtName the event name (or type) of the triggered event
			 * @param {object} e the event object to pass to the listeners
			 * @description
			 * Triggers a given event by calling all event listeners. 
			 */
			trigger:function(evtName,e){
				if (this.listeners[evtName]){
					var list = this.listeners[evtName],i,l;
					for(i=0,l=list.length;i<l;i++){
						list[i](e);
					}
				}
			}
		};
	
		return Emitter;
	}]);