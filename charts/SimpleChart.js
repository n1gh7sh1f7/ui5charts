sap.ui.define(
    [
        "sap/m/Panel",
        "sap/m/PanelRenderer",
        "com/bearingpoint/ChartFeedItem"
    ],
    function (Panel, PanelRenderer, ChartFeedItem) {
        "use strict";
        var BESimpleChart = Panel.extend("com.bearingpoint.SimpleChart", {
            "renderer": PanelRenderer,
            "metadata": {
                "properties": {
                    "type": {
                        "type": "string",
                        "defaultValue": "column"
                    },
                    "modelName": {
                        "type": "string",
                        "defaultValue": ""
                    },
                    "entity": {
                        "type": "string",
                        "defaultValue": "/"
                    },
                    "parameters": {
                        "type": "object",
                        "defaultValue": {}
                    },
                    "title": {
                        "type": "string",
                        "defaultValue": ""
                    },
                    "showLegend": {
                        "type": "boolean",
                        "defaultValue": false
                    },
                    "showTitle": {
                        "type": "boolean",
                        "defaultValue": false
                    },
                    "vizProperties": {
                        "type": "object",
                        "defaultValue": {}
                    }
                },
                "aggregations": {
                    "measures": {
                        "bindable": true,
                        "multiple": true,
                        "singularName": "measure",
                        "type": "com.bearingpoint.ChartFeedItem"
                    },
                    "dimensions": {
                        "bindable": true,
                        "multiple": true,
                        "singularName": "dimension",
                        "type": "com.bearingpoint.ChartFeedItem"
                    },
                    "colors": {
                        "bindable": true,
                        "multiple": true,
                        "singularName": "color",
                        "type": "com.bearingpoint.ChartFeedItem"
                    }
                }
            }
        });

        var _chartTypes = {
            column: {
                icon: "sap-icon://vertical-bar-chart",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                }
            },
            "info/column": {
                icon: "sap-icon://vertical-bar-chart",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                }
            },
            stacked_column: {
                icon: "sap-icon://full-stacked-column-chart",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                }
            },
            "info/stacked_column": {
                icon: "sap-icon://full-stacked-column-chart",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                }
            },
            bar: {
                icon: "sap-icon://horizontal-bar-chart",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                }
            },
            "info/bar": {
                icon: "sap-icon://horizontal-bar-chart",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                }
            },
            stacked_bar: {
                icon: "sap-icon://full-stacked-chart",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                }
            },
            "info/stacked_bar": {
                icon: "sap-icon://full-stacked-chart",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                }
            },
            line: {
                icon: "sap-icon://line-chart",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                }
            },
            "info/line": {
                icon: "sap-icon://line-chart",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                }
            },
            pie: {
                icon: "sap-icon://pie-chart",
                bindings: {
                    dimension: "color",
                    measure: "size"
                },
                maxMeasures: 1
            },
            "info/pie": {
                icon: "sap-icon://pie-chart",
                bindings: {
                    dimension: "color",
                    measure: "size"
                },
                maxMeasures: 1
            },
            combination: {
                icon: "sap-icon://business-objects-experience",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                },
                minMeasures: 2,
                maxMeasures: -1
            },
            "info/combination": {
                icon: "sap-icon://business-objects-experience",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                },
                minMeasures: 2,
                maxMeasures: -1
            },
            stacked_combination: {
                icon: "sap-icon://business-objects-experience",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                },
                minMeasures: 2,
                maxMeasures: -1
            },
            "info/stacked_combination": {
                icon: "sap-icon://business-objects-experience",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                },
                minMeasures: 2,
                maxMeasures: -1
            },
            dual_stacked_combination: {
                icon: "sap-icon://business-objects-experience",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                },
                minMeasures: 2,
                maxMeasures: -1
            },
            "info/dual_stacked_combination": {
                icon: "sap-icon://business-objects-experience",
                bindings: {
                    dimension: "categoryAxis",
                    measure: "valueAxis",
                    color: "color"
                },
                minMeasures: 2,
                maxMeasures: -1
            }
        };

        BESimpleChart.prototype.getChartTypes = function () {
            return _chartTypes;
        };

        BESimpleChart.prototype.setTitle = function (sInput) {
            this._setChartTitle(sInput);
            this.setProperty("title", sInput);
        };

        BESimpleChart.prototype._setChartTitle = function (sInput) {
            var props = this._chart.getVizProperties();
            if (!props) {
                return;
            }
            if (!props.title) {
                props.title = {};
            }
            props.title.text = sInput;
            this._chart.setVizProperties(props);
        };

        BESimpleChart.prototype.setShowTitle = function (bInput) {
            this._setShowChartTitle(bInput);
            this.setProperty("showTitle", bInput);
        };

        BESimpleChart.prototype._setShowChartTitle = function (bInput) {
            var props = this._chart.getVizProperties();
            if (!props) {
                return;
            }
            if (!props.title) {
                props.title = {};
            }
            props.title.visible = bInput;
            this._chart.setVizProperties(props);
        };

        BESimpleChart.prototype.setShowLegend = function (bInput) {
            this._setShowLegend(bInput);
            this.setProperty("showLegend", bInput);
        };

        BESimpleChart.prototype._setShowLegend = function (bInput) {
            var props = this._chart.getVizProperties();
            if (!props) {
                return;
            }
            if (!props.legend) {
                props.legend = {};
            }
            props.legend.visible = bInput;
            this._chart.setVizProperties(props);
        };

        BESimpleChart.prototype.setVizProperties = function (oInput) {
            this._chart.setVizProperties(oInput);
            this.setProperty("vizProperties", this._chart.getVizProperties());
        };

        BESimpleChart.prototype.setType = function (sInput) {
            this._chart.setVizType(sInput);
            this.setProperty("type", sInput);
        };

        BESimpleChart.prototype.getTypeDef = function () {
            return _chartTypes[this._chart.getVizType()];
        };

        BESimpleChart.prototype._createDataset = function () {
            var sModelName = this.getModelName(),
                sEntity = this.getEntity(),
                oParameters = this.getParameters(),
                dimensions = this.getDimensions(),
                measures = this.getMeasures(),
                colors = this.getColors(),
                chartType = this._chart.getVizType(),
                boundModel = this.getModel(sModelName),
                internalDataModel = new sap.ui.model.json.JSONModel(),
                modelType, feedMeasures, feedDimensions, feedColors, allDimensions;
            modelType = this.getModel(sModelName) instanceof sap.ui.model.odata.v4.ODataModel ? "odata" : "json";
            this._chart.destroyDataset();
            this._chart.destroyFeeds();
            if (sModelName && sModelName.length > 0) {
                sModelName += ">";
            } else {
                sModelName = "";
            }
            this._chart.setVisible(true);
            if (measures.length === 0) {
                this._chart.setVisible(false);
                return;
            }
            allDimensions = dimensions.slice();
            if (_chartTypes[chartType].bindings.color) {
                allDimensions = allDimensions.concat(colors);
            }
            if (modelType === "odata") {
                oParameters.$$aggregation = {
                    aggregate: measures.reduce(function (res, m) {
                        res[m.getName()] = {
                            name: m.getValue(),
                            with: "sum"
                        };
                        return res;
                    }, {}),
                    group: allDimensions.reduce(function (res, d) {
                        res[d.getValue()] = {};
                        return res
                    }, {})
                };
                var aSorters = allDimensions.map(function (feed) {
                    return new sap.ui.model.Sorter(feed.getValue());
                });
                aSorters = aSorters.concat(measures.map(function (feed) {
                    return new sap.ui.model.Sorter(feed.getName());
                }));
                var oBinding = boundModel.bindList(sEntity, null, aSorters, null, oParameters);
                oBinding.requestContexts().then(function (contexts) {
                    var items = contexts.map(function (ctx) {
                        return ctx.getObject();
                    });
                    internalDataModel.setProperty("/", Array.from(items));
                    internalDataModel.refresh();
                });
            }
            if (modelType === "json") {
                internalDataModel.setProperty("/", boundModel.getProperty(sEntity));
                internalDataModel.refresh();
            }
            var dataset = new sap.viz.ui5.data.FlattenedDataset({
                data: {
                    path: "__internalDataModel>/"
                },
                dimensions: allDimensions.map(function (item) {
                    return new sap.viz.ui5.data.DimensionDefinition({
                        name: item.getName(),
                        value: "{__internalDataModel>" + item.getValue() + "}"
                    });
                }),
                measures: measures.map(function (item) {
                    return new sap.viz.ui5.data.MeasureDefinition({
                        name: item.getName(),
                        value: "{__internalDataModel>" + (modelType === "odata" ? item.getName() : item.getValue()) + "}"
                    });
                })
            });
            this._chart.setDataset(dataset);
            function feedMap(item) {
                return item.getName();
            }
            feedMeasures = measures.map(feedMap);
            feedDimensions = dimensions.map(feedMap);
            feedColors = colors.map(feedMap);
            this._chart.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: _chartTypes[chartType].bindings.measure,
                type: "Measure",
                values: feedMeasures
            }));
            this._chart.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: _chartTypes[chartType].bindings.dimension,
                type: "Dimension",
                values: feedDimensions
            }));
            if (_chartTypes[chartType].bindings.color) {
                this._chart.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                    uid: _chartTypes[chartType].bindings.color,
                    type: "Dimension",
                    values: feedColors
                }));
            }
            this.setModel(internalDataModel, "__internalDataModel");
        };

        BESimpleChart.prototype.addMeasure = function (oInput) {
            this.addAggregation("measures", oInput);
            // this._createDataset();
        };

        BESimpleChart.prototype.removeMeasure = function (oInput) {
            this.removeAggregation("measures", oInput);
            // this._createDataset();
        };

        BESimpleChart.prototype.addDimension = function (oInput) {
            this.addAggregation("dimensions", oInput);
            // this._createDataset();
        };

        BESimpleChart.prototype.removeDimension = function (oInput) {
            this.removeAggregation("dimensions", oInput);
            // this._createDataset();
        };

        BESimpleChart.prototype.addColor = function (oInput) {
            this.addAggregation("colors", oInput);
            // this._createDataset();
        };

        BESimpleChart.prototype.removeColor = function (oInput) {
            this.removeAggregation("colors", oInput);
            // this._createDataset();
        };

        BESimpleChart.prototype.downloadChart = function (fileName) {
            // Function that dowloads charts as PNG
            // Downloads ALL the VizFrame controls in the page as PNG
            // Accepts one parameter: the download file name
            var canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d"),
                sources = this.$().find("svg.v-m-root"),
                canvasWidth = 0,
                canvasHeight = 0,
                width = 0,
                z = 0,
                html,
                item,
                date = new Date(Date.now()).toLocaleString(sap.ui.getCore().getConfiguration().getLanguage()),
                data = "",
                isVizContainer = false,
                parentClass = ".sapVizFrame";
            // The data variable will hold a string defining an encapsulating svg element, into which we insert the actual svgs

            if (!sources.length) {
                sap.m.MessageBox.show("There are no charts on the screen.", "INFORMATION", "Information", ["OK"]);
                return true;
            }
            if (isVizContainer) {
                parentClass = ".ui5-viz-controls-viz-frame";
            }
            // Iterate over all the svgs in the page
            for (z = 0; z < sources.length; z++) {
                // Get the computed width of the svg parent div
                width = $(sources[z])
                    .parents(parentClass)
                    .innerWidth();

                // Clone the svg so we don't alter the original instances
                item = $(sources[z]).clone()[0];

                // Set the svg width to match original instance
                item.setAttribute("width", width + "px");

                // Set svg X offset in the container svg
                item.setAttribute("x", canvasWidth + "px");

                // Add this to the final canvas width
                canvasWidth += width;

                // Set the final canvas height to the greatest height of all svgs
                canvasHeight =
                    canvasHeight <
                        $(sources[z])
                            .parents(parentClass)
                            .innerHeight() ? $(sources[z])
                                .parents(parentClass)
                                .innerHeight() : canvasHeight;
                // MDN HTML parsing and XML serialization
                html = item.outerHTML;
                // doc = document.implementation.createHTMLDocument('');
                // doc.write(html);
                // doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI);
                // html = (new XMLSerializer()).serializeToString(doc);
                // Add the svg string to the container
                data += html;
            }
            // Properly end the container svg
            data += "</svg>";

            // Add the container svg header
            data =
                '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="' +
                canvasWidth +
                '" height="' +
                canvasHeight +
                '" style="background-color: white;">' +
                data;

            // Create a new HTML Image element with the proper URL formatting
            var DOMURL = window.URL || window.webkitURL || window;
            var img = new Image(canvasWidth, canvasHeight);
            var svg = new Blob([data], {
                type: "image/svg+xml"
            });
            var url = DOMURL.createObjectURL(svg);

            // Set final canvas dimensions
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            var fullFileName = this.getType() + " " + fileName + " " + date + ".png";

            // Draw final image to the canvas only after it has loaded
            img.onload = function () {
                ctx.drawImage(img, 0, 0);

                // Save file - doesn't work for IE !
                if (canvas.msToBlob && window.navigator.msSaveBlob) {
                    // for Edge
                    try {
                        var blob = canvas.msToBlob();
                        window.navigator.msSaveOrOpenBlob(blob, fullFileName);
                    } catch (e) {
                        alert("The chart download feature is not available in Internet Explorer.\nPlease switch to another browser.");
                    }
                } else {
                    var MIME_TYPE = "image/png";
                    var imgURL = canvas.toDataURL(MIME_TYPE);
                    var dlLink = document.createElement("a");
                    dlLink.download = fullFileName;
                    dlLink.href = imgURL;
                    dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(":");
                    document.body.appendChild(dlLink);
                    dlLink.click();
                    document.body.removeChild(dlLink);
                }
                DOMURL.revokeObjectURL(url);
            };
            // Set crossOrigin attribute for CORS
            //          img.setAttribute('crossOrigin', '*');
            img.setAttribute("crossOrigin", "anonymous");

            // Set the final image URL, triggers the onload event and subsequent canvas draw and file save
            img.src = url;
        };

        BESimpleChart.prototype.init = function () {
            Panel.prototype.init.apply(this, arguments);
            var that = this;
            this.addStyleClass("sapUiNoContentPadding");
            if (this.getHeight() === "auto") {
                this.setHeight("100%");
            }
            this.setExpandable(false);
            this.setExpanded(true);
            this._chart = new sap.viz.ui5.controls.VizFrame({
                uiConfig: {
                    applicationSet: "fiori"
                },
                width: "100%",
                height: "100%",
                vizProperties: {
                    interaction: {
                        behaviorType: null
                    }
                }
            });
            this.addContent(this._chart);
            setTimeout(function () {
                that._createDataset();
            }, 0);
        };

        return BESimpleChart;
    }
);