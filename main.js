
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

//ボール初期位置
const initX = canvas.width / 2;
const initY = canvas.height - 30;

//ボール位置初期化
let x = initX;
let y = initY;

//スコア
let score = 0;
let scoreColor = '#0095DD';
let scoreFont = '16px Arial';

//ライフ
let lives = 3;
let livesColor = '#0095DD';
let livesFont = '16px Arial';

//移動速度
let dx = 2;
let dy = -10;

//キー操作
let rightPressed = false;
let leftPressed = false;
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

//マウス操作
document.addEventListener('mousemove', mouseMoveHandler, false);

//ボールコンフィグ
const ballRadius = 10;
const ballColor = '#0095DD';

//パドルコンフィグ
const paddleHeight = 10;
const paddleWidth = 75;
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
const brickColor = '#0095DD';

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

//マウス操作イベント
function mouseMoveHandler(e) {

    const relativeX = e.clientX - canvas.offsetLeft;

    //マウスポインタがキャンバスの範囲内であれば操作
    if (relativeX > 0 && relativeX < canvas.width) {

        paddleX = relativeX - paddleWidth / 2;

    }

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
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
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
                ctx.fillStyle = brickColor;
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
                if ((x + ballRadius) > b.x && (x + ballRadius) < b.x + brickWidth) {

                    //ボールのy座標がブロックのy座標より大きい
                    //ボールのy座業がブロックのy座業と高さの和より小さい
                    if ((y - ballRadius) > b.y && (y - ballRadius) < b.y + brickHeight) {

                        dy = -dy;
                        b.status = 0;
                        score++;

                        //score = brickColumnCount * brickRowCount;

                        if (score == brickColumnCount * brickRowCount) {

                            clearInterval(interval);
                            alert("You Win");

                        }

                    }

                }

            }

        }
    }
}

//canvas要素のメインの処理
function draw() {

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
    if (y + dy < ballRadius) {

        dy = -dy;

    } else if (y + dy > canvas.height - ballRadius) {

        //パドル内におさまっているか
        if (x > paddleX && x < paddleX + paddleWidth) {

            dy = -dy;

        } else {

            lives--;
            if (!lives) {

                console.log('Game Over');
                clearInterval(interval);

            } else {

                x = initX;
                y = initY;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;

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

}

const interval = setInterval(draw, 10);