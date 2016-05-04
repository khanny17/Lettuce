'use strict';

var Filter = require('../models/filter');

module.exports = function(socket) {
    socket.on('filter:updated', function(filterData){
        socket.broadcast.emit('filter:updated', filterData);
        Filter.updateModel(filterData._id, filterData.model);
    });
};