
(function(){

	var gitHubCharts = function($log){

		var drawLanguagePieChart = function(data) {
			var chartData = new google.visualization.DataTable();
			chartData.addColumn('string', 'Language');
			chartData.addColumn('number', 'Count');
			
			var langStats = {
					rows: 		[],
					languages: 	[] 
			};

			$.each(data, function(idx, repo){
				var langIdx = $.inArray(repo.language, langStats.languages);
				if (langIdx > -1) {
					langStats.rows[langIdx][1] += 1;
				} else {
					langStats.rows.push([repo.language, 1]);
					langStats.languages.push(repo.language);
				}
			});
			
			chartData.addRows(langStats.rows);
			var options = {
				legend: 'none',
				width: 250,
				height: 250,
				pieSliceText: 'label',
				chartArea: {width: '100%', height: '90%'}
			};

			var chart = new google.visualization.PieChart(document.getElementById('lang_pie'));
			chart.draw(chartData, options);	
		};

		

		// return object for public api of gitHubCharts service functionality
		return {
			drawLanguagePieChart: drawLanguagePieChart,
			createTimeSeries: createTimeSeries

		};
	};

	var module = angular.module('GitHubSummarizer');

	// register gitHubCharts service with module
	module.factory('gitHubCharts', gitHubCharts);
})();

