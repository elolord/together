(function() {
    var Vector = function(x, y) {
        this.x = x;
        this.y = y;
    };

    Vector.prototype = {
        rotate: function(theta) {
            var x = this.x;
            var y = this.y;
            this.x = Math.cos(theta) * x + Math.sin(theta) * y;
            this.y = Math.cos(theta) * y - Math.sin(theta) * x;
            return this;
        },
        mult: function(f) {
            this.x *= f;
            this.y *= f;
            return this;
        },
        clone: function() {
            return new Vector(this.x, this.y);
        },
        length: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        subtract: function(v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        },
        set: function(x, y) {
            this.x = x;
            this.y = y;
            return this;
        }
    };

    var Petal = function(stretchA, stretchB, startAngle, angle, growFactor, bloom) {
        this.stretchA = stretchA;
        this.stretchB = stretchB;
        this.startAngle = startAngle;
        this.angle = angle;
        this.bloom = bloom;
        this.growFactor = growFactor;
        this.r = 1;
        this.isfinished = false;
    };

    Petal.prototype = {
        draw: function() {
            var ctx = this.bloom.garden.ctx;
            var v1, v2, v3, v4;
            v1 = new Vector(0, this.r).rotate(this.startAngle);
            v2 = v1.clone().rotate(this.angle);
            v3 = v1.clone().mult(this.stretchA);
            v4 = v2.clone().mult(this.stretchB);
            ctx.beginPath();
            ctx.moveTo(v1.x + this.bloom.center.x, v1.y + this.bloom.center.y);
            ctx.bezierCurveTo(v3.x + this.bloom.center.x, v3.y + this.bloom.center.y,
                v4.x + this.bloom.center.x, v4.y + this.bloom.center.y,
                v2.x + this.bloom.center.x, v2.y + this.bloom.center.y);
            ctx.strokeStyle = this.bloom.color;
            ctx.fillStyle = this.bloom.color;
            ctx.stroke();
            ctx.fill();
        },
        render: function() {
            if (this.r <= this.bloom.radius) {
                this.r += this.growFactor;
                this.draw();
            } else {
                this.isfinished = true;
            }
        }
    };

    var Bloom = function(p, r, c, pc, g, garden) {
        this.petalCount = pc;
        this.center = p;
        this.color = c;
        this.radius = r;
        this.garden = garden;
        this.petals = [];
        this.growFactor = g;
        this.init();
        this.garden.addBloom(this);
    };

    Bloom.prototype = {
        draw: function() {
            var p;
            var isfinished = true;
            for (var i = 0; i < this.petals.length; i++) {
                p = this.petals[i];
                p.render();
                isfinished *= p.isfinished;
            }
            if (isfinished == true) {
                this.garden.removeBloom(this);
            }
        },
        init: function() {
            var angle = 360 / this.petalCount;
            var startAngle = Math.random() * 90;
            for (var i = 0; i < this.petalCount; i++) {
                this.petals.push(new Petal(Math.random() * 1.1 + 0.1, Math.random() * 1.5 + 0.1,
                    startAngle + i * angle,
                    angle,
                    this.growFactor,
                    this));
            }
        }
    };

    var Garden = function(canvas) {
        this.blooms = [];
        this.element = canvas;
        this.ctx = canvas.getContext("2d");
    };

    Garden.prototype = {
        render: function() {
            for (var i = 0; i < this.
