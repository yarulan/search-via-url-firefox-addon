self.port.on('getSettingsRequest', function() {
	self.port.emit('getSettingsResponse', unsafeWindow.settings);
});

self.port.on('settingsLoaded', function(settings) {
	window.postMessage({
		type: 'settingsLoaded',
		payload: settings
	}, '*');
});