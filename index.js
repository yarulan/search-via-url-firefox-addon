var sdk = {
	selection: require("sdk/selection"),
	tabs: require("sdk/tabs"),
	cm: require("sdk/context-menu"),
	panel: require("sdk/panel"),
	self: require("sdk/self"),
	simpleStorage: require("sdk/simple-storage"),
	simplePrefs: require("sdk/simple-prefs")
};

function loadSettings() {
	return sdk.simpleStorage.storage.settings || {
		items: [{
			label: "Lingvo",
			url: "www.lingvo.ua/ru/Translate/en-ru/%s",
			icon: "http://www.lingvo.ua/favicon.ico"
		}, {
			label: "Yandex Maps",
			url: "https://maps.yandex.ua/?text=%s",
			icon: "https://yandex.ua/maps/favicon.ico"
	}]}
}

var getSettingsPanel = (function() {
	var settingsPanel;

	return function() {
		if (!settingsPanel) {
			settingsPanel = sdk.panel.Panel({
				width: 800,
				// height: 600,
				contentURL: './settings/settings.html',
				contentScriptFile: './settings/settings-content-script.js',
				onHide: function() {
					this.port.emit('getSettingsRequest');
					settingsPanel = null;
					this.destroy;
				}
			});

			settingsPanel.port.emit('settingsLoaded', JSON.stringify(loadSettings()));

			settingsPanel.port.on('getSettingsResponse', function(settings) {
				settings = JSON.parse(settings);
				sdk.simpleStorage.storage.settings = settings;
				makeMenuItems(settings.items);
			});
		}
		return settingsPanel;
	}
})();

var menuItems = [];

function makeMenuItems(items) {
	menuItems.forEach(function(item) { item.destroy(); });
	menuItems = [];
	items.forEach(function(item) {
		if (item.url) {
			var menuItem = sdk.cm.Item({
				label: item.label || item.url,
				image: item.icon,
				context: sdk.cm.SelectionContext(),
				contentScript: 'self.on("click", function(node, data) { self.postMessage(data)});',
				onMessage: function(data) {
					var url = item.url;
					if (!url.startsWith('http')) url = "http://" + url;
					sdk.tabs.open(url.replace('%s', sdk.selection.text));
				}
			});
			menuItems.push(menuItem);
		}
	});
}

makeMenuItems(loadSettings().items);

sdk.simplePrefs.on('openSettingsPanel', function() {
	getSettingsPanel().show();
});

var button = require("sdk/ui/button/action").ActionButton({
	id: "open-settings-panel-button",
	label: "Open settings...",
	icon: {
		"16": "./settings/icon-16.png"
	},
	onClick: function(state) {
		getSettingsPanel().show();
	}
});