sap.ui.define([
    "sap/ui/core/Element"
], function (Element) {
    "use strict";
    var BEChartFeedItem = Element.extend("com.bearingpoint.ChartFeedItem", {
        metadata: {
            properties: {
                "name": "string",
                "value": "string"
            }
        }
    });

    BEChartFeedItem.prototype.flatten = function () {
        return {
            name: this.getName(),
            value: this.getValue()
        };
    };

    return BEChartFeedItem;
});