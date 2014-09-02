function UniverseObject(id, label) {
    this.id = id;
    this.label = label;
    this.x = 0;
    this.y = 0;

    this.warp = function(x, y) {
        this.x = x;
        this.y = y;
    };

    this.distanceTo = function(uo) {
        return Math.sqrt(Math.pow(this.x - uo.x, 2) + Math.pow(this.y - uo.y, 2));
    };

    this.nearest = function(uos) {
        // TODO: add range and type
        var n = false;
        var nd = false;
        var me = this;
        for (var id in uos) {
            if (n === false) {
                n = uos[id];
                nd = me.distanceTo(uos[id]);
            } else {
                var thisDistance = me.distanceTo(uos[id]);
                if (thisDistance < nd) {
                    n = uos[id];
                    nd = thisDistance;
                }
            }
        }
        return n;
    };
}

module.exports = UniverseObject;