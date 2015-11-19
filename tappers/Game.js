/**
 * 
 */

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var columns = 4;

var fb = new Firebase('https://crackling-fire-8175.firebaseio.com//');
var theBoard = fb.child("board")
var thePlayers = fb.child("players")
var theGame = fb.child("game")
var gameTape = []
var players = {};
var playerID;
var currentRow = 0;

function startSesion(playerName) {
	c.setAttribute('tabindex', '0');
	c.focus();

	if (playerName == "")
		playerName = "Annon"

	playerID = playerName
	thePlayers.child(playerID).child("progress").set(0);
	thePlayers.child(playerID).child("color").set(getRandomColor());

	setCallBacks();

	setInterval(render, 100);
	// setTimeout(createTiles, 0);

	window.addEventListener("keydown", KeyDownEvents, true);

}
function KeyDownEvents(event) {
	var kval = String.fromCharCode(event.keyCode)
	// console.log(kval)
	if (gameTape[currentRow].keys != null)
		if (gameTape[currentRow].keys.indexOf(kval) != -1) {
			currentRow++;
			thePlayers.child(playerID).child("progress").set(currentRow)
		} else {
			console.log("YOU LOSE !!!!!")
		}
}
// render
function render() {
	ctx.clearRect(0, 0, c.width, c.height);

	var i = 0
	for (pl in players) {
		i += 10
		var rh = 50;
		var ry = -rh * players[pl].progress + c.height + currentRow * rh - rh;

		ctx.fillStyle = players[pl].color
		ctx.fillRect(0, ry + i, c.width, 5)
//		 console.log( players[pl] )
//		 console.log( players[pl].progress )
//		 console.log( players[pl].color +" " + ry )
	}

	for ( var i in gameTape)
		drawRow(i, gameTape[i]);

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

function drawRectangle(row, column, chosen, det) {
	var rw = c.width / det.size;
	var rh = 50;
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

function setCallBacks() {

	fb.child(".info/connected").on("value", function(snap) {
		if (snap.val()) {
			thePlayers.child(playerID).onDisconnect().remove();
		}
	});

	// theGame.on("child_added", function(snap) {
	// options[snap.key()] = snap.val();
	// });
	// theGame.on("child_changed", function(snap) {
	// options[snap.key()] = snap.val();
	// });
	// theGame.on("child_removed", function(snap) {
	// delete options[snap.key()];
	// });

	theBoard.on("child_added", function(snap) {
		gameTape[snap.key()] = snap.val()
		var st = "qwertyuiop".toUpperCase();
		var subdiv = gameTape[snap.key()].size;
		var nr = gameTape[snap.key()].column + 1
		gameTape[snap.key()]["keys"] = st.substring(st.length / subdiv * (nr - 1),
				st.length / subdiv * nr)

	});
	theBoard.on("child_changed", function(snap) {
		gameTape[snap.key()] = snap.val()
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

	 thePlayers.child(playerID).child("progress").on("value",function(snap){
		 currentRow=snap.val()
	 });
}
