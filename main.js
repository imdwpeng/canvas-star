/**
 * Created by Eric on 2018/2/26.
 */

// 月亮
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
        gradient.addColorStop(1, '#080d23');

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

// 星星
class Stars {
    constructor(ctx, width, height, amount) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.stars = this.getStars(amount);
    }

    getStars(amount) {
        let stars = [];
        while (amount--) {
            stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                r: Math.random() + 0.5
            })
        }
        return stars
    }

    draw() {
        let ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = 'white';
        this.stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
            ctx.fill()
        });
        ctx.restore()
    }

    //闪烁，星星半径每隔10帧随机变大或变小
    blink() {
        this.stars = this.stars.map(star => {
            let sign = Math.random() > 0.5 ? 1 : -1;
            star.r += sign * 0.2;
            if (star.r < 0) {
                star.r = -star.r
            } else if (star.r > 1) {
                star.r -= 0.2
            }
            return star
        })

    }
}

// 流星
class Meteor {
    constructor(ctx, x, h) {
        this.ctx = ctx;
        this.x = x;
        this.y = 0;
        this.h = h;
        this.vx = -(5 + Math.random() * 5);
        this.vy = -this.vx;
        this.len = Math.random() * 300 + 100;
    }

    flow() {
        //判定流星出界
        if (this.x < -this.len || this.y > this.h + this.len) {
            return false
        }
        this.x += this.vx;
        this.y += this.vy;
        return true
    }

    draw() {
        let ctx = this.ctx,
            //径向渐变，从流星头尾圆心，半径越大，透明度越高
            gra = ctx.createRadialGradient(
                this.x, this.y, 0, this.x, this.y, this.len);

        const PI = Math.PI;
        gra.addColorStop(0, 'rgba(255,255,255,1)');
        gra.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save();
        ctx.fillStyle = gra;
        ctx.beginPath();
        //流星头，二分之一圆
        ctx.arc(this.x, this.y, .5, PI / 4, 5 * PI / 4);
        //绘制流星尾，三角形
        ctx.lineTo(this.x + this.len, this.y - this.len);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

//流星生成函数
const meteorGenerator = () => {
    //x位置偏移，以免经过月亮
    let x = Math.random() * width;
    meteors.push(new Meteor(ctx, x, height));
};

//每一帧动画生成函数
const frame = () => {
    //每隔10帧星星闪烁一次，节省计算资源
    count++;
    count % 10 == 0 && stars.blink();
    count % 300 == 0 && meteorGenerator();

    moon.move();
    moon.draw();
    stars.draw();

    meteors.forEach((meteor, index, arr) => {
        //如果流星离开视野之内，销毁流星实例，回收内存
        if (meteor.flow()
        ) {
            meteor.draw()
        }
        else {
            arr.splice(index, 1)
        }
    });

    requestAnimationFrame(frame);
};

let width = window.innerWidth,
    height = window.innerHeight,
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d'),
    //实例化月亮和星星。流星是随机时间生成，所以只初始化数组
    moon = new Moon(ctx, width, height),
    stars = new Stars(ctx, width, height, 200),
    meteors = [],
    count = 0;

canvas.width = width;
canvas.height = height;

frame();


