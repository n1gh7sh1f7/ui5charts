sap.ui.define(
    [
        "sap/m/PanelRenderer",
        "com/bearingpoint/ChartContainer",
        "sap/suite/ui/commons/ChartContainerContent",
        "com/bearingpoint/SimpleChart",
        "sap/ui/table/Table",
        "sap/ui/table/Column",
        "sap/ui/core/util/Export",
        "sap/ui/core/util/ExportTypeCSV"
    ],
    function (PanelRenderer, ChartContainer, ChartContainerContent, SimpleChart, uiTable, uiColumn, Export, ExportTypeCSV) {
        "use strict";
        $.sap.require("com.bearingpoint.ChartFeedItem");
        var BEStandardChart = SimpleChart.extend("com.bearingpoint.StandardChart", {
            "renderer": PanelRenderer,
            "metadata": {
                "properties": {
                    "containerTitle": {
                        "type": "string",
                        "defaultValue": ""
                    },
                    "chartTitle": {
                        "type": "string",
                        "defaultValue": ""
                    },
                    "showFullScreen": {
                        "type": "boolean",
                        "defaultValue": true
                    },
                    "showZoom": {
                        "type": "boolean",
                        "defaultValue": true
                    },
                    "showLegend": {
                        "type": "boolean",
                        "defaultValue": false
                    },
                    "showLegendButton": {
                        "type": "boolean",
                        "defaultValue": true
                    },
                    "showChartTitle": {
                        "type": "boolean",
                        "defaultValue": false
                    },
                    "enableDownload": {
                        "type": "boolean",
                        "defaultValue": false
                    },
                    "downloadFileName": {
                        "type": "string",
                        "defaultValue": "Chart"
                    },
                    "enableChartView": {
                        "type": "boolean",
                        "defaultValue": true
                    },
                    "enableTableView": {
                        "type": "boolean",
                        "defaultValue": true
                    },
                    "activeView": {
                        "type": "string",
                        "defaultValue": "chart"
                    }
                }
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
                        if (that._chartSelected) {
                            that.downloadChart(that.getDownloadFileName());
                        } else {
                            that.downloadTable(that.getDownloadFileName())
                        }
                    }
                });
            } else {
                this.removeButton("download");
            }
        };

        BEStandardChart.prototype.setActiveView = function (sInput) {
            this.setProperty("activeView", sInput);
            setTimeout(function () {
                if (this.getEnableChartView() && this._chartContent && sInput === "chart") {
                    this._chartContainer.switchChart(this._chartContent);
                }
                if (this.getEnableTableView() && this._tableContent && sInput === "table") {
                    this._chartContainer.switchChart(this._tableContent);
                }
            }.bind(this), 100);
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

        BEStandardChart.prototype.downloadTable = function (fileName) {
            var that = this,
                modelName = this.getModelName(),
                entity = this.getEntity(),
                measures = this.getMeasures(),
                dimensions = this.getDimensions(),
                colors = this.getColors(),
                columns;
            columns = dimensions.map(function (item) {
                return {
                    name: item.getName(),
                    value: item.getValue()
                };
            });
            columns = colors.reduce(function (a, b) {
                a.push({
                    name: b.getName(),
                    value: b.getValue()
                });
                return a;
            }, columns);
            columns = measures.reduce(function (a, b) {
                a.push({
                    name: b.getName(),
                    value: b.getValue()
                });
                return a;
            }, columns);
            var oExport = new Export({
                exportType: new ExportTypeCSV({
                    separatorChar: ";"
                }),
                models: that.getModel(modelName),
                rows: {
                    path: entity
                },
                columns: columns.map(function (col) {
                    return {
                        name: col.name,
                        template: {
                            content: "{" + col.value + "}"
                        }
                    };
                })
            });
            oExport.saveFile(fileName).catch(function (oError) {
                sap.m.MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
            }).then(function () {
                oExport.destroy();
            });
        };

        BEStandardChart.prototype._refreshTable = function () {
            var dimensions = this.getDimensions(),
                colors = this.getColors(),
                measures = this.getMeasures(),
                internalModel = this.getModel("_internalModel"),
                sModelName = this.getModelName(),
                columns, modelType;
            modelType = this.getModel(sModelName) instanceof sap.ui.model.odata.v4.ODataModel ? "odata" : "json";
            columns = dimensions.map(function (item) {
                return {
                    name: item.getName(),
                    value: item.getValue()
                };
            });
            columns = colors.reduce(function (a, b) {
                a.push({
                    name: b.getName(),
                    value: b.getValue()
                });
                return a;
            }, columns);
            columns = measures.reduce(function (a, b) {
                a.push({
                    name: b.getName(),
                    value: modelType === "odata" ? b.getName() : b.getValue()
                });
                return a;
            }, columns);
            internalModel.setProperty("/table", {
                columns: columns
            });
            internalModel.refresh();
        };

        BEStandardChart.prototype._initTable = function () {
            this._table = new uiTable({
                columns: {
                    path: "_internalModel>/table/columns",
                    factory: function (sId, oContext) {
                        var sName = oContext.getProperty("name"),
                            sProp = oContext.getProperty("value");
                        return new uiColumn(sId, {
                            name: sName,
                            label: sName,
                            sortProperty: sProp,
                            filterProperty: sProp,
                            template: new sap.m.Text({
                                text: "{__internalDataModel>" + sProp + "}"
                            })
                        });
                    }
                },
                rows: {
                    path: "__internalDataModel>/"
                }
            });
            this._tableContent = new ChartContainerContent({
                content: this._table,
                icon: "sap-icon://table-view"
            });
        };

        BEStandardChart.prototype.init = function () {
            SimpleChart.prototype.init.apply(this, arguments);
            var that = this;
            this.removeAllContent();
            this.setModel(new sap.ui.model.json.JSONModel(), "_internalModel");
            this._customIcons = [];
            this._chartContent = new ChartContainerContent({
                content: this._chart,
                icon: "sap-icon://vertical-bar-chart"
            });
            this._initTable();
            this._chartContainer = new ChartContainer({
                autoAdjustHeight: true,
                showLegend: this.getShowLegend(),
                showLegendButton: this.getShowLegendButton(),
                showZoom: this.getShowZoom(),
                showFullScreen: this.getShowFullScreen()
            });
            setTimeout(function () {
                that._chartSelected = that.getActiveView() === "chart";
                that._tableSelected = that.getActiveView() === "table";
                if (that.getEnableChartView()) {
                    that._chartContainer.addContent(that._chartContent);
                }
                if (that.getEnableTableView()) {
                    that._chartContainer.addContent(that._tableContent);
                    that._refreshTable();
                    that._chartContainer.attachContentChange(function (oEvent) {
                        var itemID = oEvent.getParameter("selectedItemId");
                        that._tableSelected = itemID.indexOf("table") > -1;
                        that._chartSelected = itemID.indexOf("table") < 0;
                        if (that._tableSelected) {
                            that.setActiveView("table");
                        }
                        if (that._chartSelected) {
                            that.setActiveView("chart");
                        }
                    });
                }
            }, 0);
            this.addContent(this._chartContainer);
            setTimeout(function () {
                if (this.getEnableChartView() && this._chartContent && this.getActiveView() === "chart") {
                    this._chartContainer.switchChart(this._chartContent);
                }
                if (this.getEnableTableView() && this._tableContent && this.getActiveView() === "table") {
                    this._chartContainer.switchChart(this._tableContent);
                }
            }.bind(this), 100);
        };

        return BEStandardChart;
    }
);