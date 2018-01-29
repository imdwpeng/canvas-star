/**
 * Created by Eric on 17/11/7.
 */


var iWidth = document.body.offsetWidth,
    iHeight = document.body.offsetHeight;

/*动态生成canvas*/
var myCanvas = document.createElement("canvas");
myCanvas.setAttribute("width", iWidth);
myCanvas.setAttribute("height", iHeight);
myCanvas.setAttribute("id", "canvas");
document.getElementById('J_canvas').appendChild(myCanvas);

var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

class Moon {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.circle_x = width / 2;      //旋转轨迹圆心的X坐标
        this.circle_y = width;          //旋转轨迹圆心的Y坐标
        this.circle_r = width;          //旋转轨迹的半径
        this.angle = Math.atan2(Math.sqrt(width * width * 3 / 4), -width / 2);                  //旋转轨迹的角度
        this.startAngle = Math.atan2(Math.sqrt(width * width * 3 / 4), -width / 2 - 400);       //开始旋转的角度
        this.endAngle = Math.atan2(Math.sqrt(width * width * 3 / 4), width / 2 + 200);          //结束旋转的角度
        this.x = 0;         //月亮的X坐标
        this.y = 0;         //月亮的Y坐标
    }

    draw() {
        let {ctx, x, y, width, height} = this;

        var gradient = ctx.createRadialGradient(x, y, 50, x, y, 600);
        gradient.addColorStop(0, 'rgb(255,255,255)');
        gradient.addColorStop(0.01, 'rgb(70,70,80)');
        gradient.addColorStop(0.2, 'rgb(40,40,50)');
        gradient.addColorStop(0.4, 'rgb(20,20,30)');
        gradient.addColorStop(1, 'rgb(0,0,10)');

        ctx.save();
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    move() {
        let {circle_x, circle_y, circle_r, angle, startAngle, endAngle,} = this;
        this.angle = angle - 0.0001;

        if (this.angle <= endAngle) {
            this.angle = startAngle;
        }

        this.x = circle_x + (circle_r * Math.cos(angle));
        this.y = circle_y - (circle_r * Math.sin(angle)) + 50;
    }
}

class Stars {
    constructor(ctx, width, height, amount) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.amount = amount;
        this.stars = this.getStars(amount);
    }

    getStars(amount) {
        let stars = [];
        while (amount--) {
            stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                r: Math.random() * 2,
                ra: Math.random() * 0.05,
                alpha: Math.random(),
                vx: Math.random() * 0.2 - 0.1,
                vy: Math.random() * 0.2 - 0.1
            })
        }
        return stars;
    }

    draw() {
        let {ctx} = this;
        ctx.save();
        ctx.fillStyle = 'white';
        this.stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        });
        ctx.restore();
    }

    //闪烁
    blink() {
        this.stars = this.stars.map(star => {
            let sign = Math.random() > 0.5 ? 1 : -1;
            star.r += sign * 0.2;
            if (star.r < 0) {
                star.r = -star.r;
            } else if (star.r > 2) {
                star.r -= 0.2;
            }
            return star;
        });
    }
}

class MeteorFlare {
    constructor(ctx, width, height, amount) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.meteors = this.getMeteor(amount);
    }

    getMeteor(amount) {
        let meteors = [];
        while (amount--) {
            meteors.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                r: Math.random() * 2,
                ra: Math.random() * 0.05,
                alpha: Math.random(),
                vx: Math.random() * 0.2 - 0.1,
                vy: Math.random() * 0.2 - 0.1
            })
        }
        return meteors;

    }

    draw() {
        let ctx = this.ctx;

        this.meteors.forEach((meteor) => {
            console.log(meteor)
            //径向渐变，从流星头尾圆心，半径越大，透明度越高
            let gra = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, meteor.r);

            gra.addColorStop(0, 'rgba(255,255,255,1)');
            gra.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.save();
            ctx.fillStyle = gra;
            ctx.beginPath();
            //流星头，二分之一圆
            ctx.arc(meteor.x, meteor.y, 1, Math.PI / 4, 5 * Math.PI / 4);
            //绘制流星尾，三角形
            ctx.lineTo(meteor.x + meteor.r, meteor.y - meteor.r);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });

    }
}

let moon = new Moon(context, iWidth, iHeight);
let stars = new Stars(context, iWidth, iHeight, 200);
let meteors = new MeteorFlare(context, iWidth, iHeight, 2);

//每一帧动画生成函数
let count = 0;
const frame = () => {

    count++;
    //每隔10帧星星闪烁一次
    count % 10 == 0 && stars.blink();
    //每隔100帧出现一个流星
    count % 100 == 0 && meteors.draw();

    //月亮移动
    moon.move();
    moon.draw();
    stars.draw();

    requestAnimationFrame(frame);
};

frame();

