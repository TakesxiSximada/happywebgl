// -*- coding: utf-8 -*-
var HappyWebGL = {REVISION: '0.1.0'};

//browserify support
if (typeof module === 'object') {
    module.exports = HappyWebGL;
}

// polyfills
if (Math.sign === undefined) {
    Math.sign = function (x) {
        return (x < 0) ? -1 : (x > 0) ? 1 : +x;
    }
}

// logger
HappyWebGL.log = function () {console.log.apply(console, arguments);}
HappyWebGL.warn = function () {console.warn.apply(console, arguments);}
HappyWebGL.error = function () {console.error.apply(console, arguments);}


HappyWebGL.GlobalView = function (window, selector){
    this.window = window;
    this.selector = selector;
};
HappyWebGL.GlobalView.prototype = {
    // documentオブジェクト
    get document (){
        return this.window.document;
    },
    // 画面幅
    get width (){
        return this.window.innerWidth;
    },
    // 画面高さ
    get height (){
        return this.window.innerHeight;
    },
    // アスペクト比
    get aspect (){
        return this.width / this.height;
    },
    // なんだこれ?
    get devicePixelRatio (){
        return this.window.devicePixcelRatio;
    },
    // 現在のシーンを取得
    get current_scene (){
        return this.scene;
    },
    // 現在のカメラを取得
    get current_camera (){
        return this.cameras[this._current_camera_name];
    },
    // 現在のカメラのトラックボール
    get current_trackball (){
        return this.trackballs[this._current_camera_name];
    },
    // 描画更新処理親
    animate: function (){
        var self = this;
        self.window.requestAnimationFrame(function (){
            self.animate();
        });
        self.render();
    },
    // 描画更新処理子
    render: function (){
        this.update();
        var trackball = this.current_trackball;
        if (trackball){
            trackball.update();
        }
        this.renderer.render(this.scene, this.current_camera);
    },
    // DOM要素を挿入
    install_dom: function (renderer){
        var dom = this.document.querySelector(this.selector);
        dom.appendChild(renderer.domElement);
    },
    // シーンにオブジェクトをイントール
    install: function (obj){
        this.scene.add(obj);
    },
    // カメラをインストール
    install_camera: function (name, camera, trackball){
        this.cameras[name] = camera;
        if(trackball){
            this.trackballs[name] = trackball;
        }
    },
    // 画面のリサイズ対応
    resize: function (){
        this.renderer.setSize(this.width, this.height);
    },
    // カメラ変更
    switch_camera: function (name){
        this._current_camera_name = name;
    },
    // viewインフラ関連初期状態構築
    init: function (){
        this.scene = new THREE.Scene();
        this.cameras = {};
        this.trackballs = {};
        this.renderer = new THREE.WebGLRenderer();
        this.install_dom(this.renderer);
    },
    // カメラの設定
    setup_camera: function(){
        var camera = new THREE.PerspectiveCamera(30, this.aspect, 0.1, 100);
        var trackball = new THREE.TrackballControls(camera);
        // 回転無効化と回転速度の設定
        trackball.noRotate = false; // false:有効 true:無効
        trackball.rotateSpeed = 1.0;
        // ズーム無効化とズーム速度の設定
        trackball.noZoom = false; // false:有効 true:無効
        trackball.zoomSpeed = 1.0;
        // パン無効化とパン速度の設定
        trackball.noPan = false; // false:有効 true:無効
        trackball.panSpeed = 1.0;
        // スタティックムーブの有効化
        trackball.staticMoving = true; // true:スタティックムーブ false:ダイナミックムーブ
        // ダイナミックムーブ時の減衰定数
        trackball.dynamicDampingFactor = 0.3;
        this.install_camera('main', camera, trackball);
        this.switch_camera('main');

    },
    // オブジェクト関連初期状態構築
    setup: function (){
        this.setup_camera();
        this.cube = this.create_cube();
        this.current_camera.position.set(0, 0, 10);
        this.scene.add(this.cube);

        var text = this.create_text();
        this.install(text);
    },
    // オブジェクト/インフラ描画更新処理
    update: function (){
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        this.cube.rotation.z += 0.01;
    },
    // 描画スタート
    start: function (){
        this.resize();
        this.animate();
    },
    // 立方体作成
    create_cube: function (){
        return new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({color: 0xffffff})
        );
    },
    // 文字作成
    create_text: function (){
        var TextGeometry = new THREE.TextGeometry( 'Three.js!', {
            size: 30, height: 4, curveSegments: 3,
            font: "helvetiker", weight: "bold", style: "normal",
            bevelThickness: 1, bevelSize: 2, bevelEnabled: true

        });
        var Material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
        var Text = new THREE.Mesh( TextGeometry, Material );
        return Text;
        // return new THREE.Mesh(
        //     new THREE.TextGeometry("WebGL!! yay!!", {
        //         size: 30,
        //         height: 4,
        //         curveSegments: 3,
        //         font: "helvetiker", weight: "bold", style: "normal",
        //         bevelThickness: 1, bevelSize: 2, bevelEnabled: true
        //     }),
        //     new THREE.MeshLambertMaterial({color: 0x00ff00})
        // );
    },
};
