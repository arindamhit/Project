Ext.define('SmartShoppingApp.view.ItemAdd', {
	extend : 'Ext.Container',
	id : 'ItemAdd',
	config : {

		items : [{
					xtype : 'container',
					layout : {
						type : 'hbox'
					},
					items : [{
								xtype : 'textfield',
								name : 'barcode',
								id: 'barcode',
								flex : 2
							}, {
								xtype : 'button',
								name : 'scanbtn',
								margin : '0 0 0 10',
								ui : 'confirm',
								text : 'Scan Barcode',
								flex : 1
							}]
				}, {

					xtype : 'fieldset',
					margin : '10 0 0 0',
					items : [{
								xtype : 'textfield',
								name : 'firstName',
								label : 'Item Name'

							}, {
								xtype : 'textfield',
								name : 'lastName',
								label : 'Model Name'
							}, {
								xtype : 'textfield',
								name : 'lastName',
								label : 'Location'

							}, {
								xtype : 'selectfield',
								name : 'lastName',
								label : 'Category'
							}, {
								xtype : 'datepickerfield',
								margin : '5 0 0 0',
								label : "Reminder",
								value : new Date()
							}]

				},

				{

					xtype : 'container',
					layout : {
						type : 'hbox'
					},
					items : [{
						flex : 4,
						margin : '10 0 0 0',
						html : '<img style="width:100%;" id="capturedimage" name="capturedimage" src="app/images/frame.png" />'

					}, {
						xtype : 'panel',
						flex : 1,
						layout : {
							type : 'vbox',
							pack : 'center'
						},
						items : [{
									xtype : 'button',
									baseCls : 'capturebtn',
									id : 'capturebtn',
									flex : 1,
									height : 64,
									width : 64

								},

								{
									xtype : 'button',
									baseCls : 'choosephotobtn',
									id : 'choosephotobtn',
									height : 64,
									flex : 1,
									width : 64
								}]

					}]
				}, {
					xtype : 'container',
					margin : '20 0 0 0',
					items : [{
								xtype : 'button',
								name : 'submitbtn',
								text : 'Add to List',
								ui : 'confirm',
								width : 150,
								height : 40,
								margin : 'auto'

							}]

				}]

	}

})