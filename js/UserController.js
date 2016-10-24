(function(){
	var app = angular.module('GitHubSummarizer');

	var UserController = function($scope, github, $routeParams, $log, gitHubCharts) {

		var drawLanguageChart = function() {
			
		};

		var onUserLoad = function(data) {
			$scope.user = data;
			github.getRepos($scope.user)
				.then(onReposLoad, onError)
				.then(gitHubCharts.drawLanguagePieChart, onError);
		};

		var onReposLoad = function(data) {
			$scope.repos = data;
			return $scope.repos;
		};

		var onError = function(reason) {
			$scope.error = response.data;
		};

		$scope.username = $routeParams.username;
		github.getUser($scope.username)
				.then(onUserLoad, onError);
	};

	app.controller('UserController', ['$scope', 'github','$routeParams', '$log', 'gitHubCharts', UserController]);

})();

