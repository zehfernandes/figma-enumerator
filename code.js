figma.showUI(__html__, { width: 300, height: 170 });
var oldSelection = 0;
var ONLYFRAME = true;
var checkSelection = setInterval(function () {
    var newSelection = getNodes().length;
    if (newSelection != oldSelection) {
        figma.ui.postMessage({ items: newSelection });
        oldSelection = newSelection;
    }
}, 350);
var getNodes = function () {
    var nodes = [];
    var loop = figma.currentPage.selection.length > 0
        ? figma.currentPage.selection
        : figma.currentPage.children;
    for (var i = 0; i < loop.length; i++) {
        var node = loop[i];
        if (node.type == "FRAME" || !ONLYFRAME) {
            nodes.push(loop[i]);
        }
    }
    return nodes;
};
figma.ui.onmessage = function (msg) {
    if (msg.type === "rename") {
        var BEFORE_1 = msg.before || "";
        var AFTER_1 = msg.after || "";
        var INIT_1 = msg.init || 0;
        ONLYFRAME = msg.onlyFrame;
        var nodes = getNodes();
        nodes
            .sort(function (a, b) {
            if (a.y == b.y)
                return a.x - b.x;
            return a.y - b.y;
        })
            .map(function (node, index) {
            node.name = "" + BEFORE_1 + (INIT_1 + index) + AFTER_1;
        });
    }
    if (msg.type === "checkFrames") {
        ONLYFRAME = msg.onlyFrame;
        return;
    }
    clearInterval(checkSelection);
    figma.closePlugin();
};
//figma.ui.postMessage({ hereIsData: intarray })
