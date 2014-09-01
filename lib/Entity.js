function Entity(id, label) {
    UniverseObject.call(this, id, label);

    this.action = {name: 'idle', args: []};

    this.getAction = function() {
        return this.action;
    };

    this.setAction = function(action) {
        this.action = action;
    };

    this.run = function() {
        switch (this.action.name) {
            case 'idle':
                break;
            case 'step':
                this.x += this.action.args.x;
                this.y += this.action.args.y;
                break;
            default:
                console.log("missing action " + this.action.name);
        }
        this.setAction({name: 'idle', args: []});
    };
}

Entity.prototype = Object.create(UniverseObject.prototype);
Entity.prototype.constructor = Entity;

module.exports = Entity;