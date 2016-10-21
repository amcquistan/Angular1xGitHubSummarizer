
(function(){
	var app = angular.module('githubViewer', ['datatables']);

	var MainController = function($scope, $http, DTOptionsBuilder) {

		// $scope.dtOptions = DTOptionsBuilder.newOptions().withDisplay(5);

		var onUserLoad = function(response) {
			$scope.user = response.data;
			$http.get($scope.user.repos_url)
				.then(onReposLoad, onError);
		};

		var onReposLoad = function(response) {
			$scope.repos = response.data;

		};

		var onError = function(reason) {
			$scope.error = response.data;
		};

		$scope.search = function(username) {
			$http.get('https://api.github.com/users/' + username)
				.then(onUserLoad, onError);
		}

		
	};

	app.controller('MainController', ['$scope', '$http', 'DTOptionsBuilder', MainController]);

})();

