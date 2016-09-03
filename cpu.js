var os = require("os");
 
//Create function to get CPU information
function cpuAverage() {
 
    //Initialise sum of idle and time of cores and fetch CPU info
    var totalIdle = 0, totalTick = 0;
    var cpus = os.cpus();
    var loads = [];
 
    //Loop through CPU cores
    for(var i = 0, len = cpus.length; i < len; i++) {
 
        //Select CPU core
        var cpu = cpus[i];
 
        //Total up the time in the cores tick
        for(type in cpu.times) {
            totalTick += cpu.times[type];
        }        
 
        //Total up the idle time of the core
        totalIdle += cpu.times.idle;

        loads.push({idle: cpu.times.idle, total: totalTick});
        totalIdle = totalTick = 0;
    }
 
    //Return the average Idle and Tick times
    return loads;
}
 
//Grab first CPU Measure
var startMeasure = cpuAverage();
 
module.exports = function () {
 
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    // http://stackoverflow.com/questions/24928846/get-return-value-from-settimeout
    var promise = new Promise(function (resolve, reject) { 
   
        //Set delay for second Measure
        setTimeout(function() { 
       
            //Grab second Measure
            var endMeasure = cpuAverage(); 
            var percentages = [];
            var idleDifference = 0, totalDifference = 0, percentageCPU = 0, totalIdle_end = 0, totalTick_end = 0, totalIdle_start = 0, totalTick_start = 0;
            for(var i = 0, len = endMeasure.length; i < len; i++) {

                totalIdle_end += endMeasure[i].idle;
                totalIdle_start += startMeasure[i].idle;
                totalTick_end += endMeasure[i].total;
                totalTick_start += startMeasure[i].total;

                idleDifference = endMeasure[i].idle - startMeasure[i].idle;
                totalDifference = endMeasure[i].total - startMeasure[i].total;
                percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
                percentages.push(percentageCPU);
                idleDifference = 0, totalDifference = 0, percentageCPU = 0;
            }
           
            //Calculate the difference in idle and total time between the measures for the global
            idleDifference = (totalIdle_end / endMeasure.length) - (totalIdle_start / startMeasure.length);
            totalDifference = (totalTick_end / endMeasure.length) - (totalTick_start / startMeasure.length);
           
            //Calculate the average percentage CPU usage
            percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
            percentages.push(percentageCPU);
            startMeasure = cpuAverage();
           
            resolve(percentages);
           
            //Output result to console
            // console.log(percentageCPU + "%");
   
        }, 100);
   
    });
   
    return promise;
}