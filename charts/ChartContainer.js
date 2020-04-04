sap.ui.define([
    "sap/suite/ui/commons/ChartContainer",
    "sap/suite/ui/commons/ChartContainerRenderer"
], function(
	ChartContainer,
	ChartContainerRenderer
) {
	"use strict";
	var BEChartContainer = ChartContainer.extend("com.bearingpoint.ChartContainer", {
		"renderer": ChartContainerRenderer
	});

	BEChartContainer.prototype._performHeightChanges = function() {
		var $Toolbar,
			$VizFrame;

		if (this.getAutoAdjustHeight() || this.getFullScreen()) {
			var $this = this.$(),
				oSelectedContent,
				oInnerChart;

			$Toolbar = $this.find(".sapSuiteUiCommonsChartContainerToolBarArea :first");
			//Only adjust height after both toolbar and chart are rendered in the DOM.
			$VizFrame = $this.find(".sapSuiteUiCommonsChartContainerChartArea :first");
			oSelectedContent = this.getSelectedContent();
			if ($Toolbar[0] && $VizFrame[0] && oSelectedContent) {
				var iChartContainerHeight = $this.height();
				var iToolBarHeight = $Toolbar.height();
				var iToolbarBottomBorder = Math.round(parseFloat($Toolbar.css("borderBottomWidth")));
				var iNewChartHeight = iChartContainerHeight - iToolBarHeight - iToolbarBottomBorder;
				var iExistingChartHeight = $VizFrame.height();
				oInnerChart = oSelectedContent.getContent();
				if ((oInnerChart instanceof sap.viz.ui5.controls.VizFrame) || (oInnerChart instanceof sap.ui.vbm.AnalyticMap) || (sap.chart && sap.chart.Chart && oInnerChart instanceof sap.chart.Chart)) {
					if (iNewChartHeight > 0 && iNewChartHeight !== iExistingChartHeight) {
						this._rememberOriginalHeight(oInnerChart);
						oInnerChart.setHeight(iNewChartHeight + "px");
					}
				} else if (oInnerChart.getDomRef && oInnerChart.getDomRef().offsetWidth !== this.getDomRef().clientWidth) {
					//For table/non-vizFrame case, if width changes on the re-size event, force a re-render to have it fit in 100% width.
					this.rerender();
				}
			}
		}
	};

	return BEChartContainer;
});