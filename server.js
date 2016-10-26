//var logger = require('morgan');
//app.use(logger('dev'));
//var debug = require('debug')('monit-O-ring_back-end:server');
var os     = require('os-utils');
var cpu    = require('./cpu');
var conf   = require('./config/conf');
var socket = require('socket.io-client')(conf.url_front_end);

socket.on('connect', function(){

    socket.emit('identifier', { serverName: conf.server_url });
        
    var usedMemory = os.totalmem() - os.freemem();

    cpu().then(function(cpuPercentage) {
        socket.emit('ehlo', { 
            cpu: cpuPercentage,
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            usedMemory: usedMemory,
            uptime: os.sysUptime(),
            hostname: conf.server_url
        });
    });

    setInterval(() => {
        cpu().then(function(cpuPercentage) {
    		usedMemory = os.totalmem() - os.freemem();
            socket.emit('ressources', { 
                cpu: cpuPercentage,
                totalMemory: os.totalmem(),
                freeMemory: os.freemem(),
                usedMemory: usedMemory,
                uptime: os.sysUptime(),
                hostname: conf.server_url
            });
        });
    }, 5000);
});