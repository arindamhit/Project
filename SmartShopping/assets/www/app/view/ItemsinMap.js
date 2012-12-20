Ext.define('SmartShoppingApp.view.ItemsinMap', {
			extend : 'Ext.Container',
			id : 'ItemsinMap',
			config : {

				layout : 'card',
				items : [{
							xtype : 'map',
							useCurrentLocation : true,
							mapOptions : {
								zoom : 12,
								navigationControl : true,
								navigationControlOptions : {
									style : google.maps.NavigationControlStyle.DEFAULT
								}
							}

						}]

			}
		})