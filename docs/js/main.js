//BLOCK GAME
const canvas = document.getElementById('myCanvas');

const cell = 16;

canvas.width = cell * 30;
canvas.height = cell * 30;

const ctx = canvas.getContext('2d');

/*********************************************************************************/

//操作設定
let MOUSE = false;

//ボール初期位置
const initX = canvas.width / 2;
const initY = canvas.height - 30;

//ボール位置初期化
let x = initX;
let y = initY;

//キー操作
let rightPressed = false;
let leftPressed = false;
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

/*********************************************************************************/

const user = window.navigator.userAgent;

if (user.match(/(iPhone|iPod|Android.*Mobile)/i)) {
    // スマホ（iPhone・Androidスマホ）の場合の処理を記述
    MOUSE = true;
    alert('You are using mobile device');
} else {
    // PC・タブレットの場合の処理を記述
}

/********************************************************************************/

//マウス操作
document.addEventListener('mousemove', mouseMoveHandler, false);

//タッチ操作
//document.addEventListener('touchstart',touchStartHandler, false);
document.addEventListener('touchmove', touchMoveHandler, false);



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
function movePaddle(tx) {

    if(!MOUSE){
        return;
    }

    //ポインタがキャンバスの範囲内であれば操作
    if (0 < tx && tx < paddleWidth) {

        paddleX = 0;

    } else if (0 < tx && tx < canvas.width) {

        paddleX = tx - paddleWidth;

    } else if (tx < 0) {

        paddleX = 0;

    } else if (canvas.width < tx) {

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

/*********************************************************************************/

//ボールコンフィグ
const ballRadius = 10;
const ballColor = '#0095DD';
let initialBallSpeed = 4;

//ボール向き乱数
function setBallAngle(init) {

    let max = init + 1;
    let min = init - 1;

    let value = 0;

    value = Math.floor(Math.random() * (max - min) + min);
    value = Math.random() < 0.5 ? -value : value;
    console.log(value);

    return value;

};
//移動速度
let dx = setBallAngle(initialBallSpeed);
let dy = 0;
//最初は必ず上向きに
while (dy < 1) {
    dy = setBallAngle(initialBallSpeed);
}


//パドルコンフィグ
const paddleHeight = 10;
const paddleWidth = 100;
const paddleWidthHalf = paddleWidth / 2
const paddleSpeed = 10;
const paddleColor = '#0095DD';
let paddleX = (canvas.width - paddleWidth) / 2;

//ブロックコンフィグ
let brickRowCount = 4;
let brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const brickColors = ['#0095DD', '#ffff89', '#ff8484', '#bf7fff'];
const bricksArea = brickRowCount * (brickHeight + (brickPadding * 2));
console.log(bricksArea);

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
    MOUSE = false;
    if (paddleWidthHalf < x && x + paddleWidthHalf < canvas.width) {

        paddleX = x - paddleWidthHalf;

    }
}

//レベル描画
function drawGameLevel() {
    ctx.font = '16px Arial';
    ctx.fillStyle = brickColors[gameLevel - 1];
    ctx.fillText(`Level: ${gameLevel}`, 8, 20);
}

//スコア描画
function drawScore() {
    ctx.font = scoreFont;
    ctx.fillStyle = scoreColor;
    ctx.fillText(`Score: ${score}`, 80, 20);
}

//ライフ描画
function drawLives() {
    ctx.font = livesFont;
    ctx.fillStyle = livesColor;
    ctx.fillText(`♡: ${lives}`, canvas.width - 50, 20);
}

//クリア画面表示
function drawGameClear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = '50px Arial';
    ctx.fillStyle = 'aquamarine';
    ctx.fillText(`\\\\YOU'RE WINNER//`, 0, (canvas.height / 2) - 50);
}

//引数として与えられた値をテキストで画面に表示
function drawText(value) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 40px monospace';
    ctx.fillStyle = 'black';
    ctx.fillText(value, 50, (canvas.height / 2));
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

//ブロック再描画用設定
function resetBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {

            let b = bricks[c][r];
            b.x = 0;
            b.y = 0;
            b.status = 1;

        }
    }
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

    drawGameLevel();
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
        if (paddleX < x && x < paddleX + paddleWidth) {

            dy = -dy;

        } else {

            lives--;
            if (!lives) {

                //GAME OVER
                cancelAnimationFrame(req);

                //0.5秒待機して描画変更
                setTimeout(() => {

                    drawText('   YOU LOSE   ');

                }, 500);

                //2秒待機してリロード
                setTimeout(() => {

                    location.reload();

                }, 2000);


            } else {

                cancelAnimationFrame(req);

                //再スタート
                x = initX;
                y = initY;
                paddleX = (canvas.width - paddleWidth) / 2;
                dx = setBallAngle(initialBallSpeed);
                dy = setBallAngle(-initialBallSpeed);

                setTimeout(draw, 500);

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

    if (CHEATEMODE) {

        cheatMove();

    }

    //ゲーム判定
    //スコアと現在のレベルの最高スコアを通過時にレベルカウントアップ
    if (score == brickColumnCount * brickRowCount * gameLevel) {

        gameLevel++;
        initialBallSpeed += 1;
        dx = setBallAngle(initialBallSpeed);
        dy = setBallAngle(initialBallSpeed);

        //カウントアップ後Y座標がブロック描画エリア以下の時に再描画指定
    } else if (y > bricksArea && score <= brickColumnCount * brickRowCount * (gameLevel - 1)) {

        resetBricks();

        //スコアリミット理論値に達した場合、クリア
    } else if (score === scoreLimit) {

        cancelAnimationFrame(req);
        drawGameClear();

    }

}

drawText(`Press Start`);

//ボタン押下でメイン処理開始
const startButton = document.getElementById('startButton');
const cheatButton = document.getElementById('cheat');
startButton.onclick = function () {

    drawText('    READY ?  ');
    setTimeout(draw, 2000);

    startButton.remove();
    cheatButton.remove();

};

let IGotPoint = 0;
cheatButton.onclick = function () {

    CHEATEMODE = true;

    if (IGotPoint === 0) {

        drawText('    READY ?  ');
        setTimeout(draw, 2000);
        cheatButton.innerText = 'I got point';
        startButton.remove();

    } else {

        location.reload();

    }
    IGotPoint++;

}