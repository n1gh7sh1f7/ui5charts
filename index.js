var setTextForLabels = function (input) {
	return input;
};

sap.ui.getCore().attachInit(function () {
	sap.ui.require([
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		"sap/ui/core/format/NumberFormat",
		"sap/viz/ui5/format/ChartFormatter",
		"sap/viz/ui5/api/env/Format",
		"com/bearingpoint/ExtendedChart"
	], function (MessageBox, MessageToast, NumberFormat, ChartFormatter, Format, ExtendedChart) {
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
		var chart = new ExtendedChart({
			type: "stacked_column",
			showLegend: true,
			showTitle: true,
			containerTitle: "Dynamic Report",
			showChartTitle: true,
			chartTitle: "Chart",
			enableDownload: true,
			vizProperties: {
				plotArea: {
					dataLabel: {
						visible: true,
						formatString: "ShortFloat"
					}
				},
				tooltip: {
					visible: true,
					formatString: "StandardFloat"
				}
			},
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
			colors: []
		});
		var model = new sap.ui.model.json.JSONModel([
			{
				"FY": "FY2017",
				"FP": "FP12",
				"CO2": 4430225,
				"CO2_E_WTT": 4479719,
				"CO2_E_TTW": 123454
			},
			{
				"FY": "FY2018",
				"FP": "FP01",
				"CO2": 15568968,
				"CO2_E_WTT": 15748764,
				"CO2_E_TTW": 123454
			},
			{
				"FY": "FY2018",
				"FP": "FP02",
				"CO2": 18589316,
				"CO2_E_WTT": 18799620,
				"CO2_E_TTW": 123454
			},
			{
				"FY": "FY2018",
				"FP": "FP03",
				"CO2": 22147921,
				"CO2_E_WTT": 22533413,
				"CO2_E_TTW": 123454
			},
			{
				"FY": "FY2018",
				"FP": "FP04",
				"CO2": 15432834,
				"CO2_E_WTT": 15604114,
				"CO2_E_TTW": 123454
			},
			{
				"FY": "FY2018",
				"FP": "FP05",
				"CO2": 8621670,
				"CO2_E_WTT": 8719633,
				"CO2_E_TTW": 123454
			}
		]);
		chart.setModel(model);
		chart.attachFeedChange(function (oEvent) {
			var message = "", measures, dimensions, added, removed, feedType;
			measures = oEvent.getParameter("measures");
			dimensions = oEvent.getParameter("dimensions");
			added = oEvent.getParameter("added");
			removed = oEvent.getParameter("removed");
			if (added.measure.length > 0) {
				message += "Added measures: ";
				message += added.measure.map(function (item) {
					return item.name + " [" + item.value + "]";
				}).join(", ");
				message += "\n\n";
			}
			if (added.dimension.length > 0) {
				message += "Added dimensions: ";
				message += added.dimension.map(function (item) {
					return item.name + " [" + item.value + "]";
				}).join(", ");
				message += "\n\n";
			}
			if (removed.measure.length > 0) {
				message += "Removed measures: ";
				message += removed.measure.map(function (item) {
					return item.name + " [" + item.value + "]";
				}).join(", ");
				message += "\n\n";
			}
			if (removed.dimension.length > 0) {
				message += "Removed dimensions: ";
				message += removed.dimension.map(function (item) {
					return item.name + " [" + item.value + "]";
				}).join(", ");
				message += "\n\n";
			}
			message += "measures: " + measures.map(function (item) {
				return item.name + " [" + item.value + "]";
			}).join(", ");
			message += "\n\n";
			message += "dimensions: " + dimensions.map(function (item) {
				return item.name + " [" + item.value + "]";
			}).join(", ");
			console.log(message);
		});
		chart.placeAt("content");
	});
});
