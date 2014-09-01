function UniverseObject(id, label) {
    this.id = id;
    this.label = label;
    this.x = 0;
    this.y = 0;

    this.getLabel = function() {
        return this.label;
    };

    this.warp = function(x, y) {
        this.x = x;
        this.y = y;
    };
}

module.exports = UniverseObject;