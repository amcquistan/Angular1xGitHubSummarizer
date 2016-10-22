(function(){
	var app = angular.module('GitHubSummarizer');

	

	var MainController = function($scope, $log, $location) {

		$scope.search = function(username) {
			// using angular's log service
			$log.info('Searching for ' + username);

			$location.path('/user/' + username);
		}	
	};

	app.controller('MainController', ['$scope', '$log', '$location', MainController]);

})();

