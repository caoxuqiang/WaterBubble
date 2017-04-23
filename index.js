window.onload = function () {
    var Shape = (function () {
        function Shape(className, obj) {
            this.times = 10;
            this.value = 0;
            this.className = className;
            this["default"](obj);
            this.shapeR = this.options.radius;
            this.waterR = this.shapeR - 10;
            this.build();
        }
        Shape.createContainer = function (className) {
            if (!Shape.container) {
                Shape.container = document.createElement('div');
                Shape.container.className = className;
                document.body.appendChild(Shape.container);
            }
        };
        Shape.prototype["default"] = function (obj) {
            this.options = {};
            this.options.radius = obj.radius ? obj.radius : 100;
            this.options.lineWidth = obj.lineWidth ? obj.lineWidth : 1;
            this.options.text = obj.text ? obj.text : this.className;
            this.options.textColor = obj.textColor ? obj.textColor : 'rgba(06, 85, 128,0.8)';
            this.options.waterColor = obj.waterColor ? obj.waterColor : 'rgba(25, 139, 201,0.5)';
            this.options.deep = obj.deep ? obj.deep : 0.5;
            this.options.font = obj.font ? obj.font : '';
            this.options.wave = obj.wave ? obj.wave : true;
            this.options.animation = obj.animation ? obj.animation : true;
        };
        Shape.prototype.build = function () {
            var lineWidth = this.options.lineWidth;
            this.canvas = document.createElement('canvas');
            this.canvas.className = this.className;
            this.canvas.width = this.shapeR * 2 + lineWidth * 2;
            this.canvas.height = this.canvas.width;
            Shape.container.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.x = this.shapeR + lineWidth / 2;
            this.y = this.x;
            this.buildShape();
            // this.buildWater();
            if (this.options.wave) {
                this.animation();
            }
            else {
                this.fillWater();
            }
            if (typeof this.options.text !== 'undefined') {
                this.drawText();
            }
        };
        Shape.prototype.buildShape = function () {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.shapeR, 0, Math.PI * 2);
            this.ctx.strokeStyle = this.options.waterColor;
            this.ctx.lineWidth = this.options.lineWidth;
            this.ctx.stroke();
            this.ctx.closePath();
        };
        Shape.prototype.buildWater = function () {
            var lineWidth = this.options.lineWidth;
            var waterRadius = this.waterR - lineWidth * 2;
            this.ctx.beginPath();
            this.ctx.globalCompositeOperation = 'destination-over';
            this.ctx.arc(this.x, this.y, this.waterR, 0, Math.PI * 2);
            this.ctx.strokeStyle = this.options.waterColor;
            this.ctx.lineWidth = this.options.lineWidth;
            this.ctx.stroke();
            this.ctx.closePath();
        };
        Shape.prototype.fillWater = function () {
            // 使用二次贝塞尔曲线进行水面线的模拟
            // 1.先求点的纵坐标
            var sy = 2 * this.waterR * (1 - this.value) + (this.y - this.waterR);
            // 2.再求点的横坐标
            var sx = this.x - Math.sqrt(this.waterR * this.waterR - (sy - this.y) * (sy - this.y));
            // 水面中间的点坐标
            var mx = this.x;
            var my = sy;
            // 水面右侧侧的点坐标
            var ex = 2 * this.x - sx;
            var ey = sy;
            var extent = 0;
            if (this.options.deep > 0.9 || this.options.deep < 0.1 || !this.options.wave) {
                extent = sy;
            }
            else {
                extent = sy - (this.x - sx) / 4;
            }
            this.ctx.beginPath();
            this.ctx.moveTo(sx, sy);
            // 使用二次贝塞尔曲线进行水面线的模拟
            // 绘制水面左半边
            this.ctx.quadraticCurveTo((sx + mx) / 2, extent, mx, my);
            // 绘制水面右半边
            this.ctx.quadraticCurveTo((mx + ex) / 2, 2 * sy - extent, ex, ey);
            var startAngle = -Math.asin((this.x - sy) / this.waterR);
            var endAngle = Math.PI - startAngle;
            this.ctx.arc(this.x, this.y, this.waterR, startAngle, endAngle, false);
            this.ctx.fillStyle = this.options.waterColor;
            this.ctx.fill();
        };
        Shape.prototype.animation = function () {
            var data = {
                isRunning: undefined
            };
            var min = 0.01;
            var requestAnimationFrame = function (func) {
                setTimeout(func, this.times);
            };
            var self = this;
            var update = function () {
                if (self.value < self.options.deep - min) {
                    self.value += (self.options.deep - self.value) / (1 / min);
                    data.isRunning = true;
                }
                else {
                    data.isRunning = false;
                }
            };
            var step = function () {
                self.fillWater();
                update();
                if (data.isRunning) {
                    requestAnimationFrame(step);
                }
            };
            step();
        };
        Shape.prototype.drawText = function () {
            this.ctx.globalCompositeOperation = 'destination-over';
            var size = this.options.font ? this.options.font.replace(/\D+/g, '') : 0.3 * this.options.radius;
            this.ctx.font = this.options.font ? this.options.font : 'bold ' + size + 'px Microsoft Yahei';
            // this.options.text = this.options.text.length ? this.options.text : this.options.deep * 100 + '%';
            var sy = this.y + Number(size) / 2;
            var sx = this.x - this.ctx.measureText(this.options.text).width / 2;
            this.ctx.fillStyle = this.options.textColor;
            this.ctx.fillText(this.options.text, sx, sy);
        };
        return Shape;
    }());
    var skills = {
        "HTML": {
            deep: 0.8
        },
        "CSS": {
            deep: 0.6
        },
        "JavaScript": {
            deep: 0.6
        },
        "Jquery": {
            deep: 0.7
        },
        "Bootstrap": {
            deep: 0.7
        },
        "Vue": {
            deep: 0.5
        },
        "Node": {
            deep: 0.5
        }
    };
    var SkillShape = Shape;
    SkillShape.createContainer('container');
    for (var skill in skills) {
        new SkillShape(skill, skills[skill]);
    }
};
