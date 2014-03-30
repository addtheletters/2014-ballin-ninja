

var net = require("net")

var sock
var serv;
var isReady = false;
var init = function() {
	serv = net.createServer(function (socke) {
		sock = socke;
		socke.pipe(socke);
		socke.on("connect", function() {
			console.log("WOWOWOWOWOWOWOWOW");
		})
		setTimeout(function() {isRead = true}, 2000);
	})
	serv.listen(1337, "127.0.0.1")
}
exports.sendData = function(str) {
	if (!serv && isReady) {
		init();
		return "serv";
	}
	if (!sock) {
		return "sock";
	} else {
		return sock.write(str+ "\n")
	}
}

exports.init = init;




