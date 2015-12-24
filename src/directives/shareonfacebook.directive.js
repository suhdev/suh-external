angular.module('SuhExternal')
	.directive('shShareOnFacebook',['shFacebook',function(shFB){
		return {
			restrict:'A',
			scope:false,
			link:function($S,$E,$A){
				var url = $A.shShareOnFacebookUrl || $A.shShareOnFacebook || document.URL; 
				$E.on('click',function(e){
					shFB.shareLink(url); 
				});
			}
		};
	}]);