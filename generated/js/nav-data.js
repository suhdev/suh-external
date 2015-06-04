// Meta data used by the AngularJS docs app
angular.module('navData', [])
  .value('NG_NAVIGATION', {
  "api": {
    "id": "api",
    "name": "API",
    "navGroups": [
      {
        "name": "SuhExternal",
        "href": "api/SuhExternal",
        "type": "group",
        "navItems": [
          {
            "name": "service",
            "type": "section",
            "href": "api/SuhExternal/service"
          },
          {
            "name": "shFacebook",
            "href": "api/SuhExternal/service/shFacebook",
            "type": "service"
          },
          {
            "name": "shGoogleAnalytics",
            "href": "api/SuhExternal/service/shGoogleAnalytics",
            "type": "service"
          },
          {
            "name": "shGoogleGeocoding",
            "href": "api/SuhExternal/service/shGoogleGeocoding",
            "type": "service"
          },
          {
            "name": "shGoogleMaps",
            "href": "api/SuhExternal/service/shGoogleMaps",
            "type": "service"
          },
          {
            "name": "shGooglePlaces",
            "href": "api/SuhExternal/service/shGooglePlaces",
            "type": "service"
          },
          {
            "name": "provider",
            "type": "section",
            "href": "api/SuhExternal/provider"
          },
          {
            "name": "shFacebookProvider",
            "href": "api/SuhExternal/provider/shFacebookProvider",
            "type": "provider"
          }
        ]
      }
    ]
  }
});
