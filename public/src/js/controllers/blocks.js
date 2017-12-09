'use strict';

angular.module('insight.blocks').controller('BlocksController',
  function($scope, $rootScope, $routeParams, $location, Global, Block, Blocks, BlockByHeight, Richlist) {
  $scope.global = Global;
  $scope.loading = false;

  if ($routeParams.blockHeight) {
    BlockByHeight.get({
      blockHeight: $routeParams.blockHeight
    }, function(hash) {
      $location.path('/block/' + hash.blockHash);
    }, function() {
      $rootScope.flashMessage = 'Bad Request';
      $location.path('/');
    });
  }

  //Datepicker
  var _formatTimestamp = function (date) {
    var yyyy = date.getUTCFullYear().toString();
    var mm = (date.getUTCMonth() + 1).toString(); // getMonth() is zero-based
    var dd  = date.getUTCDate().toString();

    return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]); //padding
  };

  $scope.$watch('dt', function(newValue, oldValue) {
    if (newValue !== oldValue) {
      $location.path('/blocks-date/' + _formatTimestamp(newValue));
    }
  });

  $scope.openCalendar = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.humanSince = function(time) {
    var m = moment.unix(time).startOf('day');
    var b = moment().startOf('day');
    return m.max().from(b);
  };


  $scope.list = function() {
    $scope.loading = true;

    if ($routeParams.blockDate) {
      $scope.detail = 'On ' + $routeParams.blockDate;
    }

    if ($routeParams.startTimestamp) {
      var d=new Date($routeParams.startTimestamp*1000);
      var m=d.getMinutes();
      if (m<10) m = '0' + m;
      $scope.before = ' before ' + d.getHours() + ':' + m;
    }

    $rootScope.titleDetail = $scope.detail;

    Blocks.get({
      blockDate: $routeParams.blockDate,
      startTimestamp: $routeParams.startTimestamp
    }, function(res) {
      $scope.loading = false;
      $scope.blocks = res.blocks;
      $scope.pagination = res.pagination;
    });
  };

  $scope.findOne = function() {
    $scope.loading = true;

    Block.get({
      blockHash: $routeParams.blockHash
    }, function(block) {
      $rootScope.titleDetail = block.height;
      $rootScope.flashMessage = null;
      $scope.loading = false;
      $scope.block = block;
    }, function(e) {
      if (e.status === 400) {
        $rootScope.flashMessage = 'Invalid Transaction ID: ' + $routeParams.txId;
      }
      else if (e.status === 503) {
        $rootScope.flashMessage = 'Backend Error. ' + e.data;
      }
      else {
        $rootScope.flashMessage = 'Block Not Found';
      }
      $location.path('/');
    });
  };
  
  $scope.richlist = function() {
	  $scope.loading = true;
	  var page = ($routeParams.page) ? $routeParams.page : 1;
          var nextPage_ = parseInt(page) + 1;
	  $scope.pageactual = (page==1)? 0 : ((page-1)*20);
	  var previouspageEnable = (page > 1) ? true: false;
	  Richlist.get({
		  page: page
	  },
	  function(list_) {
		  //list_.list.sort(function(a, b){return b.balance - a.balance});
		  $scope.listaddress = list_.list;
		  $scope.totalsupply = list_.totalsupply;
		  $scope.loading = false;
		  var numberPages = parseInt(list_.count / 20);
		  var nextpageEnable = ((page+1) <= numberPages) ? true : false;
		  $scope.lastpage = numberPages;
		  var begin = 1;
		  var finalPage = 1;
		 
		 //page actual ?
		if (page == 1){
		  begin = page;
		  var finalP =  4;
		  while(finalP > numberPages){
			  finalP--;
		  } 
		   finalPage = finalP;
		}else if (page == numberPages){
		  finalPage = page;
		  var initP = page - 4;
		   while(initP < 1){
			  initP++;
		  }
		   begin = initP;
		}else{
                  
		  var lval = page - 1;
		  var rval = numberPages - page;
		  
		  if (lval == rval){
			  begin = page;
			  finalPage = page;
		  }
		  
		  if (lval < rval){
			  var initP  = page - 1;
			  begin = initP;
			  var finalP = initP + 4;
			  while(finalP > numberPages){
				  finalP--;
			  }
			  finalPage = finalP;
		  }else{
			  var finalP = page + 3;
			  
			   while(finalP > numberPages){
				 finalP--;
			   }
			  
			  finalPage = finalP;
			  var initP  = finalP - 4;
			  while(initP < 1){
					finalP++;
			  }
			  begin = initP;
		  }
		}
                console.log(page);
		console.log(begin, finalPage);

		var pages = [];
		var previousID = (previouspageEnable) ? page - 1 : 1;
		
		if (page > 1)
		  pages.push({id: 1, label: "First", disabled: ''});
	  
		pages.push({id: previousID, label: "Previous", disabled: ((!previouspageEnable)?'disabled': '')});
		var i;
		for(i = begin; i <=finalPage; i++ ){
		  var disabled_ = (i == page)? 'disabled' : '';
		  pages.push({id: i, label: i, disabled: disabled_});
		}
		//var nextP = (nextpageEnable) ? nextPage_ : numberPages;

		if (page != numberPages)
		   pages.push({id: nextPage_, label: "Next", disabled: ''});


		  
	    if (page != numberPages)
		   pages.push({id: numberPages, label: "Last", disabled: ''});
	
            $scope.pages = [];
	    $scope.pages = pages;
		  
	  },
	  function(e) {
		  $rootScope.flashMessage = 'Error in Request';
	  });
   };

  $scope.params = $routeParams;

});
