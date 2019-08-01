figma.showUI(__html__, { width: 300, height: 170 });
let oldSelection = 0;
let ONLYFRAME = true;

let checkSelection = setInterval(() => {
  let newSelection = getNodes().length;
  if (newSelection != oldSelection) {
    figma.ui.postMessage({ items: newSelection });
    oldSelection = newSelection;
  }
}, 350);

const getNodes = () => {
  const nodes = [];
  const loop =
    figma.currentPage.selection.length > 0
      ? figma.currentPage.selection
      : figma.currentPage.children;
  for (let i = 0; i < loop.length; i++) {
    let node = loop[i];
    if (node.type == "FRAME" || !ONLYFRAME) {
      nodes.push(loop[i]);
    }
  }

  return nodes;
};

figma.ui.onmessage = msg => {
  if (msg.type === "rename") {
    const BEFORE = msg.before || "";
    const AFTER = msg.after || "";
    const INIT = msg.init || 0;
    ONLYFRAME = msg.onlyFrame;

    const nodes = getNodes();
    nodes
      .sort((a, b) => {
        if (a.y == b.y) return a.x - b.x;
        return a.y - b.y;
      })
      .map((node, index) => {
        node.name = `${BEFORE}${INIT + index}${AFTER}`;
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
