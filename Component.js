sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/format/NumberFormat",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format"
], function (UIComponent, NumberFormat, ChartFormatter, Format) {
    "use strict";
    $.sap.require("sap.m.MessageBox");
    $.sap.require("sap.m.MessageToast");
    var chartFormatter = ChartFormatter.getInstance();
    chartFormatter.registerCustomFormatter("ShortFloat", function (value) {
        return NumberFormat.getFloatInstance({
            style: "short",
            decimals: 2
        }).format(value);
    });
    chartFormatter.registerCustomFormatter("StandardFloat", function (value) {
        return NumberFormat.getFloatInstance({
            style: "standard",
            decimals: 2
        }).format(value);
    });
    Format.numericFormatter(chartFormatter);

    return UIComponent.extend("res.Component", {
        metadata: {
            manifest: "json"
        },
        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
        }
    });
});