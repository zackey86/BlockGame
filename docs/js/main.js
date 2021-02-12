
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

//操作設定
const MOUSE = false;

//ボール初期位置
const initX = canvas.width / 2;
const initY = canvas.height - 30;

//ボール位置初期化
let x = initX;
let y = initY;

//ボール向き乱数
function setBallAngle(init) {
    let value = 0;
    while (value === 0) {
        value = Math.floor(Math.random() * (init - (-init)) + (-init));
        console.log(value);
    }
    return value;
};

//移動速度
const initialBallSpeed = 5;
let dx = setBallAngle(initialBallSpeed);
let dy = 0;

while (dy < 1) {
    dy = setBallAngle(initialBallSpeed);
}

//キー操作
let rightPressed = false;
let leftPressed = false;
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

if (MOUSE) {

    //マウス操作
    document.addEventListener('mousemove', mouseMoveHandler, false);

    //タッチ操作
    //document.addEventListener('touchstart',touchStartHandler, false);
    document.addEventListener('touchmove', touchMoveHandler, false);
    
}

//ボールコンフィグ
const ballRadius = 10;
const ballColor = '#0095DD';

//パドルコンフィグ
const paddleHeight = 10;
const paddleWidth = 75;
const paddleWidthHalf = paddleWidth / 2
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 7;
const paddleColor = '#0095DD';

//ブロックコンフィグ
let brickRowCount = 3;
let brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const brickColors = ['#0095DD', '#fff89', '#ff8484', '#bf7fff'];

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}

//レベル初期化
let gameLevel = 1;
const levelLimit = brickColors.length;

//スコア
let score = 0;
let scoreColor = '#0095DD';
let scoreFont = '16px Arial';
const scoreLimit = brickColumnCount * brickRowCount * levelLimit;

//ライフ
let lives = 3;
let livesColor = '#0095DD';
let livesFont = '16px Arial';

//チートコード
let CHEATEMODE = false;
function cheatMove() {
    if(paddleWidthHalf < x && x + paddleWidthHalf < canvas.width){

        paddleX = x - paddleWidthHalf;

    }
}

//キー操作イベント
function keyDownHandler(e) {

    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true;
    }
    else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true;
    }

}
function keyUpHandler(e) {

    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = false;
    }
    else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false;
    }

}

//タッチ、マウス処理
function movePaddle(x) {

    //ポインタがキャンバスの範囲内であれば操作
    if (0 < x && x < paddleWidth) {

        paddleX = 0;

    } else if (0 < x && x < canvas.width) {

        paddleX = x - paddleWidth;

    } else if (x < 0) {

        paddleX = 0;

    } else if (canvas.width < x) {

        paddleX = canvas.width - paddleWidth;

    }

}

//マウス操作イベント
function mouseMoveHandler(e) {

    const relativeX = e.clientX - canvas.offsetLeft;

    movePaddle(relativeX);

}

//タッチ操作イベント
function touchStartHandler(e) {

    const relativeX = e.targetTouches[0].clientX - canvas.offsetLeft;
    movePaddle(relativeX);

}
function touchMoveHandler(e) {

    const reativeX = e.targetTouches[0].clientX - canvas.offsetLeft;
    movePaddle(reativeX);

}

//スコア描画
function drawScore() {
    ctx.font = scoreFont;
    ctx.fillStyle = scoreColor;
    ctx.fillText(`Score: ${score}`, 8, 20);
}

//ライフ描画
function drawLives() {
    ctx.font = livesFont;
    ctx.fillStyle = livesColor;
    ctx.fillText(`♡: ${lives}`, 80, 20);
}


//ボールの描画
function drawBall() {

    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();

}

//パドルの描画
function drawPaddle() {

    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleWidth);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();

}

//ブロックの描画
function drawBricks() {

    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {

            let brick = bricks[c][r];
            if (brick.status == 1) {

                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;

                brick.x = brickX;
                brick.y = brickY;

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColors[gameLevel - 1];
                ctx.fill();
                ctx.closePath();

            }
        }
    }
}

//ブロック衝突検出
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {

            let b = bricks[c][r];
            if (b.status == 1) {

                //ボールのx座標がブロックのx座標より大きい
                //ボールのx座業がブロックのx座業とその幅の和より小さい
                if ((x + ballRadius) > b.x && (x - ballRadius) < b.x + brickWidth) {

                    //ボールのy座標がブロックのy座標より大きい
                    //ボールのy座業がブロックのy座業と高さの和より小さい
                    if ((y + ballRadius) > b.y && (y - ballRadius) < b.y + brickHeight) {

                        dy = -dy;
                        b.status = 0;
                        score++;

                        //score = brickColumnCount * brickRowCount * gameLevel;

                        if (score == brickColumnCount * brickRowCount * gameLevel) {

                            gameLevel++;

                        } else if (score === scoreLimit) {

                        }

                    }

                }

            }

        }
    }
}

//canvas要素のメインの処理
function draw() {

    let req = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawBall();
    drawPaddle();

    collisionDetection();
    drawBricks();

    drawScore();
    drawLives();

    //基礎移動
    x += dx;
    y += dy;

    //ボールの壁への衝突検出
    //x
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    //y
    //上面
    if (y + dy < ballRadius) {

        dy = -dy;

    //下面
    } else if (y + dy > canvas.height - paddleHeight - ballRadius) {

        //パドル内におさまっているか
        if (x > paddleX && x < paddleX + paddleWidth) {

            dy = -dy;

        } else {

            lives--;
            if (!lives) {

                console.log('Game Over');
                cancelAnimationFrame(req);

            } else {

                //再スタート
                x = initX;
                y = initY;
                paddleX = (canvas.width - paddleWidth) / 2;
                dx = setBallAngle(initialBallSpeed);
                dy = setBallAngle(-initialBallSpeed);

            }

        }

    }

    //パドル移動 範囲指定
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }

    if(CHEATEMODE){
        
        cheatMove();

    }

}

draw();