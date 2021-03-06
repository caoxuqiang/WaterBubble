window.onload = function () {
    interface Options {
        radius?: number;
        lineWidth?: number;
        text?: string;
        textColor?: string;
        waterColor?: string;
        deep?: number;
        font?: string;
        wave?: boolean;
        animation?: boolean;
    }

    class Shape {
        static container: HTMLElement;
        className: string;
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        options: Options;
        x: number;
        y: number;
        times: number;
        value: number;
        shapeR: number;
        waterR: number;
        static createContainer(className: string) {
            if (!Shape.container) {
                Shape.container = document.createElement('div');
                Shape.container.className = className;
                document.body.appendChild(Shape.container);
            }
        }

        constructor(className: string, obj?: Options) {
            this.times = 10;
            this.value = 0;
            this.className = className;
            this.default(obj);
            this.shapeR = this.options.radius;
            this.waterR = this.shapeR - 10;
            this.build();
        }

        private default(obj) {
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
        }

        private build() {

            let lineWidth = this.options.lineWidth;
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
            } else {
                this.fillWater();
            }
            if (typeof this.options.text !== 'undefined') {
                this.drawText();
            }
        }

        private buildShape() {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.shapeR, 0, Math.PI * 2);
            this.ctx.strokeStyle = this.options.waterColor;
            this.ctx.lineWidth = this.options.lineWidth;
            this.ctx.stroke();
            this.ctx.closePath();
        }

        private buildWater() {
            let lineWidth = this.options.lineWidth;
            let waterRadius = this.waterR - lineWidth * 2;
            this.ctx.beginPath();
            this.ctx.globalCompositeOperation = 'destination-over';
            this.ctx.arc(this.x, this.y, this.waterR, 0, Math.PI * 2);
            this.ctx.strokeStyle = this.options.waterColor;
            this.ctx.lineWidth = this.options.lineWidth;
            this.ctx.stroke();
            this.ctx.closePath();
        }

        private fillWater() {
            // 使用二次贝塞尔曲线进行水面线的模拟
            // 1.先求点的纵坐标
            let sy = 2 * this.waterR * (1 - this.value) + (this.y - this.waterR);
            // 2.再求点的横坐标
            let sx = this.x - Math.sqrt(this.waterR * this.waterR - (sy - this.y) * (sy - this.y));

            // 水面中间的点坐标
            let mx = this.x;
            let my = sy;

            // 水面右侧侧的点坐标
            let ex = 2 * this.x - sx;
            let ey = sy;

            let extent = 0;

            if (this.options.deep > 0.9 || this.options.deep < 0.1 || !this.options.wave) {
                extent = sy
            } else {
                extent = sy - (this.x - sx) / 4
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
        }

        private animation() {
            let data = {
                isRunning: undefined
            };
            const min = 0.01;
            let requestAnimationFrame = function (func) {
                setTimeout(func, this.times);
            };
            let self = this;
            let update = function () {
                if (self.value < self.options.deep - min) {
                    self.value += (self.options.deep - self.value) / (1 / min);
                    data.isRunning = true;
                } else {
                    data.isRunning = false;
                }
            }
            let step = function () {
                self.fillWater();
                update();
                if (data.isRunning) {
                    requestAnimationFrame(step);
                }
            }
            step();
        }

        private drawText() {
            this.ctx.globalCompositeOperation = 'destination-over';

            let size = this.options.font ? this.options.font.replace(/\D+/g, '') : 0.3 * this.options.radius;
            this.ctx.font = this.options.font ? this.options.font : 'bold ' + size + 'px Microsoft Yahei';

            // this.options.text = this.options.text.length ? this.options.text : this.options.deep * 100 + '%';

            let sy = this.y + Number(size) / 2;
            let sx = this.x - this.ctx.measureText(this.options.text).width / 2;

            this.ctx.fillStyle = this.options.textColor;
            this.ctx.fillText(this.options.text, sx, sy);

        }

    }

    const skills: Object = {
        "HTML": {
            deep: 0.8,
        },
        "CSS": {
            deep: 0.6,
        },
        "JavaScript": {
            deep: 0.6,
        },
        "Jquery": {
            deep: 0.7,
        },
        "Bootstrap": {
            deep: 0.7,
        },
        "Vue": {
            deep: 0.5,
        },
        "Node": {
            deep: 0.5,
        },
    }
    const SkillShape: typeof Shape = Shape;
    SkillShape.createContainer('container');
    for (let skill in skills) {
        new SkillShape(skill, skills[skill]);
    }

}