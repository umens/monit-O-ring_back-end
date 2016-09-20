//var logger = require('morgan');
//app.use(logger('dev'));
//var debug = require('debug')('monit-O-ring_back-end:server');
var os     = require('os');  
var cpu    = require('./cpu');
var conf   = require('./config/conf');
var socket = require('socket.io-client')(conf.url_front_end);
// const mongoose = require('mongoose');

// var db = require('./config/db');
// mongoose.connect(db.url, function(err) {
//   	if (err) { throw err; }
// });
socket.on('connect', function(){

    socket.emit('identifier', { serverName: conf.server_url });
        
    var totalMemory = Number(os.totalmem() / 1073741824).toFixed(4);
    var freeMemory = Number(os.freemem() / 1073741824).toFixed(4);
    var usedMemory = Number((os.totalmem() - os.freemem()) / 1073741824).toFixed(4);

    cpu().then(function(cpuPercentage) {
        socket.emit('ehlo', { 
            cpu: cpuPercentage,
            totalMemory: totalMemory,
            freeMemory: freeMemory,
            usedMemory: usedMemory,
            uptime: os.uptime(),
            hostname: conf.server_url
        });
    });

    setInterval(() => {
        cpu().then(function(cpuPercentage) {
            totalMemory = Number(os.totalmem() / 1073741824).toFixed(4);
            freeMemory = Number(os.freemem() / 1073741824).toFixed(4);
            usedMemory = Number((os.totalmem() - os.freemem()) / 1073741824).toFixed(4);
            socket.emit('ressources', { 
                cpu: cpuPercentage,
                totalMemory: totalMemory,
                freeMemory: freeMemory,
                usedMemory: usedMemory,
                uptime: os.uptime(),
                hostname: conf.server_url
            });
        });
    }, 5000);
});