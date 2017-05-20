'use strict;'
//Include crypto to generate the room id
var crypto = require('crypto');

module.exports = function() {
    return {
        roomList : [],
        /*
         * Save the room inside the "db".
         */
        save(room) {
            room.id = crypto.randomBytes(20).toString('hex'); // fast enough for our purpose
            this.roomList.push(room);
            return 1;           
        },
        /*
         * Retrieve a room with a given id
         */
        find(id) {
            if(id) {
                return this.roomList.find(element => {
                        return element.id === id;
                    }); 
            } else {
                return this.roomList;
            }
        } 
    }
};  