'use strict';

var Lane = require('../models/lane');

module.exports = function(socket) {
    socket.on('lane:champFilterUpdate', function(laneData){
        socket.broadcast.emit('lane:champFilterUpdate:' + laneData._id, laneData);
        Lane.updateChampFilter(laneData._id, laneData.championNameFilter);
    });

    socket.on('lane:selectChampion', function(data){
        socket.broadcast.emit('lane:selectChampion:' + data.laneID, data.championID);
        Lane.selectChampion(data.laneID, data.championID);
    });
};