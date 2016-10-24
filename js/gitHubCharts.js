
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

		var createTimeSeries = function(data) {
			var dateData = {
				uniqueNumericDates: [],
				dates: [],
				bins: [],
				rows: []
			};
			// create a sortable dates array of type number and format yyyymmdd
			$.each(data, function(idx, item){
				var date = parseDateToNumeric(new Date(item));
				var dateIdx = $.inArray(date, dateData.uniqueNumericDates);
				if (dateIdx < 0) {
					dateData.uniqueNumericDates.push(date);
				} 
				dateData.dates.push(new Date(item));
			});

			dateData.uniqueNumericDates.sort();
			var uniqueUpperDate = parseNumericDate(dateData.uniqueNumericDates[dateData.uniqueNumericDates.length-1]),
				uniqueLowerDate = parseNumericDate(dateData.uniqueNumericDates[0]),
				bins = 10,
				range = daysDiff(uniqueLowerDate,uniqueUpperDate);

			$log.info('Summary 1: ');
			$log.info('  uniqueUpperDate ' + uniqueUpperDate);
			$log.info('  uniqueLowerDate ' + uniqueLowerDate);
			$log.info('  range ' + range);

			// just use data points	
			if (dateData.uniqueNumericDates.length < 10 
				|| range < 31) {
				$.each(dateData.uniqueNumericDates, function(binIdx, uniqueDate){
				var startDate = parseNumericDate(uniqueDate);
				var endDate = null;
				if (binIdx === (dateData.uniqueNumericDates.length-1)) {
					endDate = new Date(startDate.setDate(startDate.getDate() + 1));
				} else {
					endDate = parseNumericDate(dateData.uniqueNumericDates[binIdx + 1]);
				}
				var bin = {
					dateDisplay: startDate.getMonth() + '-' + startDate.getDate() + '-' + startDate.getFullYear(),
					count: 0,
					lower: startDate,
					upper: endDate 
				};
				$.each(dateData.dates, function(dateIdx, date){
					if (date >= bin.lower && date < bin.upper)
						bin.count += 1;
				});

				dateData.bins.push(bin);
			});
			} else {
				var binWidth = Math.floor(range / bins), // size in days
					startDate = new Date(uniqueLowerDate),
					endDate = new Date(uniqueLowerDate.setDate(uniqueLowerDate.getDate() + binWidth));
				for(var i=0; i<bins; i++) {	
					$log.info(i + '.  Binwidth: ' + binWidth); 
					$log.info('   startDate ' + startDate);
					$log.info('   endDate ' + endDate);
					var bin = {
						dateDisplay: startDate.getMonth() + '-' + startDate.getDate() + '-' + startDate.getFullYear(),
						count: 0,
						lower: startDate,
						upper: endDate
					};
					$.each(dateData.dates, function(dateIdx, date){
						if (date >= bin.lower && date < bin.upper)
							bin.count += 1;
					});

					dateData.bins.push(bin);
					startDate = new Date(startDate.setDate(startDate.getDate() + binWidth));
					endDate = new Date(endDate.setDate(endDate.getDate() + binWidth));
				}
			}

			$log.info('dateData Summary 2: ');
			$log.info(dateData);

			$.each(dateData.bins, function(idx, bin){
				dateData.rows.push([bin.dateDisplay, bin.count]);
			});

			return dateData;
		};

		var parseNumericDate = function(dateNumeric) {
			var year = Math.floor(dateNumeric / 10000);
			var remainder = dateNumeric % 10000;
			var month = Math.floor(remainder / 100) - 1;
			var day = remainder % 100;
			var date = new Date(year, month, day);

			// $log.info('Parsing Numeric to Date');
			//$log.info('  Given:  ' + dateNumeric);
			//$log.info('  Return: ' + date);
			return date;
		};

		var parseDateToNumeric = function(date){
			var dateNumeric = (date.getFullYear() * 10000) + ((date.getMonth() + 1) * 100) + date.getDate();
			//$log.info('Parsing to Numeric Date');
			//$log.info('  Given:  ' + date);
			//$log.info('  Return: ' + dateNumeric);
			return dateNumeric;
		};

		var daysDiff = function(startDate, endDate) {
			var miliSecPerDay = 60 * 60 * 24 * 1000;
			return Math.floor((endDate-startDate) / miliSecPerDay);
		};

		var drawCommitsChart = function(data) {
			var datesData = createTimeSeries(data.commitdates);

			var chartData = new google.visualization.DataTable();
			chartData.addColumn('string', 'X');
			chartData.addColumn('number', 'Commits');
			chartData.addRows(datesData.rows);

			var options = {
				hAxis: {title: 'Time'},
				vAxis: {title: 'Commits'},
				legend: 'none'
			};

			var chart = new google.visualization.LineChart(document.getElementById('commits_chart'));
			chart.draw(chartData, options);
		};

		// return object for public api of gitHubCharts service functionality
		return {
			drawLanguagePieChart: drawLanguagePieChart,
			createTimeSeries: createTimeSeries,
			drawCommitsChart: drawCommitsChart
		};
	};

	var module = angular.module('GitHubSummarizer');

	// register gitHubCharts service with module
	module.factory('gitHubCharts', gitHubCharts);
})();

