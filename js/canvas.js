var canvas;
var ctx;

window.addEventListener("resize", (_=>resizeCanvas()));

function retrieveCanvasData() {
	let treeCanv = document.getElementById("treeCanvas")
	let treeTab = document.getElementById("treeTab")
	if (treeCanv===undefined||treeCanv===null) return false;
	if (treeTab===undefined||treeTab===null) return false;
	canvas = treeCanv;
	ctx = canvas.getContext("2d");
	return true;
}

function resizeCanvas() {
	if (!retrieveCanvasData()) return
	canvas.width = 0;
    canvas.height = 0;
    canvas.width = document.getElementById("treeTab").scrollWidth;
    canvas.height = document.getElementById("treeTab").scrollHeight;
    drawTree();
}

function drawTree() {
	if (!retrieveCanvasData()) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (layerUnl('b')) drawTreeBranch("p", "b")
	if (layerUnl('g')) drawTreeBranch("p", "g")
	if (layerUnl('e')) {
		drawTreeBranch("b", "e")
		drawTreeBranch("g", "e")
	}
	if (layerUnl('t')) drawTreeBranch("b", "t")
	if (layerUnl('sb')) drawTreeBranch("b", "sb")
	if (layerUnl('s')) drawTreeBranch("g", "s")
	if (layerUnl('h')) drawTreeBranch("t", "h")
	if (layerUnl('q')) drawTreeBranch("e", "q")
	if (layerUnl('hb')) {
		drawTreeBranch("sb", "hb")
		drawTreeBranch("t", "hb")
	}
	if (layerUnl('ss')) {
		drawTreeBranch("e", "ss")
		drawTreeBranch("s", "ss")
	}
	if (layerUnl('hs')) {
		drawTreeBranch("hb", "hs", "grey")
		drawTreeBranch("ss", "hs", "grey")
	}
	if (layerUnl('l')) {
		drawTreeBranch("h", "l")
		drawTreeBranch("q", "l")
	}
	if (layerUnl('c')) {
		drawTreeBranch("q", "c")
	}
	if (layerUnl('i')) {
		drawTreeBranch("ss", "i")
	}
	
	needCanvasUpdate = false;
}

function drawTreeBranch(num1, num2, color) { // taken from Antimatter Dimensions & adjusted slightly
    let start = document.getElementById(num1).getBoundingClientRect();
    let end = document.getElementById(num2).getBoundingClientRect();
    let x1 = start.left + (start.width / 2) + (document.getElementById("treeTab").scrollLeft || document.body.scrollLeft);
    let y1 = start.top + (start.height / 2) + (document.getElementById("treeTab").scrollTop || document.body.scrollTop);
    let x2 = end.left + (end.width / 2) + (document.getElementById("treeTab").scrollLeft || document.body.scrollLeft);
    let y2 = end.top + (end.height / 2) + (document.getElementById("treeTab").scrollTop || document.body.scrollTop);
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.strokeStyle = color || "white"
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}