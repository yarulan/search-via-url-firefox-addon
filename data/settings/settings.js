(function(addon) {
	var app = angular.module('app', []);

	function Controller($scope, addon) {
		$scope.add = function() {
			$scope.settings.items.push({});
		}

		$scope.remove = function(item) {
			$scope.settings.items.splice($scope.settings.items.indexOf(item), 1);
		}

		addon.port.on('settingsLoaded', function(settings) {
			$scope.$apply(function() {
				$scope.settings = settings;
			});
		});

		addon.port.on('getSettingsRequest', function() {
			addon.port.emit('getSettingsResponse', angular.toJson($scope.settings));
		});
	}

	app.constant('addon', addon);

	app.controller('Controller', ['$scope', 'addon', Controller]);
})(addon);