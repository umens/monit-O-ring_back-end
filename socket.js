var os   = require('os');  
var cpu  = require('./cpu');
var conf = require('./config/conf');

var connect = (io, os) => {  
    io.on('connect', (socket) => {

        console.log('connected');
        
        var totalMemory = os.totalmem();
        var freeMemory = os.freemem();
        var usedMemory = Number((totalMemory - freeMemory) / 1073741824).toFixed(4);

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
                var totalMemory = os.totalmem();
                var freeMemory = os.freemem();
                usedMemory = Number((totalMemory - freeMemory) / 1073741824).toFixed(4);
                socket.emit('resources', { 
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
}

module.exports.connect = connect;