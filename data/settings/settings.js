(function(window) {
	console.log("XXXXXXXXXXXXX");
	var app = angular.module('app', []);

	function Controller($scope, window) {
		$scope.add = function() {
			$scope.settings.items.push({});
		}

		$scope.remove = function(item) {
			$scope.settings.items.splice($scope.settings.items.indexOf(item), 1);
		}

		$scope.$watch(function() {
			window.settings = angular.toJson($scope.settings);
		});

		window.addEventListener('message', function(message) {
			message = message.data;
			if (message.type = 'settingsLoaded') {
				var settings = JSON.parse(message.payload);
				$scope.$apply(function() {
					$scope.settings = settings;
				});
			}
		});
	}

	app.controller('Controller', ['$scope', 'window', Controller]);
	app.constant('window', window);
})(window);