var id_counter = 0;

function Entity(id, label, baseGoal) {
    UniverseObject.call(this, id || id_counter++, label || "entity");

    this.baseGoal = baseGoal || {name: "brains"};
    this.goal = false;
    this.action = false;
    this.inputs = {};

    this.speed = 0.25;

    this.decide = function(goal) {
        this.goal = goal;

        // Finish action before updating
        if (this.action)
            return false;

        // Recursivly decide action
        switch (this.goal.name) {
            case 'brains':
                this.action = {
                    name: 'step',
                    delay: 60,
                    args: {
                        x: Math.floor(Math.random() * 3) - 1,
                        y: Math.floor(Math.random() * 3) - 1
                    }
                };
                break;
            case 'player':
                this.action = {name: false, delay: 1, args: {x: 0, y: 0}};
                if (this.inputs.A) {
                    this.action.name = 'step';
                    this.action.args.x = -1;
                } else if (this.inputs.D) {
                    this.action.name = 'step';
                    this.action.args.x = 1;
                }
                if (this.inputs.W) {
                    this.action.name = 'step';
                    this.action.args.y = -1;
                } else if (this.inputs.S) {
                    this.action.name = 'step';
                    this.action.args.y = 1;
                }
                if (!this.action.name) {
                    this.action = false;
                }
                break;
        }
    };

    this.act = function() {
        // Check for idle
        if (!this.action) {
            return false;
        }

        // Do action
        switch (this.action.name) {
            case 'step':
                // Walk
                this.x += (this.action.args.x * this.speed);
                this.y += (this.action.args.y * this.speed);
                break;
            default:
                // Error
                console.log("Missing action " + this.action.name);
                break;
        }

        // Update action delay
        if (this.action.delay-- <= 0)
            this.action = false;
    };
}

Entity.prototype = Object.create(UniverseObject.prototype);
Entity.prototype.constructor = Entity;

module.exports = Entity;