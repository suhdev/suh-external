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