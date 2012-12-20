Ext.define('SmartShoppingApp.view.AddItemScreen', {
			extend : 'Ext.tab.Panel',

			config : {
				// tabBarPosition : 'bottom',

				defaults : {
					styleHtmlContent : true
				},
				items : [{
							xtype : 'container',
							title : 'Add',
							iconCls : 'addlist',
							scrollable : true,
							// html : 'Home Screen',
							items : [{
										xclass : 'SmartShoppingApp.view.CustomTitle',
										title : 'Add Item'
									}, {
										xclass : 'SmartShoppingApp.view.ItemAdd'

									}]
						}, {
							xtype : 'spacer',
							disabled : true
						}, {
							xtype : 'container',
							layout : "fit",
							title : 'Locate',
							iconCls : 'locate',
							// html : 'Contact Screen',
							items : [{
										xclass : 'SmartShoppingApp.view.CustomTitle',
										title : 'Locate Store'
									}, {
										xclass : 'SmartShoppingApp.view.ItemsinMap',
										margin : '10 10 10 10'
									}

							]
						}, {
							xtype : 'spacer',
							disabled : true
						}, {
							xtype : 'container',
							title : 'Search',
							iconCls : 'search',
							html : 'Contact Screen',
							items : [{
										xclass : 'SmartShoppingApp.view.CustomTitle',
										title : 'Search Cart'
									}]
						}],
				tabBar : {
					docked : 'bottom',
					ui : 'customtab',
					layout : {
						align : 'center',
						pack : 'center',
						type : 'hbox'
					}
				}
			}
		});