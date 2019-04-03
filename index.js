/* index.js
 *
 * Created By: R. Alan Cooper
 * Start Date: 3/30/19
 * Last Modified: 4/3/19
 * Notes: 
 *	server side js, uses 'socket.io'
 */

// Libraries
	var http = require('http').createServer(requestHandler); // [1][2][3]
	var io = require('socket.io')(http); // [4]

// Initializations
	var fxncontainer = undefined;
	var sockets = [];
	var angle = 0.0, sinVal = 0.0;
	http.listen(80); // Allow Connections [5]
	fxncontainer = setInterval(updateHandler, 10); // Sine Wave Angle Updater
	io.on('connection', connectionHandler); // 'connection' Event Listener [6][7]

// Handlers
	function requestHandler(req, res) // TODO (4/2): eventually update the 'request' event as needed
	{
		// console.log('"request" event occured');
	}

	function connectionHandler(socket) // [8]
	{
		console.log('"connection" event occured. Client ID: ' + socket.id);
		
		// Custom Listeners
		socket.on('ready', function (){
			if(sockets.length == 0)
			{
				sockets.push(socket);			
			}
			else
			{
				var exists = false;
				sockets.forEach(function (existing, index)
				{
					if(existing.id == socket.id)
					{
						exists = true;
					}
				});
				if(!exists)
				{
					sockets.push(socket);
				}

			}
		});
		socket.on('notready', function (){
			sockets.forEach(function (existing, index)
			{
				if(existing.id == socket.id)
				{
					sockets.splice(index, 1);
				}
			})
		});
	}

	function updateHandler()
	{
		angle += Math.PI / 144; // arbitrary update step
		sinVal = Math.sin(angle);
		sockets.forEach(function (socket){
			socket.emit('data', sinVal)
		});
	}

/* Documentation API and Sources
 *
 * [1] https://nodejs.org/api/http.html#http_http
 * [2] https://nodejs.org/api/http.html#http_http_createserver_options_requestlistener
 * [3] https://nodejs.org/api/http.html#http_event_request
 * [4] https://socket.io/docs/server-api/#new-Server-httpServer-options
 * [5] https://nodejs.org/api/net.html#net_server_listen
 * [6] https://nodejs.org/api/events.html#events_events
 * [7] https://nodejs.org/api/http.html#http_event_connection
 * [8] https://nodejs.org/api/net.html#net_class_net_socket
 */