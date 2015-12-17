/**
 * 
 */

var c
var ctx
var fb;
var theBoard;
var thePlayers;
var gameTape = []
var players = {};
var playerID;
var currentRow = 0;

var gm = {
	keyMode : 0,
	KEYS : "qcwvobpn".toUpperCase(),
	boardWidth : 600,
	tileHeight : 50,
}

function getCookie(nm) {
	var s = document.cookie
	s = s.split(nm + "=")[1]
	var r = s.split(";")[0]

	return r
}

function startSesion() {
	var playerName = getCookie("user");
	var room = getCookie("room");

	if (playerName == "")
		playerName = "Annon"

	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");
	c.setAttribute('tabindex', '0');
	c.focus();

	fb = new Firebase('https://crackling-fire-8175.firebaseio.com//' + room + "//");
	theBoard = fb.child("board")
	thePlayers = fb.child("players")

	playerID = thePlayers.push();
	playerID.child("progress").set(0);
	playerID.child("name").set(playerName);
	playerID.child("color").set(getRandomColor());
	playerID.child("status").set("playng")

	setCallBacks();

	setInterval(render, 100);
	// setTimeout(createTiles, 0);

	window.addEventListener("keydown", KeyDownEvents, true);
	window.addEventListener("mousedown", mouseClick, false);

}

function canPlay() {

	if (gameTape[currentRow] == null)
		return false;

	return (players && players[playerID.key()] && players[playerID.key()]["status"] === "playng")
}

function mouseClick(event) {
	var x = event.clientX - document.documentElement.scrollLeft - c.offsetLeft;
	var y = event.clientY - document.documentElement.scrollTop - c.offsetTop;

	if (!canPlay() || x > gm.boardWidth)
		return;

	var i = Math.floor(x / (gm.boardWidth / gameTape[currentRow].size));

	doStep(gameTape[currentRow].column == i)

}

function doStep(quality) {
	if (quality)
		goodStep()
	else
		badStep()
	playerID.child("endedAt").set(Firebase.ServerValue.TIMESTAMP)
}

function goodStep() {
	currentRow++;
	playerID.child("progress").set(currentRow)
	if (gameTape[currentRow] == null) {
		console.log("WINNER !!!")
		playerID.child("status").set("winner")
	}
	if (currentRow == 1)
		playerID.child("startedAt").set(new Date().getTime())

}

function badStep() {

	console.log("YOU LOST !!!!!")
	playerID.child("status").set("lost")
}

function KeyDownEvents(event) {
	var kval = String.fromCharCode(event.keyCode)
	if (canPlay() && gm.KEYS.indexOf(kval) != -1)
		doStep(gameTape[currentRow].keys.indexOf(kval) != -1)

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

			// console.log(mpp)
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
		printBigText(100, 100, "You Lost !", "red");
	}

}

function printBigText(x, y, msg, color) {
	ctx.font = "70px Arial"
	ctx.fillStyle = "black";
	ctx.strokeText(msg, x, y);
	ctx.fillStyle = color;
	ctx.fillText(msg, x, y);

}

function updateLeaderboard() {

	var sor = []
	for (p in players)
		sor.push([ players[p].progress, players[p] ])
	sor.sort(function(b, a) {
		return a[0] - b[0]
	})

	var l = document.getElementById("players")
	l.innerHTML = ""
	for (p in sor) {
		var pl = sor[p][1]
		var st = "";
		var delta = (pl.endedAt - pl.startedAt) / 1000;

		st += pl.name;
		st += " : row ";
		st += pl.progress;
		st += " , avg speed : ~";
		if (pl.progress == 0)
			st += "0";
		else
			st += (pl.progress / delta).toFixed(3);
		st += " row/s.";

		var e = document.createElement("LI")
		if (pl.status == "lost")
			e.style.color = "red"
		if (pl.status == "winner")
			e.style.color = "green"
		if (pl.status != "playng") {
			st += " </br>     Total time: " + delta + " sec."
		}

		e.innerHTML = st
		l.appendChild(e)
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

	playerID.onDisconnect().remove();
	// thePlayers.onDisconnect().remove(function(err){fb.push("ceva "+players
	// )});

	// fb.parent().child(".info/connected").on("value", function(snap) {
	// if (snap.val()) {
	//
	// // N O P E
	// // O
	// // p
	// // E
	// // TODO , FIXME , #NOPE , #SPIDERS_IN_A_BOX
	// /** //deletes the whole ROOM when ANY single person disconnects */
	// //fb.onDisconnect().remove();
	// // THIS LINE, NO BUNENO !!!
	//
	// }
	// });

	var cellListener = function(snap, ind) {
		if (snap != null)
			gameTape[ind] = snap

		var st = gm.KEYS
		var subdiv = gameTape[ind].size;
		var nr = gameTape[ind].column + 1
		gameTape[ind]["keys"] = st.substring(st.length / subdiv * (nr - 1), st.length / subdiv * nr)
	}

	theBoard.on("value", function(snap) {
		gameTape = snap.exportVal()
		for (i in snap.val())
			cellListener(null, i)
	});
	
	theBoard.on("child_changed", function(snap) {
		cellListener(snap.val(), snap.key())
	});
	
	theBoard.on("child_removed", function(snap) {
		delete gameTape[snap.key()];
	});

	thePlayers.on("value", function(snap) {
		players = snap.val();
		updateLeaderboard();

	});

	thePlayers.on("child_removed", function(snap) {
		delete players[snap.key()];
	});

	playerID.child("progress").on("value", function(snap) {
		currentRow = snap.val()
	});
}
