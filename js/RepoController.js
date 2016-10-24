
(function(){
	var module = angular.module('GitHubSummarizer');

	var RepoController = function($scope, $routeParams, github, gitHubCharts){

		var reponame = $routeParams.reponame;
		var username = $routeParams.username;

		var onRepoLoad = function(data){
			$scope.repo = data;
			google.charts.setOnLoadCallback(function(){
				gitHubCharts.drawCommitsChart(data);
			});
			return $scope.repo;
		};

		var onError = function(reason){
			$scope.error = reason;
		};

		github.getRepoDetails(username, reponame)
				.then(onRepoLoad, onError);

	};

	module.controller('RepoController', ['$scope', '$routeParams', 'github', 'gitHubCharts', RepoController]);

})();
