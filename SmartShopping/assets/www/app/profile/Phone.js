Ext.define('SmartShoppingApp.profile.phone', {

			extend : 'Ext.app.Profile',
			config : {
				name : 'Phone'
				
			},

			isActive : function() {
				return Ext.os.is.Phone;
			}

		})