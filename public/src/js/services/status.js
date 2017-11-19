'use strict';

angular.module('insight.status')
  .factory('Status',
    function($resource) {
      return $resource(window.apiPrefix + '/status', {
        q: '@q'
      });
    })
  .factory('Sync',
    function($resource) {
      return $resource(window.apiPrefix + '/sync');
    })  
  .factory('Supply',
    function($resource) {
      return $resource(window.apiPrefix + '/totalsupply');
    })
  .factory('NetworkHashps',
    function($resource) {
      return $resource(window.apiPrefix + '/networkhashps');
    })
  .factory('PeerSync',
    function($resource) {
      return $resource(window.apiPrefix + '/peer');
    });
