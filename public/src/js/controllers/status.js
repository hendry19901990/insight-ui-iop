'use strict';

angular.module('insight.status').controller('StatusController',
  function($scope, $routeParams, $location, Global, Status, Sync, getSocket, Supply) {
    $scope.global = Global;
	
	var totalCoins = 0;

    $scope.getStatus = function(q) {
	  getNetworkHashps();
      Status.get({
          q: 'get' + q
        },
        function(d) {
          $scope.loaded = 1;
          angular.extend($scope, d);
        },
        function(e) {
          $scope.error = 'API ERROR: ' + e.data;
        });
    };
	
	var getNetworkHashps = function(){
		NetworkHashps.get({},
		 function(data){
			$scope.networkHashps = data.networkHashps;
		 },
		  function(e) {
			$scope.networkHashps = 0;
		  }
		);
	};

    $scope.humanSince = function(time) {
      var m = moment.unix(time / 1000);
      return m.max().fromNow();
    };
	
	
	$scope.startSupply = function(){
		Supply.get({},
		 function(data){
			$scope.Supply = data.coins;
		 },
		  function(e) {
			$scope.Supply = totalCoins;
		  }
		);
	};

    var _onSyncUpdate = function(sync) {
      $scope.sync = sync;
    };

    var _startSocket = function () {
      socket.emit('subscribe', 'sync');
      socket.on('status', function(sync) {
        _onSyncUpdate(sync);
      });
    };
    
    var socket = getSocket($scope);
    socket.on('connect', function() {
      _startSocket();
    });


    $scope.getSync = function() {
      _startSocket();
      Sync.get({},
        function(sync) {
          _onSyncUpdate(sync);
        },
        function(e) {
          var err = 'Could not get sync information' + e.toString();
          $scope.sync = {
            error: err
          };
        });
    };
  });
