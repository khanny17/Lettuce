'use strict';

var Lane = require('../models/lane');

module.exports = function(socket) {
    socket.on('lane:champFilterUpdate', function(laneData){
        socket.broadcast.emit('lane:champFilterUpdate:' + laneData._id, laneData);
        Lane.updateChampFilter(laneData._id, laneData.championNameFilter);
    });
};