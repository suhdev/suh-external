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
            "name": "provider",
            "type": "section",
            "href": "api/SuhExternal/provider"
          },
          {
            "name": "shFacebookProvider",
            "href": "api/SuhExternal/provider/shFacebookProvider",
            "type": "provider"
          },
          {
            "name": "type",
            "type": "section",
            "href": "api/SuhExternal/type"
          },
          {
            "name": "Facebook",
            "href": "api/SuhExternal/type/Facebook",
            "type": "type"
          },
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
          }
        ]
      }
    ]
  }
});
