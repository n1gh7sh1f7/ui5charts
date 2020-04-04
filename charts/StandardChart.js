sap.ui.define(
    [
        "sap/m/PanelRenderer",
        "com/bearingpoint/ChartContainer",
        "sap/suite/ui/commons/ChartContainerContent",
        "com/bearingpoint/SimpleChart"
    ],
    function (PanelRenderer, ChartContainer, ChartContainerContent, SimpleChart) {
        "use strict";
        $.sap.require("com.bearingpoint.ChartFeedItem");
        var BEStandardChart = SimpleChart.extend("com.bearingpoint.StandardChart", {
            renderer: PanelRenderer,
            metadata: {
                properties: {
                    containerTitle: {
                        type: "string",
                        defaultValue: ""
                    },
                    chartTitle: {
                        type: "string",
                        defaultValue: ""
                    },
                    showFullScreen: {
                        type: "boolean",
                        defaultValue: true
                    },
                    showZoom: {
                        type: "boolean",
                        defaultValue: true
                    },
                    showLegend: {
                        type: "boolean",
                        defaultValue: false
                    },
                    showLegendButton: {
                        type: "boolean",
                        defaultValue: true
                    },
                    showChartTitle: {
                        type: "boolean",
                        defaultValue: false
                    },
                    enableDownload: {
                        type: "boolean",
                        defaultValue: false
                    },
                    downloadFileName: {
                        type: "string",
                        defaultValue: "Chart"
                    }
                },
                aggregations: {}
            }
        });

        BEStandardChart.prototype.setContainerTitle = function (sInput) {
            this._chartContainer.setTitle(sInput);
            this.setProperty("title", sInput);
        };

        BEStandardChart.prototype.setChartTitle = function (sInput) {
            this._setChartTitle(sInput);
            this.setProperty("chartTitle", sInput);
            this.setShowChartTitle(true);
        };

        BEStandardChart.prototype.setShowChartTitle = function (bInput) {
            this._setShowChartTitle(bInput);
            this.setProperty("showChartTitle", bInput);
        };

        BEStandardChart.prototype.setShowFullScreen = function (bInput) {
            this._chartContainer.setShowFullScreen(bInput);
            this.setProperty("showFullScreen", bInput);
        };

        BEStandardChart.prototype.setShowZoom = function (bInput) {
            this._chartContainer.setShowZoom(bInput);
            this.setProperty("showZoom", bInput);
        };

        BEStandardChart.prototype.setShowLegendButton = function (bInput) {
            this._chartContainer.setShowLegendButton(bInput);
            this.setProperty("showLegendButton", bInput);
        };

        BEStandardChart.prototype.setShowLegend = function (bInput) {
            this._chartContainer.setShowLegend(bInput);
            this.setProperty("showLegend", bInput);
        };

        BEStandardChart.prototype.setEnableDownload = function (bInput) {
            var that = this;
            this.setProperty("enableDownload", bInput);
            if (bInput) {
                this.addButton("download", {
                    icon: "sap-icon://download",
                    tooltip: "DOWNLOAD",
                    press: function () {
                        that.downloadChart(that.getDownloadFileName());
                    }
                });
            } else {
                this.removeButton("download");
            }
        };

        BEStandardChart.prototype.addButton = function (btnID, oInput) {
            if (oInput instanceof sap.ui.core.Control) {
                this._chartContainer.addCustomIcon(oInput);
            } else {
                this._chartContainer.addCustomIcon(
                    new sap.ui.core.Icon({
                        src: oInput.icon,
                        tooltip: oInput.tooltip || "",
                        press: oInput.press || null
                    })
                );
            }
            this._customIcons.push(btnID);
        };

        BEStandardChart.prototype.removeButton = function (btnID) {
            var idx = this._customIcons.indexOf(btnID);
            this._chartContainer.removeCustomIcon(idx);
            this._customIcons.splice(idx, 1);
        };

        BEStandardChart.prototype.init = function () {
            SimpleChart.prototype.init.apply(this, arguments);
            this.removeAllContent();
            this._customIcons = [];
            this._chartContainerContent = new ChartContainerContent({
                content: this._chart
            });
            this._chartContainer = new ChartContainer({
                autoAdjustHeight: true,
                showLegend: this.getShowLegend(),
                showLegendButton: this.getShowLegendButton(),
                showZoom: this.getShowZoom(),
                showFullScreen: this.getShowFullScreen(),
                content: [this._chartContainerContent]
            });
            this.addContent(this._chartContainer);
        };

        return BEStandardChart;
    }
);