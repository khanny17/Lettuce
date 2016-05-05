'use strict';

var Filter = require('../models/filter');

module.exports = function(socket, io) {
    socket.on('filter:updated', function(filterData){
        socket.broadcast.emit('filter:updated:' + filterData._id, filterData);
        Filter.updateModel(filterData._id, filterData.model);
    });

    socket.on('filter:add', function(data){
        console.log(data);
        Filter.create(data.type, data.laneID)
        .then(function(filter){
            io.sockets.emit('filter:add:' + filter.laneID, filter);
        });
    });
};