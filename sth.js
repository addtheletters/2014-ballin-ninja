var net = require('net');
var toUnity = require("./main")

var server = net.createServer(function (socket) {
	
	socket.write('Echo server\r\n');
	socket.pipe(socket);
	toUnity.init();
	console.log("socket instantiated")
	socket.on("connect", function(data) {
		console.log("connection");
		console.log(data)
	})
	socket.on("data", function(data) {
		try {
		var points = data.toString().split(";");
		var fin = []
		if (points.length == 4) {
			for (p in points) {
				var nums = points[p].split(",");
				fin[p] = [];
				for (n in nums) {
					fin[p][n] = parseInt(nums[n]);
					if (fin[p][n] == -100) {
						return;
					}
				}
			}
			console.log("received data");
			var str = computeData(fin);
			console.log(str);
			toUnity.sendData(str);
		}
		} catch (e) {
			console.log("Analysis failed on "+data.toString());
			console.log(e);
		}
	
	})
});

var computeData = function(data) {
	var p12 = mag(sub(data[1],data[0]));
	var p13 = mag(sub(data[0],data[2]));
	var p14 = mag(sub(data[0],data[3]));
	var p23 = mag(sub(data[1],data[2]));
	var p24 = mag(sub(data[1],data[3]));
	var p34 = mag(sub(data[2],data[3]));

	var tb = p12/p34;
	var rl = p24/p13;
	var tl = p12/p13;
	var rb = p24/p34;
	var omega = p14+p23;
	var dist = 10*Math.sqrt(185)/omega;
    var theta=Math.asin(1/(rb*11/8))*(rl>0)?1:-1;
    var phi = Math.asin(1/(tl*8/11))*(tb>0)?1:-1;

	return phi+" "+theta+" "+dist;



}

var sub = function(v1,v2) {
	var tmp = []
	tmp[0] = v1[0]-v2[0];
	tmp[1] = v1[1]-v2[1];
	tmp[2] = v1[2]-v2[2];
	return tmp;
}
var mag = function(v) {
	return Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
}




server.listen(8080, '0.0.0.0');
