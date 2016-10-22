
(function(){
	var module = angular.module('GitHubSummarizer');

	var RepoController = function($scope, $routeParams, github){

		var reponame = $routeParams.reponame;
		var username = $routeParams.username;

		var onRepoLoad = function(data){
			$scope.repo = data;
		};

		var onError = function(reason){
			$scope.error = reason;
		};

		github.getRepoDetails(username, reponame)
				.then(onRepoLoad, onError);

	};

	module.controller('RepoController', RepoController);

})();
