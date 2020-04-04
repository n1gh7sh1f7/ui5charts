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
			this.getView().setModel(new sap.ui.model.json.JSONModel({
				measures: [
					{
						name: "CO₂",
						value: "CO2"
					},
					{
						name: "CO₂e (WTT)",
						value: "CO2_E_WTT"
					},
					{
						name: "CO₂e (TTW)",
						value: "CO2_E_TTW"
					}
				],
				availableMeasures: [],
				dimensions: [
					{
						name: "Fiscal year",
						value: "FY"
					},
					{
						name: "Fiscal period",
						value: "FP"
					}
				],
				availableDimensions: [],
				colors: [],
				availableColors: []
			}), "chartConfig");
		}
	});
});