function Region() {
    this.uos = {};

    this.addUo = function(uo) {
        this.uos[uo.id] = uo;
    };

    this.getUos = function() {
        return this.uos;
    };

    this.getUo = function(id) {
        return this.uos[id];
    };

    this.removeUo = function(id) {
        delete this.uos[id];
    };
}

module.exports = Region;