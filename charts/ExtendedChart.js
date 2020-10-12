sap.ui.define(
    [
        "sap/ui/layout/Splitter",
        "sap/m/PanelRenderer",
        "sap/ui/layout/VerticalLayout",
        "com/bearingpoint/StandardChart",
        "sap/ui/comp/variants/VariantManagement"
    ],
    function (Splitter, PanelRenderer, VerticalLayout, StandardChart, VariantManagement) {
        "use strict";

        $.sap.require("com.bearingpoint.ChartFeedItem");
        $.sap.require("sap.m.MessageBox");
        $.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-core");
        $.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-widget");
        $.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-mouse");
        $.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-draggable");
        $.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-sortable");

        var BEExtendedChart = StandardChart.extend("com.bearingpoint.ExtendedChart", {
            "renderer": PanelRenderer,
            "metadata": {
                "properties": {
                    "showLabels": {
                        "type": "boolean",
                        "defaultValue": true
                    }
                },
                "aggregations": {
                    "availableMeasures": {
                        "bindable": true,
                        "multiple": true,
                        "singularName": "availableMeasure",
                        "type": "com.bearingpoint.ChartFeedItem"
                    },
                    "availableDimensions": {
                        "bindable": true,
                        "multiple": true,
                        "singularName": "availableDimension",
                        "type": "com.bearingpoint.ChartFeedItem"
                    },
                    "colors": {
                        "bindable": true,
                        "multiple": true,
                        "singularName": "availableColor",
                        "type": "com.bearingpoint.ChartFeedItem"
                    },
                    "variants": {
                        "bindable": true,
                        "forwarding": {
                            "getter": "getVariantManagement",
                            "aggregation": "variantItems"
                        }
                    }
                },
                "events": {
                    "feedChange": {
                        "parameters": {
                            "measures": { "type": "object[]" },
                            "dimensions": { "type": "object[]" },
                            "added": { "type": "object" },
                            "removed": { "type": "object" }
                        }
                    }
                }
            }
        });

        var _oHelpDialog = new sap.m.Dialog({
            title: "Help",
            content: [],
            endButton: new sap.m.Button({
                text: "Close",
                press: function () {
                    _oHelpDialog.close();
                }
            })
        });

        function debounce(func, wait, immediate) {
            var timeout;
            return function () {
                var context = this,
                    args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(context, args);
                }
            };
        }

        function _buildTitle(oControl) {
            var sChartTitle = "",
                aTitleComponents = [],
                lastMeasure,
                lastDimension,
                aDimensions = oControl.getDimensions(),
                aMeasures = oControl.getMeasures(),
                aColors = oControl.getColors();
            if (!aMeasures || !aDimensions || !aColors) {
                return "";
            }
            aMeasures.forEach(function (m) {
                aTitleComponents.push(m.getName());
            });
            lastMeasure = aTitleComponents.pop();
            sChartTitle += aTitleComponents.join(", ");
            if (aTitleComponents.length > 0) {
                sChartTitle += " and ";
            }
            sChartTitle += lastMeasure;
            aTitleComponents = aDimensions.map(function (d) {
                return d.getName();
            }).concat(aColors.map(function (d) {
                return d.getName();
            }));
            if (aTitleComponents.length > 0) {
                sChartTitle += " / ";
                lastDimension = aTitleComponents.pop();
                sChartTitle += aTitleComponents.join(", ");
                if (aTitleComponents.length > 0) {
                    sChartTitle += " and ";
                }
                sChartTitle += lastDimension;
            }
            return sChartTitle;
        };

        function _moveArrayElement(ar, s, e) {
            ar.splice(e, 0, ar.splice(s, 1)[0]);
        }

        function _initSortable(oControl) {
            $("#_chartContainerMeasureList-listUl")
                .sortable({
                    placeholder: "ui-state-highlight",
                    start: function (event, ui) {
                        ui.item.data("dragStartPos", ui.item.index());
                    },
                    update: function (event, ui) {
                        var dragStartPos = ui.item.data("dragStartPos"),
                            dragEndPos = ui.item.index(),
                            arr = oControl.getMeasures();
                        _moveArrayElement(arr, dragStartPos, dragEndPos);
                        oControl.removeAllMeasures();
                        arr.forEach(function (item) {
                            oControl.addMeasure(item);
                        });
                        // oControl._overlay.show();
                    }
                })
                .disableSelection();
            $("#_chartContainerDimensionList-listUl")
                .sortable({
                    placeholder: "ui-state-highlight",
                    start: function (event, ui) {
                        ui.item.data("dragStartPos", ui.item.index());
                    },
                    update: function (event, ui) {
                        var dragStartPos = ui.item.data("dragStartPos"),
                            dragEndPos = ui.item.index(),
                            arr = oControl.getDimensions();
                        _moveArrayElement(arr, dragStartPos, dragEndPos);
                        oControl.removeAllDimensions();
                        arr.forEach(function (item) {
                            oControl.addDimension(item);
                        });
                        // oControl._overlay.show();
                    }
                })
                .disableSelection();
            $("#_chartContainerColorList-listUl")
                .sortable({
                    placeholder: "ui-state-highlight",
                    start: function (event, ui) {
                        ui.item.data("dragStartPos", ui.item.index());
                    },
                    update: function (event, ui) {
                        var dragStartPos = ui.item.data("dragStartPos"),
                            dragEndPos = ui.item.index(),
                            arr = oControl.getColors();
                        _moveArrayElement(arr, dragStartPos, dragEndPos);
                        oControl.removeAllColors();
                        arr.forEach(function (item) {
                            oControl.addColor(item);
                        });
                        // oControl._overlay.show();
                    }
                })
                .disableSelection();
        }

        function _createChartTypeSelector(oControl) {
            var chartTypeSelectorMenu, chartTypeSelector;
            chartTypeSelectorMenu = new sap.m.Menu({
                items: {
                    path: "_internalModel>/chartTypes",
                    template: new sap.m.MenuItem({
                        icon: "{_internalModel>icon}",
                        text: "{_internalModel>name}",
                        customData: [
                            new sap.ui.core.CustomData({
                                key: "chartType",
                                value: "{_internalModel>type}"
                            })
                        ]
                    })
                },
                itemSelected: function (oEvent) {
                    var oButton = oEvent.getParameter("item"),
                        sChartType = oButton.data().chartType;
                    if (sChartType === "pie" || sChartType === "info/pie") {
                        oControl.setVizProperties({
                            plotArea: {
                                dataLabel: {
                                    distance: 1
                                }
                            }
                        })
                    }
                    oControl.setType(sChartType);
                }
            });
            chartTypeSelector = new sap.m.MenuButton({
                width: "100%",
                buttonMode: sap.m.MenuButtonMode.Split,
                icon: "{_internalModel>/selectedChartType/icon}",
                text: "{_internalModel>/selectedChartType/name}",
                menu: chartTypeSelectorMenu
            });
            return chartTypeSelector;
        }

        function _createShowLabelsToggle(oControl) {
            return new sap.m.CheckBox({
                text: "show labels",
                selected: "{_internalModel>/showLabels}",
                select: function (oEvent) {
                    var bPressed = oEvent.getParameter("selected");
                    oControl.setShowLabels(bPressed);
                }
            });
        }

        function _onFeedRemove(oEvent, sType, oControl) {
            var oButton = oEvent.getSource(),
                oListItem = oButton.getParent(),
                oContext = oListItem.getBindingContext("_internalModel"),
                def;
            switch (sType) {
                case "measure":
                    def = oControl.getMeasures().find(function (m) {
                        return m.getName() === oContext.getProperty("name");
                    });
                    oControl.removeMeasure(def);
                    break;
                case "dimension":
                    def = oControl.getDimensions().find(function (d) {
                        return d.getName() === oContext.getProperty("name");
                    });
                    oControl.removeDimension(def);
                    break;
                case "color":
                    def = oControl.getColors().find(function (c) {
                        return c.getName() === oContext.getProperty("name");
                    });
                    oControl.removeColor(def);
                    break;
            }
        }

        function _onFeedAdd(itemName, sType, oControl) {
            var def;
            switch (sType) {
                case "measure":
                    def = oControl.getAvailableMeasures().find(function (m) {
                        return m.getName() === itemName;
                    });
                    oControl.addMeasure(def);
                    break;
                case "dimension":
                    def = oControl.getAvailableDimensions().find(function (d) {
                        return d.getName() === itemName;
                    });
                    oControl.addDimension(def);
                    break;
                case "color":
                    def = oControl.getAvailableDimensions().find(function (d) {
                        return d.getName() === itemName;
                    });
                    oControl.addColor(def);
                    break;
            }
        }

        function _createFeedSelector(oControl, sType) {
            var oModel, sCapType, sPluralType, sPluralCapType, oPopover, oAvailableList, oListHeader, oList, oScrollContainer, oLayout;
            oModel = oControl.getModel("_internalModel");
            sCapType = sType.charAt(0).toUpperCase() + sType.slice(1);
            sPluralType = sType + "s";
            sPluralCapType = sCapType + "s";
            oPopover = new sap.m.Popover({
                modal: false,
                placement: sap.m.PlacementType.HorizontalPreferredLeft,
                customHeader: new sap.m.Toolbar({
                    content: [
                        new sap.m.Text({
                            text: "Available " + sPluralType
                        }),
                        new sap.m.ToolbarSpacer(),
                        new sap.m.Button({
                            icon: "sap-icon://decline",
                            press: function () {
                                oPopover.close();
                            }
                        })
                    ]
                }),
                footer: new sap.m.Button({
                    width: "100%",
                    text: "OK",
                    press: function () {
                        // oControl._overlay.show();
                        var selectedItems = oAvailableList.getSelectedItems(), itemNames;
                        oPopover.close();
                        itemNames = selectedItems.map(function (item) {
                            return item.getBindingContext("_internalModel").getProperty("name");
                        });
                        itemNames.forEach(function (itemName) {
                            _onFeedAdd(itemName, sType, oControl);
                        });
                        oAvailableList.removeSelections(true);
                    }
                })
            }).addStyleClass("sapUiContentPadding");
            oAvailableList = new sap.m.List({
                includeItemInSelection: true,
                mode: sap.m.ListMode.MultiSelect,
                noDataText: "No available " + sPluralType,
                items: {
                    path: "_internalModel>/available" + (sType === "color" ? "Dimensions" : sPluralCapType),
                    sorter: new sap.ui.model.Sorter("name"),
                    template: new sap.m.StandardListItem({
                        title: "{_internalModel>name}",
                        type: sap.m.ListType.Active
                    })
                }
            });
            oAvailableList.setModel(oModel, "_internalModel");
            oPopover.addContent(oAvailableList);
            oListHeader = new sap.m.List({
                showNoData: false,
                headerToolbar: new sap.m.Toolbar({
                    content: [
                        new sap.ui.core.Icon({
                            src: "sap-icon://" + (sType === "color" ? "dimension" : sType),
                            tooltip: sType
                        }),
                        new sap.m.Title({
                            text: sPluralCapType
                        }),
                        new sap.m.ToolbarSpacer(),
                        new sap.m.Button({
                            icon: "sap-icon://add",
                            press: function () {
                                oPopover.openBy(this);
                            }
                        })
                    ]
                })
            }).addStyleClass("sapUiSizeCompact");
            oList = new sap.m.List({
                id: "_chartContainer" + sCapType + "List",
                noDataText: "No selection",
                items: {
                    path: "_internalModel>/" + sPluralType,
                    template: new sap.m.CustomListItem({
                        content: [
                            new sap.m.Toolbar({
                                design: sap.m.ToolbarDesign.Transparent,
                                content: [
                                    new sap.m.Text({
                                        text: "{_internalModel>name}"
                                    }),
                                    new sap.m.ToolbarSpacer(),
                                    new sap.m.Button({
                                        icon: "sap-icon://decline",
                                        type: sap.m.ButtonType.Transparent,
                                        press: function (oEvent) {
                                            _onFeedRemove(oEvent, sType, oControl);
                                        }
                                    })
                                ]
                            })
                        ]
                    }).addStyleClass("ui-state-default")
                }
            }).addStyleClass("sapUiSizeCompact");
            oScrollContainer = new sap.m.ScrollContainer({
                height: "150px",
                content: [oList]
            });
            oLayout = new VerticalLayout({
                width: "100%",
                content: [oListHeader, oScrollContainer]
            });
            if (sType === "color") {
                oLayout.bindProperty("visible", "_internalModel>/showColorSelector");
            }
            return oLayout;
        }

        function _createMeasureSelector(oControl) {
            return _createFeedSelector(oControl, "measure");
        }

        function _createDimensionSelector(oControl) {
            return _createFeedSelector(oControl, "dimension");
        }

        function _createColorSelector(oControl) {
            return _createFeedSelector(oControl, "color");
        }

        function _openHelpDialog() {
            _oHelpDialog.open();
        }

        function _createConfigPanel(oControl) {
            var chartTypeSelector = _createChartTypeSelector(oControl),
                measureSelector = _createMeasureSelector(oControl),
                dimensionSelector = _createDimensionSelector(oControl),
                colorSelector = _createColorSelector(oControl),
                showLabelsToggle = _createShowLabelsToggle(oControl);
            oControl._chartTypeSelector = chartTypeSelector;
            oControl._showLabelsToggle = showLabelsToggle;
            chartTypeSelector.addStyleClass("sapUiSizeCompact sapUiSmallMarginBottom");
            return new sap.ui.layout.VerticalLayout({
                width: "100%",
                content: [
                    new sap.m.Toolbar({
                        content: [
                            new sap.m.Title({
                                text: "Configuration"
                            }),
                            new sap.m.ToolbarSpacer(),
                            new sap.m.Button({
                                icon: "sap-icon://sys-help",
                                press: _openHelpDialog
                            })
                        ]
                    }),
                    chartTypeSelector,
                    showLabelsToggle,
                    measureSelector,
                    dimensionSelector,
                    colorSelector,
                    new sap.m.Button({
                        text: "Apply changes",
                        width: "100%",
                        press: function () {
                            oControl.fireFeedChange(oControl._changeTracker.get());
                            oControl.update();
                        }
                    })
                ]
            });
        }

        function _modelSetup(oControl) {
            var oModel, aMeasures, aDimensions, aColors, aAvailableMeasures, aAvailableDimensions, simpleProp, oAddedTypes = {}, availableChartTypes, selectedChartType;
            availableChartTypes = oControl.getChartTypes();
            selectedChartType = oControl.getType();
            oModel = oControl.getModel("_internalModel");
            aMeasures = oControl.getMeasures();
            aDimensions = oControl.getDimensions();
            aColors = oControl.getColors();
            aAvailableMeasures = oControl.getAvailableMeasures();
            aAvailableDimensions = oControl.getAvailableDimensions();
            Object.keys(availableChartTypes).forEach(function (sProp) {
                simpleProp = sProp.split("info/");
                if (simpleProp.length > 1) {
                    simpleProp = simpleProp[1];
                } else {
                    simpleProp = simpleProp[0];
                }
                if (selectedChartType === sProp) {
                    selectedChartType = {
                        "name": simpleProp,
                        "type": sProp,
                        "icon": availableChartTypes[sProp].icon
                    };
                }
                if (oAddedTypes[simpleProp] === undefined) {
                    oAddedTypes[simpleProp] = {
                        "name": simpleProp,
                        "type": sProp,
                        "icon": availableChartTypes[sProp].icon
                    };
                }
            });
            function extractFeedDetails(item) {
                return {
                    "name": item.getName(),
                    "value": item.getValue()
                };
            }
            oModel.setData({
                "measures": aMeasures.map(extractFeedDetails),
                "dimensions": aDimensions.map(extractFeedDetails),
                "colors": aColors.map(extractFeedDetails),
                "availableMeasures": aAvailableMeasures.map(extractFeedDetails),
                "availableDimensions": aAvailableDimensions.map(extractFeedDetails),
                "chartTypes": oAddedTypes,
                "selectedChartType": selectedChartType,
                "showColorSelector": availableChartTypes[selectedChartType.type].bindings.color !== undefined,
                "showLabels": oControl.getShowLabels()
            });
            oModel.refresh();
        }

        BEExtendedChart.prototype.getVariantManagement = function () {
            return this._variantManagement;
        };

        BEExtendedChart.prototype.setShowLabels = function (bInput) {
            this.setProperty("showLabels", bInput);
            this.setVizProperties({
                "plotArea": {
                    "dataLabel": {
                        "visible": bInput
                    }
                }
            });
            var oModel = this.getModel("_internalModel");
            oModel.setProperty("/showLabels", bInput);
            oModel.refresh();
        };

        BEExtendedChart.prototype.setType = function (sInput) {
            this._chart.setVizType(sInput);
            this._chart.setVisible(true);
            this.setProperty("type", sInput);
            this._currentChartConfig = this.getTypeDef();
            var haveColor = this._currentChartConfig.bindings.color !== undefined,
                measures = this.getMeasures(),
                oModel = this.getModel("_internalModel");
            oModel.setProperty("/showColorSelector", haveColor);
            oModel.refresh();
            if (!haveColor) {
                var colors = this.getColors();
                for (var i = colors.length - 1; i >= 0; i--) {
                    this.removeColor(colors[i]);
                }
            }
            if (this._currentChartConfig.maxMeasures > 0 && measures.length > this._currentChartConfig.maxMeasures) {
                for (var i = measures.length - 1; i > this._currentChartConfig.maxMeasures - 1; i--) {
                    this.removeMeasure(measures[i]);
                }
                // this._overlay.button.firePress();
            }
            if (this._currentChartConfig.minMeasures !== undefined && measures.length < this._currentChartConfig.minMeasures) {
                this._chart.setVisible(false);
                var text = "Please add at least ";
                text += this._currentChartConfig.minMeasures - measures.length;
                text += " more measure";
                if (this._currentChartConfig.minMeasures - measures.length > 1) {
                    text += "s"
                }
                text += " for this chart type.";
                sap.m.MessageBox.information(text);
            }
        };

        BEExtendedChart.prototype.addMeasure = function (oInput) {
            this.removeAggregation("availableMeasures", oInput);
            this.addAggregation("measures", oInput);
            if (this._changeTracker) {
                this._changeTracker.add(oInput.flatten(), "measure");
            }
            _modelSetup(this);
        };

        BEExtendedChart.prototype.removeMeasure = function (oInput) {
            this.removeAggregation("measures", oInput);
            this.addAggregation("availableMeasures", oInput);
            if (this._overlay) {
                // this._overlay.show();
            }
            if (this._changeTracker) {
                this._changeTracker.remove(oInput.flatten(), "measure");
            }
            _modelSetup(this);
        };

        BEExtendedChart.prototype.addDimension = function (oInput) {
            this.removeAggregation("availableDimensions", oInput);
            this.addAggregation("dimensions", oInput);
            if (this._changeTracker) {
                this._changeTracker.add(oInput.flatten(), "dimension");
            }
            _modelSetup(this);
        };

        BEExtendedChart.prototype.removeDimension = function (oInput) {
            this.removeAggregation("dimensions", oInput);
            this.addAggregation("availableDimensions", oInput);
            if (this._overlay) {
                // this._overlay.show();
            }
            if (this._changeTracker) {
                this._changeTracker.remove(oInput.flatten(), "dimension");
            }
            _modelSetup(this);
        };

        BEExtendedChart.prototype.addColor = function (oInput) {
            this.removeAggregation("availableDimensions", oInput);
            this.addAggregation("colors", oInput);
            if (this._changeTracker) {
                this._changeTracker.add(oInput.flatten(), "dimension");
            }
            _modelSetup(this);
        };

        BEExtendedChart.prototype.removeColor = function (oInput) {
            this.removeAggregation("colors", oInput);
            this.addAggregation("availableDimensions", oInput);
            if (this._overlay) {
                // this._overlay.show();
            }
            if (this._changeTracker) {
                this._changeTracker.remove(oInput.flatten(), "dimension");
            }
            _modelSetup(this);
        };

        BEExtendedChart.prototype.update = function () {
            // this._overlay.hide();
            this._createDataset();
            this._refreshTable();
            this.setChartTitle(_buildTitle(this));
            this._chart.setVisible(this.getMeasures().length > 0 && (this._currentChartConfig.minMeasures !== undefined ? this._currentChartConfig.minMeasures <= this.getMeasures().length : true));
            if (this._changeTracker) {
                this._changeTracker.reset();
            }
        }

        function _toggleConfigPanel(oControl) {
            oControl._configPanel.setLayoutData(
                new sap.ui.layout.SplitterLayoutData({
                    resizable: false,
                    minSize: oControl._configPanelState ? 0 : 150
                })
            );
            oControl._chartContainer.setLayoutData(
                new sap.ui.layout.SplitterLayoutData({
                    resizable: false,
                    size: oControl._configPanelState ? "100%" : "80%"
                })
            );
            oControl._configPanelState = !oControl._configPanelState;
        }

        BEExtendedChart.prototype._manageVariant = function (oEvent) {

        };

        BEExtendedChart.prototype._saveVariant = function (oEvent) {
            var oManager = oEvent.getSource(),
                oVariant = oEvent.getParameters();
            if (oVariant.overwrite) {
                var oItem = oManager.getVariantItems().find(function (item) {
                    return item.getKey() === oVariant.key;
                });
                if (!oItem) {
                    console.warn("error getting variant context");
                }
                var oContext = oItem.getBindingContext();
                oContext.setProperty("description", oVariant.name);
                oContext.setProperty("isDefault", oVariant.def);
                oContext.setProperty("isPublic", oVariant.global);
                oContext.setProperty("data", {
                    measures: this.getMeasures(),
                    dimensions: this.getDimensions(),
                    colors: this.getColors(),
                    type: this.getType(),
                    view: this.getView()
                });
            } else {
                var oBinding = oManager.getBinding("variantItems");
                oBinding.create({});
            }
        };

        BEExtendedChart.prototype._selectVariant = function (oEvent) {

        };

        function _createOverlay(oControl) {
            oControl._overlay = {
                buttonPlaced: false,
                visible: false,
                show: function () {
                    if (!this.button) {
                        this.button = new sap.m.Button({
                            text: "Apply changes",
                            press: function () {
                                oControl.fireFeedChange(oControl._changeTracker.get());
                                oControl.update();
                            }
                        });
                    }
                    if (!this.overlay) {
                        this.overlay = document.createElement("div");
                        this.overlay.setAttribute("id", "__be_extended_chart_overlay");
                        this.overlay.style["background"] = "rgba(0,0,0,0.3)";
                        this.overlay.style["position"] = "absolute";
                        this.overlay.style["height"] = "0px";
                        this.overlay.style["width"] = "0px";
                        this.overlay.style["top"] = "-9999px";
                        this.overlay.style["left"] = "-9999px";
                        this.overlay.style["padding-left"] = "0px";
                        this.overlay.style["padding-top"] = "0px";
                        this.overlay.style["z-index"] = 9999;
                        document.querySelector("body").append(this.overlay);
                    }
                    if (this.visible) {
                        return;
                    }
                    var chartSize;
                    try {
                        chartSize = {
                            width: parseInt(oControl._chartContainer.$().width(), 10),
                            height: parseInt(oControl._chartContainer.$().height(), 10) - 48,
                            offset: oControl._chartContainer.$().offset()
                        };
                    } catch (e) {
                        console.log(e);
                        return;
                    }
                    var w, h;
                    w = (Math.floor(chartSize.width / 2)) + 25;
                    h = (Math.floor(chartSize.height / 2));
                    this.overlay.style["height"] = `${h}px`;
                    this.overlay.style["width"] = `${w}px`;
                    this.overlay.style["top"] = `${chartSize.offset.top + 48}px`;
                    this.overlay.style["left"] = `${chartSize.offset.left}px`;
                    this.overlay.style["padding-left"] = `${w - 50}px`;
                    this.overlay.style["padding-top"] = `${h}px`;
                    this.visible = true;
                    if (!this.buttonPlaced) {
                        this.button.placeAt("__be_extended_chart_overlay");
                    }
                },
                hide: function () {
                    if (!this.visible) {
                        return;
                    }
                    this.overlay.style["height"] = "0px";
                    this.overlay.style["width"] = "0px";
                    this.overlay.style["top"] = "-9999px";
                    this.overlay.style["left"] = "-9999px";
                    this.overlay.style["padding-left"] = "0px";
                    this.overlay.style["padding-top"] = "0px";
                    this.visible = false;
                }
            };
        };

        function _startup(oControl) {
            oControl._changeTracker = {
                changes: {
                    added: {
                        measure: [],
                        dimension: []
                    },
                    removed: {
                        measure: [],
                        dimension: []
                    }
                },
                add: function (item, type) {
                    this.changes.added[type].push(item);
                },
                remove: function (item, type) {
                    this.changes.removed[type].push(item);
                },
                get: function () {
                    function flattenFeed(item) {
                        return item.flatten();
                    }
                    return {
                        "measures": oControl.getMeasures().map(flattenFeed),
                        "dimensions": oControl.getDimensions().concat(oControl.getColors()).map(flattenFeed),
                        "added": Object.assign({}, this.changes.added),
                        "removed": Object.assign({}, this.changes.removed)
                    };
                },
                reset: function () {
                    this.changes = {
                        added: {
                            measure: [],
                            dimension: []
                        },
                        removed: {
                            measure: [],
                            dimension: []
                        }
                    };
                }
            };
            _modelSetup(oControl);
            oControl.setChartTitle(_buildTitle(oControl));
            oControl.update();
        }

        BEExtendedChart.prototype.exit = function () {
            if (this._overlay.button) {
                this._overlay.button.destroy();
                this._overlay.button = null;
            }
            if (this._overlay.overlay) {
                document.getElementById("__be_extended_chart_overlay").remove();
                this._overlay.overlay.remove();
                this._overlay.overlay = null;
            }
        };

        BEExtendedChart.prototype.init = function () {
            StandardChart.prototype.init.apply(this, arguments);
            var that = this;
            this.removeAllContent();
            this._splitterLayout = new Splitter();
            this._configPanel = _createConfigPanel(this);
            this._configPanelState = false;
            _toggleConfigPanel(this);
            this._splitterLayout.addContentArea(this._chartContainer);
            this._splitterLayout.addContentArea(this._configPanel);
            this.addContent(this._splitterLayout);
            // _createOverlay(this);
            this._chartContainer.attachContentChange(function (oEvent) {
                var sSelected = oEvent.getParameter("selectedItemId");
                that._chartTypeSelector.setVisible(sSelected.indexOf("table") < 0);
                that._showLabelsToggle.setVisible(sSelected.indexOf("table") < 0);
            });
            this._variantManagement = new VariantManagement({
                manage: this._manageVariant.bind(this),
                save: this._saveVariant.bind(this),
                select: this._selectVariant.bind(this)
            });
            this._chartContainer.setToolbar(new sap.m.OverflowToolbar({
                content: [
                    new sap.m.ToolbarSeparator(),
                    this._variantManagement,
                    new sap.m.ToolbarSpacer(),
                    new sap.suite.ui.commons.ChartContainerToolbarPlaceholder()
                ]
            }));
            this.addEventDelegate({
                onAfterRendering: function () {
                    _initSortable(this);
                }
            }, this);
            if (!(this.getParent() instanceof sap.ui.core.Control)) {
                window.addEventListener(
                    "resize",
                    debounce(function () {
                        that.setHeight(window.innerHeight + "px");
                    }, 250)
                );
            }
            setTimeout(function () {
                _startup(that);
                if (that._tableSelected) {
                    that._chartTypeSelector.setVisible(false);
                    that._showLabelsToggle.setVisible(false);
                }
            }, 0);
        };
        return BEExtendedChart;
    }
);