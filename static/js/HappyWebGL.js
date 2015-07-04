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
    install_camera: function (name, camera){
        this.cameras[name] = camera;
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
        this.install_camera('main', new THREE.PerspectiveCamera(30, this.aspect, 0.1, 100));
        this.switch_camera('main');
        this.renderer = new THREE.WebGLRenderer();
        this.install_dom(this.renderer);
    },
    // オブジェクト関連初期状態構築
    setup: function (){
        this.cube = this.create_cube();
        this.current_camera.position.set(0, 0, 5);
        this.scene.add(this.cube);
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
    }
};
