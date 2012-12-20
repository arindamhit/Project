Ext.define('SmartShoppingApp.profile.tablet', {

			extend : 'Ext.app.Profile',
			config : {
				name : 'Tablet'
			},

			isActive : function() {
				return Ext.os.is.Tablet;
			}

		})