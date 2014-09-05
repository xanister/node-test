var id_counter = 0;

function Entity(region, id, label, baseGoal, sprite) {
    UniverseObject.call(this, region, id || id_counter++, label || "zombie");

    this.baseGoal = baseGoal || {name: "brains"};
    this.goal = this.baseGoal;
    this.action = false;
    this.inputs = {};
    this.sprite = sprite || "zombie";

    this.speed = 1;
    this.perception = 200;

    this.decide = function(goal) {
        this.goal = goal;

        // Finish action before updating
        if (this.action)
            return false;

        // Recursivly decide action
        switch (this.goal.name) {
            case 'brains':
                var n = this.nearest(uos, "player");
                if (n && this.distanceTo(n) < this.perception) {
                    this.goal = {name: "eat", target_id: n.id};
                } else {
                    this.goal = {name: 'wander'};
                }
                break;
            case 'eat':
                if (typeof this.goal.target_id !== 'undefined') {
                    this.action = {
                        name: 'step',
                        delay: 10,
                        args: {
                            x: uos[this.goal.target_id].x < this.x ? -1 : 1,
                            y: uos[this.goal.target_id].y < this.y ? -1 : 1
                        }
                    };
                } else {
                    this.goal = this.baseGoal;
                }
                break;
            case 'wander':
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

                if (this.inputs.touchCount == 1) {
                    this.action = {
                        name: 'step',
                        delay: 1,
                        args: {
                            x: this.inputs.touchX > this.x ? 1 : -1,
                            y: this.inputs.touchY > this.y ? 1 : -1
                        }
                    };
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

        // Reset action and goal when finished
        if (this.action.delay-- <= 0) {
            this.action = false;
            this.goal = this.baseGoal;
        }
    };
}

Entity.prototype = Object.create(UniverseObject.prototype);
Entity.prototype.constructor = Entity;

module.exports = Entity;