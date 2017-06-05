$(function () {
    starAnd();
});
function starAnd() {
    var WINDOW_WIDTH = document.body.offsetWidth;
    var WINDOW_HEIGHT = document.body.offsetHeight;
    var canvas, context;
    var num = 150;  //设置星星数量
    var stars = [];
    var rnd;

    /*动态生成canvas*/
    var $canvasWraper = $('.J_canvas'),
        myCanvas = document.createElement("canvas");
    myCanvas.setAttribute("width", WINDOW_WIDTH);
    myCanvas.setAttribute("height", WINDOW_HEIGHT);
    myCanvas.setAttribute("id", "canvas");
    $canvasWraper.empty().append(myCanvas);
    canvas = document.getElementById('canvas');

    context = canvas.getContext('2d');

    addStar();
    setInterval(render, 20);
    liuxing();

    function liuxing() {
        var time = Math.round(Math.random() * 3000 + 33);
        setTimeout(function () {
            rnd = Math.ceil(Math.random() * stars.length);
            liuxing();
        }, time);
    }

    function render() {
        context.fillStyle = 'rgba(17,17,17,.3)';
        context.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

        for (var i = 0; i < num; i++) {
            var star = stars[i];
            if (i == rnd) {
                star.vx = -8;
                star.vy = 5;
                context.beginPath();
                context.strokeStyle = 'rgba(255,255,255,' + star.alpha + ')';
                context.lineWidth = star.r;
                context.moveTo(star.x, star.y);
                context.lineTo(star.x + star.vx, star.y + star.vy);
                context.stroke();
                context.closePath();
            }
            star.alpha += star.ra;
            if (star.alpha <= 0) {
                star.alpha = 0;
                star.ra = -star.ra;
                star.vx = Math.random() * 0.2 - 0.1;
                star.vy = Math.random() * 0.2 - 0.1;
            } else if (star.alpha > 1) {
                star.alpha = 1;
                star.ra = -star.ra
            }
            star.x += star.vx;
            if (star.x >= WINDOW_WIDTH) {
                star.x = 0;
            } else if (star.x < 0) {
                star.x = WINDOW_WIDTH;
                star.vx = Math.random() * 0.2 - 0.1;
                star.vy = Math.random() * 0.2 - 0.1;
            }
            star.y += star.vy;
            if (star.y >= WINDOW_HEIGHT) {
                star.y = 0;
                star.vy = Math.random() * 0.2 - 0.1;
                star.vx = Math.random() * 0.2 - 0.1;
            } else if (star.y < 0) {
                star.y = WINDOW_HEIGHT;
            }
            context.beginPath();
            var bg = context.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r);
            bg.addColorStop(0, 'rgba(255,255,255,' + star.alpha + ')');
            bg.addColorStop(1, 'rgba(255,255,255,0)');
            context.fillStyle = bg;
            context.arc(star.x, star.y, star.r, 0, Math.PI * 2, true);
            context.fill();
            context.closePath();
        }
    }

    function addStar() {
        for (var i = 0; i < num; i++) {
            var aStar = {
                x: Math.round(Math.random() * WINDOW_WIDTH),
                y: Math.round(Math.random() * WINDOW_HEIGHT),
                r: Math.random() * 3,
                ra: Math.random() * 0.05,
                alpha: Math.random(),
                vx: Math.random() * 0.2 - 0.1,
                vy: Math.random() * 0.2 - 0.1
            };
            stars.push(aStar);
        }
    }
}