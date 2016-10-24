

(function(){
	var module = angular.module('GitHubSummarizer');

	var ContributorsController = function($scope, $routeParams, github, $log){

		var reponame = $routeParams.reponame;
		var username = $routeParams.username;

		var onContributorsLoad = function(data){
			$scope.contributors = data;
			$log.info($scope.contributors);
		};

		var onError = function(reason){
			$scope.error = reason;
		};

		github.getRepoContributors(username, reponame)
				.then(onContributorsLoad, onError);

	};

	module.controller('ContributorsController', ['$scope', '$routeParams', 'github', '$log', ContributorsController]);

})();

