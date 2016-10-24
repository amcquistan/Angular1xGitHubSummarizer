
(function(){

	/**
	 * github is a service which abstracts away ajax calls to the
	 * GitHub.com api to retrieve information on public repos.
	 * 
	 * github service is implemented in the revealing module pattern
	 * which exposes two methods:
	 * 
	*/
	var github = function($http){
		
		/**
		 * private implementation of ajax api call to github for retrieving user info
		 * @param string username
		 * @return promise
		*/
		var getUser = function(username){
			return $http.get('https://api.github.com/users/' + username)
						.then(function(response){
							return response.data;
						});
		};

		/**
		 * private implementation of ajax api call to github for retrieving user repos 
		 * @param string username
		 * @return promise
		*/
		var getRepos = function(user){
			return $http.get(user.repos_url)
						.then(function(response){
							return response.data;
						});
		};

		var getRepoDetails = function(username, reponame){
			var repo;
			var url = 'https://api.github.com/repos/' + username + '/' + reponame;

			return $http.get(url)
						.then(function(response){
							repo = response.data;
							return $http.get(url + '/commits');
						})
						.then(function(response){
							repo.commits = response.data;
							var dates = [];
							$.each(repo.commits, function(idx, commit){
								dates.push(new Date(commit.commit.author.date));
							});
							repo.commitdates = dates;
							return repo;
						});
		};

		// return object for public api of github service functionality
		return {
			getUser: getUser,
			getRepos: getRepos,
			getRepoDetails: getRepoDetails
		};
	};

	var module = angular.module('GitHubSummarizer');

	// register github service with module
	module.factory('github', github);
})();
