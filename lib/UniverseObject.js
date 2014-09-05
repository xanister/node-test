function UniverseObject(region, id, label) {
    this.region = region;
    this.id = id;
    this.label = label;
    this.x = 0;
    this.y = 0;
    this.sizeX = 32;
    this.sizeY = 32;
    this.boundingBox = {
        left: this.x - (this.sizeX / 2),
        top: this.y - (this.sizeY / 2),
        right: this.x + (this.sizeX / 2),
        bottom: this.y + (this.sizeY / 2)
    };

    this.warp = function(x, y) {
        this.x = x;
        this.y = y;
    };

    this.distanceTo = function(uo) {
        return Math.sqrt(Math.pow(this.x - uo.x, 2) + Math.pow(this.y - uo.y, 2));
    };

    this.collides = function(targetRect) {
        var rect = this.boundingBox();
        return !(rect.left > targetRect.right || targetRect.left > rect.right || rect.top > targetRect.bottom || targetRect.top > rect.bottom);
    };

    this.nearest = function(label) {
        // TODO: add range and type
        var n = false;
        var nd = false;
        var me = this;
        for (var id in uos) {
            if (id !== me.id && uos[id].label == label) {
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
        }
        return n;
    };
}

module.exports = UniverseObject;