Ext.define('SmartShoppingApp.view.CustomTitle', {
			extend : 'Ext.TitleBar',
			id: 'CustomTitle',

			config : {
				docked : 'top',
				ui : 'green',
				items : [{

							xtype : 'button',
							baseCls : 'shoppingcartbtn',
							width : 48,
							height : 40,
							badgeText : "2"

						}]
			}
		})