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
            "name": "shGoogleMaps",
            "href": "api/SuhExternal/service/shGoogleMaps",
            "type": "service"
          }
        ]
      }
    ]
  }
});
