sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";
	return Controller.extend("res.controller.Base", {
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("Home", {}, true);
			}
		},
		onRouteMatched: function () {
			var oChartConfigModel = new sap.ui.model.json.JSONModel({
				measures: [
					{
						name: "Stock",
						value: "quantity"
					}
				],
				availableMeasures: [],
				dimensions: [
					{
						name: "Yard",
						value: "yardName"
					}
				],
				availableDimensions: [],
				colors: [
					{
						name: "Resource type",
						value: "resourceType"
					}
				],
				availableColors: []
			});
			this.getView().setModel(oChartConfigModel, "chartConfig");
			oChartConfigModel.refresh(true);
		}
	});
});