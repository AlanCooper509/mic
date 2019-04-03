/* controller.js
 *
 * Created By: R. Alan Cooper
 * Start Date: 3/22/19
 * Last Modified: 4/3/19
 * Notes: 
 *	for sinewave.html
 *	client side js, uses 'socket.io'
 *	uses io() from 'socket.io' called in sinewave.html
 */

// Initializations
	var canvas = document.getElementById("myCanvas");
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;
	var ctx = canvas.getContext("2d");
	var moving = false;
	var socket = io('http://localhost:80'); // Establish Server Connection

// Button Events
	function start()
	{
		if(moving)
		{
			return;
		}
		socket.emit('ready');
		moving = true;
	}

	function pause()
	{
		if(!moving)
		{
			return;
		}
		socket.emit('notready');
		moving = false;
	}

	function stop()
	{
		socket.emit('notready');
		moving = false;
		document.getElementById("header_value").innerHTML = "";

		// reset canvas
		var imgData = ctx.createImageData(canvasWidth, canvasHeight);
		ctx.putImageData(imgData, 0, 0);
	}

// Server Listeners
	socket.on('data', function (sinVal)
	{
		updateCanvas(sinVal);
	});

	socket.on('disconnect', function ()
	{
		console.log('disconnected from server');
		socket.on('connect', function (){
			console.log('reconnected to server');
			if(moving)
			{
				socket.emit('ready');
			}
		});
	});

// Event Helper
	function updateCanvas(sinVal)
	{
		var imgData = ctx.getImageData(1, 0, canvasWidth, canvasHeight);
		var y = (-(sinVal * canvasHeight / 2 * 0.9) + canvasHeight / 2).toFixed(); // 10% padding
		document.getElementById("header_value").innerHTML = sinVal.toFixed(2);
		var index = (y * canvasWidth + canvasWidth - 1) * 4;
		imgData.data[index + 0] = 255;
		imgData.data[index + 1] = 0;
		imgData.data[index + 2] = 0;
		imgData.data[index + 3] = 255;
		ctx.putImageData(imgData, 0, 0);
	}