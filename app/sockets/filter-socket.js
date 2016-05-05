'use strict';

var Filter = require('../models/filter');

module.exports = function(socket, io) {
    socket.on('filter:updated', function(filterData){
        socket.broadcast.emit('filter:updated:' + filterData._id, filterData);
        Filter.updateModel(filterData._id, filterData.model);
    });

    socket.on('filter:add', function(data){
        Filter.create(data.type, data.laneID)
        .then(function(filter){
            io.sockets.emit('filter:add:' + filter.laneID, filter);
        });
    });

    socket.on('filter:delete', function(data){
        Filter.delete(data._id)
        .then(function(){
            io.sockets.emit('filter:delete:' + data.laneID, data._id);
        });
    });
};