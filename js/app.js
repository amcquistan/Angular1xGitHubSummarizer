
(function(){

	// create app module
	var app = angular.module('GitHubSummarizer', ['ngRoute','datatables']);

	// define routes
	app.config(function($routeProvider){
		$routeProvider
			.when('/main', {
				templateUrl: 'main.html',
				controller: 'MainController'
			})
			.when('/user/:username', {
				templateUrl: 'user.html',
				controller: 'UserController'
			})
			.when('/repo/:username/:reponame', {
				templateUrl: 'repo.html',
				controller: 'RepoController'
			})
			.otherwise({redirectTo: '/main'});
	});

	// load google charts 
	google.charts.load('current', {'packages': ['corechart', 'line']});
	google.charts.setOnLoadCallback(function(){
		angular.bootstrap(document.body, ['GitHubSummarizer']);
	});
	
})();

