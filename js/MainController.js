(function(){
	var app = angular.module('GitHubSummarizer');

	var MainController = function($scope, $location) {

		$scope.search = function(username) {
			$location.path('/user/' + username);
		}	
	};

	app.controller('MainController', ['$scope', '$location', MainController]);

})();

