/**
 * 
 */

var c
var ctx
var fb = new Firebase('https://crackling-fire-8175.firebaseio.com//');
var theBoard = fb.child("board")
var thePlayers = fb.child("players")
var gameTape = []
var players = {};
var playerID;
var currentRow = 0;

var gm = {
	keyMode : 0,
	KEYS : "qwop".toUpperCase(),
	boardWidth : 600,
	tileHeight : 50,
}

function startSesion(playerName) {
	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");
	c.setAttribute('tabindex', '0');
	c.focus();

	if (playerName == "")
		playerName = "Annon"

	playerID = thePlayers.push();
	playerID.child("progress").set(0);
	playerID.child("name").set(playerName);
	playerID.child("color").set(getRandomColor());
	playerID.child("status").set("playng")

	setCallBacks();

	setInterval(render, 100);
	// setTimeout(createTiles, 0);

	window.addEventListener("keydown", KeyDownEvents, true);

}
function KeyDownEvents(event) {
	var kval = String.fromCharCode(event.keyCode)
	if (players && players[playerID.key()] && players[playerID.key()]["status"] === "playng")
		if (gameTape[currentRow].keys != null && gm.KEYS.indexOf(kval) != -1)
			if (gameTape[currentRow].keys.indexOf(kval) != -1) {
				currentRow++;
				playerID.child("progress").set(currentRow)
			} else {
				console.log("YOU LOSE !!!!!")
				playerID.child("status").set("lost")
			}
}
// render
function render() {
	ctx.clearRect(0, 0, c.width, c.height);

	mpp = {}

	for (pl in players)
		if (mpp[players[pl].progress])
			mpp[players[pl].progress].push(players[pl])
		else
			mpp[players[pl].progress] = [ players[pl] ]

			// console.log("+++++++++")
			// console.log(mpp)
	for (ls in mpp) {
		var i = 0
		var ln = mpp[ls].length
		var sz = Math.floor(c.width - gm.boardWidth) / ln
		for (col in mpp[ls]) {
			var ry = -gm.tileHeight * mpp[ls][col].progress + c.height + currentRow * gm.tileHeight - gm.tileHeight;
			ctx.fillStyle = mpp[ls][col].color
			ctx.fillRect(gm.boardWidth + i, ry, sz, gm.tileHeight)
			i += sz

//			console.log(mpp)
		}
	}
	// {
	// i += 10
	// var rh = gm.tileHeight;
	// var ry = -rh * players[pl].progress + c.height + currentRow * rh - rh;
	//
	// ctx.fillStyle = players[pl].color
	// ctx.fillRect(gm.boardWidth + 10, ry + i, 50, gm.tileHeight)
	// // console.log( players[pl] )
	// }

	for ( var i in gameTape)
		drawRow(i, gameTape[i]);

	if (players && players[playerID.key()] && players[playerID.key()]["status"] === "lost") {
		ctx.font = "70px Arial"
		ctx.fillStyle = "red";
		ctx.strokeText("You Lost !!!", 100, 100)
		ctx.fillStyle = "gray";
		ctx.fillText("You Lost !!!", 100, 100)
	}

}

function drawRectangle(row, column, chosen, det) {
	var rw = gm.boardWidth / det.size;
	var rh = gm.tileHeight;
	var ry = -rh * row + c.height + currentRow * rh - rh;
	var rx = rw * column;

	switch (chosen) {
	case -1:
		ctx.fillStyle = "red";
		break;
	case 0:
		ctx.fillStyle = "transparent";
		break;
	default:
		ctx.fillStyle = "grey";
		break;
	}
	var pd = 3
	ctx.fillRect(rx + pd, ry + pd, rw - (pd * 2), rh - (pd * 2))
	ctx.fillStyle = "black";
	ctx.strokeRect(rx, ry, rw, rh)

	if (chosen != 0) {
		ctx.font = "20px Georgia";
		ctx.fillStyle = "green";
		ctx.fillText(det.keys, rx + 10, ry + 30)// "" + row + " " + column + " "
	}
}
function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function createTiles() {

	theBoard.remove()
	for (var i = 0; i < 100; i++) {
		var columns = 4// Math.round(Math.random() * 2) + 5
		var tap = Math.floor(Math.random() * columns)

		addedRow = fb.child("board").child(i);
		addedRow.child("chosen").set(-1)
		addedRow.child("size").set(columns)
		addedRow.child("column").set(tap)
	}
}

function drawRow(row, det) {
	for (var j = 0; j < det.size; j++) {
		if (det.column == j) {
			drawRectangle(row, j, det.chosen, det);
		} else {
			drawRectangle(row, j, 0, det);
		}
	}
}

function setCallBacks() {

	fb.child(".info/connected").on("value", function(snap) {
		if (snap.val()) {
			playerID.onDisconnect().remove();
		}
	});

	var cellListener = function(snap) {
		gameTape[snap.key()] = snap.val()
		// var st = "qwertyuiop".toUpperCase();
		var st = gm.KEYS
		var subdiv = gameTape[snap.key()].size;
		var nr = gameTape[snap.key()].column + 1
		gameTape[snap.key()]["keys"] = st.substring(st.length / subdiv * (nr - 1), st.length / subdiv * nr)
	}

	theBoard.on("child_added", function(snap) {
		cellListener(snap)
	});
	theBoard.on("child_changed", function(snap) {
		cellListener(snap)
	});
	theBoard.on("child_removed", function(snap) {
		delete gameTape[snap.key()];
	});

	thePlayers.on("value", function(snap) {
		players = snap.val();

	});

	thePlayers.on("child_removed", function(snap) {
		delete players[snap.key()]
	});

	playerID.child("progress").on("value", function(snap) {
		currentRow = snap.val()
	});
}
