
(function(){
	var app = angular.module('githubViewer', ['datatables']);

	var MainController = function($scope, $http, DTOptionsBuilder, $log, $anchorScroll, $location) {

		// $scope.dtOptions = DTOptionsBuilder.newOptions().withDisplay(5);

		var onUserLoad = function(response) {
			$scope.user = response.data;
			$http.get($scope.user.repos_url)
				.then(onReposLoad, onError);
		};

		var onReposLoad = function(response) {
			$scope.repos = response.data;
			$location.hash('userdetails');
			$anchorScroll();
		};

		var onError = function(reason) {
			$scope.error = response.data;
		};

		$scope.search = function(username) {
			// using angular's log service
			$log.info('Searching for ' + username);

			// using $http service to perform ajax get call to github api
			$http.get('https://api.github.com/users/' + username)
				.then(onUserLoad, onError);
		}

		
	};

	app.controller('MainController', ['$scope', '$http', 'DTOptionsBuilder', '$log', '$anchorScroll', '$location', MainController]);

})();

