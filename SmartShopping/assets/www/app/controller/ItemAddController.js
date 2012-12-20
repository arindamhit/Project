Ext.define('SmartShoppingApp.controller.ItemAddController', {
			extend : 'Ext.app.Controller',
			config : {
				refs : {
					submitbtn : 'button[name=submitbtn]',
					tfbarcode : '#barcode',
					barcodebtn : 'button[name=scanbtn]'
				},
				control : {
					submitbtn : {
						tap : 'onSubmitButtonTap'
					},

					barcodebtn : {
						tap : 'onBarcodeBtnTap'
					}
				}
			},

			onSubmitButtonTap : function(button, e, options) {
			},

			onBarcodeBtnTap : function(button, e, options) {

				window.plugins.barcodeScanner.scan(function(result) {
							var txtField = Ext.getCmp('barcode');
							txtField.setValue(result.text);

						}, function(error) {
							alert("Scanning failed: " + error);
						});

			}
		})