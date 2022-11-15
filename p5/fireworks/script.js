var fireworks = [];
var particles = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
}

function draw() {
    // 暗い背景を描く
    background(21, 21, 19, 10);
    
    // たまに花火を打ち上げる（1000回のうち6回の確率）
    if (random(1000) < 6) {
        // 花火クラスからnewで花火を新しく作って配列に追加する
        fireworks.push(new Firework());
    }
    
    // 花火の本体の数だけ処理する
    for (var i = 0; i < fireworks.length; i++) {
        // 花火本体を移動させる
        fireworks[i].move();
        // 花火本体を表示する
        fireworks[i].draw();
        
        // 爆発したら
        if (fireworks[i].mode == 'explode') {
            // 花火本体を配列から消す
            fireworks.splice(i, 1);
        }
    }
    
    // 花火の粒の数だけ処理する
    for (var i = 0; i < particles.length; i++) {
        // 花火の粒を移動させる
        particles[i].move();
        // 花火の粒を表示する
        particles[i].draw();
        
        // 花火の粒が消える時間になったら
        if (particles[i].lifetime < 0) {
            // 花火の粒を配列から消す
            particles.splice(i, 1);
        }
    }
}


// 花火クラス
class Firework {
    constructor() {
        // 初期位置
        this.position = createVector(random(width), height - 100);
        // 速度
        this.velocityY = random(-3.2, -4.0);
        // 色
        this.color = color(random(200, 255), random(150, 255), random(100, 255));
        // モード
        this.mode = 'move';
        // 揺れの表現のために横の位置を保存しておく
        this.baseX = this.position.x;
    }
    
    // 移動
    move() {
        // 重力
        this.velocityY += 0.02;
        // 速度
        this.position.y += this.velocityY;
        // 上昇中の揺れ
        this.position.x = this.baseX + 0.6 * sin(this.position.y * 0.3);
        // 頂点で花火を爆発
        if (this.velocityY > 0) {
            this.explode();
        }
    }
    
    explode() {
        this.mode = 'explode';
        
        var size = random(3.5, 7.0);
        // 花火本体の座標と色を使って花火の粒を作る
        for (var i = 0; i < 500; i++) {
            particles.push(new Particle(this.position.x, this.position.y, this.color, size));
        }
        
    }
    
    draw() {
        fill(this.color);
        ellipse(this.position.x, this.position.y, 5);
    }
}


// 花火の粒クラス
class Particle {
    constructor(x, y, color, size) {
        // 初期位置
        this.position = createVector(x, y);
        // 飛び散る向きをランダムに決める
        this.velocity = p5.Vector.random2D();
        // 飛び散る強さをランダムに決める
        this.velocity.mult(random(size));

        // 花火本体の色を使う
        this.color = color;

        this.lifetime = random(120, 180);
    }
    
    move() {
        this.velocity.y += 0.015;
        // 空気抵抗
        this.velocity.mult(0.98);
        this.position.add(this.velocity);
        
        this.lifetime--;
    }
    
    draw() {
        fill(this.color);
        ellipse(this.position.x, this.position.y, 2);
    }
}