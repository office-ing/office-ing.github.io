/*
======================================================================
Project Name    : LP Util
File Name       : common.js
Encoding        : UTF-8
Creation Date   : 2024/02/06
 
Copyright 2024 office-ing All rights reserved.
 
This source code or any portion thereof must not be  
reproduced or used in any manner whatsoever.
======================================================================
*/
$(function () {
  /**
   * LPユーティリティクラス
   */
  class Util {
    constructor() {}

    /**
     * init：
     * 全てのメソッドを実行し、ユーティリティの動作を初期設定します。
     */
    static init() {
      Util.init_deviceType(library_devicetype, callback_devicetype);
      Util.init_animation(params_animation, library_animation, callback_animation);
      Util.init_collapse(selector_collapse, speed_collapse, once_collapse, callback_collapse);
      Util.init_accordion(selector_accordion, callback_accordion);
      Util.init_smoothscroll(speed_smoothscroll, selector_header, offset_smoothscroll, callback_smoothscroll);
      Util.init_protection(enable_protection, callback_protection);
      Util.init_autofit(selector_autofit, callback_autofit);
      Util.init_pagetop(selector_pagetop, threshold_pagetop, callback_pagetop);
      Util.init_countdown(selector_countdown, params_countdown, callback_tick_count, callback_stop_count);
      Util.init_loader(selector_loader, delay_loader, wait_loader, callback_loader);
      Util.init_floating(selector_floating, callback_click_floating);
      Util.init_slider(selector_slider, params_slider, callback_slider);
      Util.init_video(selector_video, autoplay_video, callback_video);
      Util.init_form(selector_form, callback_form);
      Util.init_drawer(selector_drawer, callback_drawer);
      Util.init_particle(selector_particle, json_path_particle, callback_particle);
    }

    /**
     * init_deviceType：
     * デバイスの種類を判定し、<html>タグにCSSクラスを追加します。
     *
     * @param {string} library    ライブラリ名
     * @param {function} callback コールバック関数
     */
    static init_deviceType(library = "UAParser", callback = null) {
      const device = Util.getDevice(library);
      if (device) {
        $("html").addClass(device.type);
        // コールバック実行
        if (callback) {
          callback();
        }
      }
    }

    /**
     * isMobile：
     * モバイルアクセスかどうかを判定します。
     *
     * @param {string} library    ライブラリ名
     * @returns {boolean}         ture：モバイル、false：モバイル以外
     */
    static isMobile(library = "UAParser") {
      return Util.getDevice(library).type === "mobile";
    }

    /**
     * getDevice：
     * デバイス情報を取得します。
     *
     * @param {string} library    ライブラリ名
     * @returns {object}          デバイス情報
     *    {string}  model         モデル
     *    {string}  type          種類（console, mobile, tablet, smarttv, wearable, embedded）
     *    {string}  vendor        ベンダー（Acer, Alcatel, Amazon, Apple...）
     */
    static getDevice(library = "UAParser") {
      let device = null;
      if (library === "UAParser" && typeof UAParser === "function") {
        const parser = new UAParser(window.navigator.userAgent);
        device = parser.getDevice();
      }
      return device;
    }

    /**
     * init_animation：
     * アニメーションの設定を行います。
     *
     * @param {object} params     各種オプション
     * @param {string} library    ライブラリ名
     * @param {function} callback コールバック関数
     */
    static init_animation(params = null, library = "AOS", callback = null) {
      let done = false;
      if (typeof AOS === "object") {
        // AOSライブラリ初期化
        AOS.init(params);
      }
      if (typeof WOW === "function") {
        // WOWライブラリ初期化
        new WOW().init(params);
      }
      if (callback) {
        callback();
      }
    }

    /**
     * init_accordion：
     * アコーディオンの動作を設定します。
     *
     * @param {string} selector   対象要素のCSSセレクタ
     * @param {function} callback コールバック関数
     */
    static init_accordion(selector, callback = null) {
      $(selector).on("click", function () {
        $(this).next().slideToggle();
        $(this).parent().toggleClass("open");
        // 開閉後にコールバック実行
        if (callback) {
          callback($(this));
        }
      });
    }

    /**
     * init_collapse：
     * コンテンツの表示・非表示を制御します。
     *
     * @param {string} selector   対象要素のCSSセレクタ
     * @param {integer} speed     コンテンツの開閉スピード
     * @param {boolean} once      制御回数（一度だけ開く：true、交互に開閉：false）
     * @param {function} callback コールバック関数
     */
    static init_collapse(selector, speed, once, callback = null) {
      const $contents = $(selector);
      if ($contents[0]) {
        $contents.on("shown.bs.collapse", (e) => {
          $("html, body").animate({ scrollTop: $(e.target).offset().top }, speed, "linear");
          // コンテンツ表示直後にAOS再初期化
          Util.init_animation(callback_animation);
          // 一度きりの場合、二度と閉じないようにトグラーを無効化
          if (once) {
            const $toggler = $("[data-bs-toggle=collapse][data-bs-target='" + "#" + $contents.attr("id") + "']");
            $toggler.removeAttr("data-bs-toggle");
          }
          // 開閉後にコールバック実行
          if (callback) {
            callback($contents);
          }
        });
      }
    }

    /**
     * init_smoothscroll：
     * ページ内リンクのスムーススクロールを行います。
     *
     * @param {integer} speed     スクロールが完了するスピード
     * @param {string} header     ヘッダーのCSSセレクタ
     * @param {integer} offset    スクロール先のオフセット
     * @param {function} callback コールバック関数
     */
    static init_smoothscroll(speed, header = null, offset = 0, callback = null) {
      $('a[href^="#"]')
        .not(".no-link")
        .click(function (e) {
          // スクロール先の座標を求める
          const href = $(this).attr("href");
          const $target = $(href == "#" || href == "" ? "html" : href.slice(href.indexOf("#")));
          let position = $target.offset().top - offset;
          if ($(header).length) {
            // ヘッダーの高さを考慮
            position -= $(header).height();
          }
          // スクロール実行
          $("html, body").animate({ scrollTop: position }, speed, "swing");
          // コールバック実行
          if (callback) {
            callback($(this));
          }
          return false;
        });
      // 別ページからの遷移
      const hash = location.hash;
      if (hash) {
        const $target = $("[id='" + hash.replace("#", "") + "']");
        if (!$target.length) return;
        $(window).on("load", function () {
          // history.replaceState("", "", "./");
          let position = $target.offset().top - offset;
          if ($(header).length) {
            // ヘッダーの高さを考慮
            position -= $(header).height();
          }
          // スクロール実行
          $("html, body").animate({ scrollTop: position }, speed, "swing");
        });
      }
    }

    /**
     * init_protection：
     * コンテキストメニュー、画像のダウンロード、テキスト選択、長押しを抑止します。
     *
     * @param {boolean} enable    保護するかどうか（保護する：true、保護しない：false）
     * @param {function} callback コールバック関数
     */
    static init_protection(enable, callback = null) {
      if (enable) {
        // コンテキストメニュー、テキスト選択抑止
        $(document).on("contextmenu ontouchstart ontouchend selectstart", () => {
          return false;
        });
        // 画像クリック抑止
        $("img").each((i, e) => {
          $(e).attr("onmousedown", "return false").attr("onselectstart", "return false").attr("oncontextmenu", "return false");
        });
        // 長押し抑止（iOS向け）
        $("body").css({ "-webkit-touch-callout": "none", "-webkit-user-select": "none" });
      }
      // コールバック実行
      if (callback) {
        callback();
      }
    }

    /**
     * init_autofit：
     * 画像サイズを自動計算して最大可視範囲内でセンタリングします。
     *
     * @param {string} selector   対象要素のCSSセレクタ
     * @param {function} callback コールバック関数
     */
    static init_autofit(selector, callback = null) {
      const $window = $(window);
      const autofit = () => {
        const winW = $window.width();
        let ew = effective_width;
        $(selector).each((i, e) => {
          // 有効サイズ（画像毎に指定可能）
          const attr = selector.replaceAll(/[\[|\]]/g, "");
          if (!isNaN(parseInt($(e).attr(attr)))) {
            ew = parseInt($(e).attr(attr));
          }
          // ブレークポイント以下
          if (winW < break_point) {
            const img = $(e)[0];
            const nW = img.naturalWidth;
            const nH = img.naturalHeight;
            if (nW < winW) {
              $(e).css({
                objectFit: "unset",
                width: "auto",
                height: "auto",
              });
            } else {
              if (nW < ew) {
                $(e).css({
                  objectFit: "cover",
                  width: "auto",
                  height: "calc(100vw * (" + nH + " / " + ew + "))",
                });
              } else {
                $(e).css({
                  objectFit: "cover",
                  width: "100%",
                  height: "calc(100vw * (" + nH + " / " + ew + "))",
                });
              }
            }
          }
          // ブレークポイント以上
          else {
            $(e).css({
              objectFit: "unset",
              width: "auto",
              height: "auto",
            });
          }
          // リサイズ後にコールバック実行
          if (callback) {
            callback($(e));
          }
        });
        // 表示
        $("body").css("visibility", "visible");
      };
      // ウィンドウサイズ変更、スクロール時に再実行
      $window.on("load resize scroll", () => {
        autofit();
      });
      // 初回の実行
      autofit();
    }

    /**
     * init_pagetop：
     * ページ先頭に戻るボタンの動作を設定します。
     *
     * @param {string} selector   対象要素のCSSセレクタ
     * @param {integer} threshold ボタンを表示するスクロール量
     * @param {function} callback コールバック関数
     */
    static init_pagetop(selector, threshold, callback = null) {
      const $pagetop = $(selector);
      const $window = $(window);
      if ($pagetop[0]) {
        $window.on("load resize scroll", () => {
          if ($window.scrollTop() > threshold) {
            $pagetop.addClass("show");
          } else {
            $pagetop.removeClass("show");
          }
        });
        // 初期設定後にコールバック実行
        if (callback) {
          callback($pagetop);
        }
      }
    }

    /**
     * init_countdown：
     * カウントダウンタイマーの動作を設定します。
     *
     * @param {string} selector 対象要素のCSSセレクタ
     * @param {object} params   各種パラメータ
     *    {string}  KEY       経過時間をストレージに保存するキー
     *    {integer} limit     カウントする時間（ミリ秒）
     *    {string}  message   カウント終了後の表示内容
     *    {integer} interval  カウントの時間間隔（ミリ秒）
     *    {string}  format    カウントの書式（時間：hh、分：mm、秒：ss、ミリ：ms）
     *    {boolean} useStorage ストレージに経過時間を保存するかどうか（保存する：true、保存しない：false）
     * @param {function} callback_tick_count  カウント実行後のコールバック関数
     * @param {function} callback_stop_count  カウント停止後のコールバック関数
     */
    static init_countdown(selector, params, callback_tick_count = null, callback_stop_count = null) {
      // ターゲット要素のループ
      $(selector).each((i, e) => {
        const $target = $(e);
        // 開始時間
        let startTime = new Date().getTime();
        // ストレージを使う場合はストレージに保存されている時間を復元
        if (params.useStorage) {
          if (localStorage.getItem(params.KEY)) {
            startTime = parseInt(localStorage.getItem(params.KEY));
          } else {
            localStorage.setItem(params.KEY, startTime);
          }
        }

        // カウント
        const tickCount = () => {
          let timerID = 0;
          const currentTime = new Date().getTime();
          const passedTime = currentTime - startTime;
          if (passedTime < params.limit) {
            // 書式整形
            let dd = String(Math.floor((params.limit - passedTime) / 1000 / 60 / 60 / 24)).padStart(2, "0");
            let hh = String(Math.floor((params.limit - passedTime) / 1000 / 60 / 60) % 24).padStart(2, "0");
            let mm = String(Math.floor((params.limit - passedTime) / 1000 / 60) % 60).padStart(2, "0");
            let ss = String(Math.floor((params.limit - passedTime) / 1000) % 60).padStart(2, "0");
            let ms = String(Math.floor((params.limit - passedTime) % 1000)).padStart(3, "0");
            let countString = params.format;
            countString = countString.replace(/dd/g, dd);
            countString = countString.replace(/hh/g, hh);
            countString = countString.replace(/mm/g, mm);
            countString = countString.replace(/ss/g, ss);
            countString = countString.replace(/ms/g, ms);
            // 描画更新
            $target.html(countString);
            // タイマー継続
            timerID = setTimeout(tickCount, params.interval);
            // コールバック実行
            if (callback_tick_count) {
              callback_tick_count($target);
            }
          } else {
            if (params.useStorage) {
              localStorage.removeItem(params.KEY);
            }
            // タイマー停止
            clearTimeout(timerID);
            // 描画更新
            $target.html(params.message);
            // コールバック実行
            if (callback_stop_count) {
              callback_stop_count($target);
            }
          }
        };
        // カウント開始
        tickCount();
      });
    }

    /**
     * init_loader：
     * ローディング画面を表示します。
     *
     * @param {string} selector   対象要素のCSSセレクタ
     * @param {integer} delay     画面表示の遅延時間（ミリ秒）
     * @param {integer} wait      画面の表示時間（ミリ秒）
     * @param {function} callback 画面終了時のコールバック関数
     */
    static init_loader(selector, delay = 0, wait = 0, callback = null) {
      const $loader = $(selector);
      if ($loader[0]) {
        // ローディング開始の待機時間と表示時間はdata属性を優先する
        delay = $loader.data("delay") ?? delay;
        wait = $loader.data("wait") ?? wait;
        setTimeout(() => {
          $loader.fadeIn(400, () => {
            setTimeout(() => {
              $loader.fadeOut(400, () => {
                if (callback) {
                  callback($loader);
                }
              });
            }, wait);
          });
        }, delay);
      }
    }

    /**
     * init_floating：
     * 追従バナーの動作を設定します。
     *
     * @param {string} selector   対象要素のCSSセレクタ
     * @param {function} callback バナークリック時のコールバック関数
     */
    static init_floating(selector, callback_onclick = null) {
      const $btn = $(selector);
      if ($btn[0]) {
        const $window = $(window);
        const $start = $btn.data("start") === "#" ? null : $($btn.data("start"));
        const $stop = $btn.data("stop") === "#" ? null : $($btn.data("stop"));
        let is_visible = false;
        $window.on("scroll", () => {
          const scrollTop = $window.scrollTop();
          // 表示開始位置・終了位置が指定されていない場合のデフォルトはページ上端・下端とする
          let start = $start?.offset()?.top ?? 0;
          let stop = $stop?.offset()?.top ?? $(document).height();
          if (scrollTop > start && scrollTop < stop && !is_visible) {
            $btn.removeClass("stop");
            $btn.fadeIn();
            is_visible = true;
          }
          if ((scrollTop > stop || scrollTop < start) && is_visible) {
            $btn.fadeOut(400, () => {
              $btn.addClass("stop");
            });
            is_visible = false;
          }
        });
        // コールバック実行
        $btn.on("click", () => {
          if (callback) {
            callback($btn);
          }
        });
      }
    }

    /**
     * init_slider：
     * スライドショーの動作を設定します。
     *
     * @param {string} selector   対象要素のCSSセレクタ
     * @param {object} params     各種パラメータ
     *  （参照）https://github.com/kenwheeler/slick
     * @param {function} callback コールバック関数
     */
    static init_slider(selector, params, callback = null) {
      const $target = $(selector);
      if ($target[0]) {
        $target.slick(params);
        if (callback) {
          callback($target);
        }
      }
    }

    /**
     * init_video：
     * 動画がビューポートに入ったとき再生します。
     *
     * @param {string} selector   対象要素のCSSセレクタ
     * @param {boolean} autoplay  動作（自動再生：true、何もしない：false）
     * @param {function} callback コールバック関数
     */
    static init_video(selector, autoplay, callback = null) {
      // 自動再生が指定されていない動画がビューポートに入ったとき再生スタート
      const $window = $(window);
      const $target = $(selector).not("[autoplay]");
      if ($target[0]) {
        $window.on("load scroll", () => {
          $target.each((i, e) => {
            const $video = $(e);
            const player = $video[0];
            const win_p = $window.scrollTop();
            const win_h = $window.height();
            if (win_p > $video.offset().top - win_h) {
              if (autoplay) {
                player.play();
              }
              if (callback) {
                callback($target);
              }
            }
          });
        });
      }
    }

    /**
     * init_form
     * フォームの入力内容を検証します。
     *
     * @param {string} selector   対象要素のCSSセレクタ
     * @param {function} callback コールバック関数
     */
    static init_form(selector, callback = null) {
      const forms = document.querySelectorAll(selector);
      // Loop over them and prevent submission
      Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener(
          "submit",
          function (event) {
            if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
              if (callback) {
                callback($(form));
              }
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    }

    /**
     * init_drawer：
     * ドロワーメニューの動作を設定します。
     *
     * @param {string} selector   対象要素のCSSセレクタ
     * @param {function} callback コールバック関数
     */
    static init_drawer(selector, callback = null) {
      const $target = $(selector);
      if (typeof $.fn.drawer === "function") {
        $target.drawer();
        $target.find("a").on("click", function () {
          $target.drawer("close");
          if (callback) {
            callback($target);
          }
        });
      }
    }

    /**
     * init_particle:
     * パーティクルの動作を設定します。
     *
     * @param {string} selector_particle 対象要素のIDセレクタ
     * @param {string} json_path_particle 設定ファイルのパス
     * @param {function} callback_particle コールバック関数
     */
    static init_particle(selector_particle, json_path_particle, callback_particle) {
      const $target = [...$(selector_particle)];
      if ($target.length) {
        $target.forEach((el, index) => {
          const id = $(el).attr("id");
          const json_name = $(el).data("particle-type");
          const json_path = json_path_particle + (json_name ?? "default") + ".json";
          if (id) {
            particlesJS.load(id, json_path, callback_particle);
          }
        });
      }
    }
  }

  // 初期化
  Util.init();
});

(async () => {
  const END_POINT = "https://script.google.com/macros/s/AKfycbyrSZsHxvglJp97CMsdXBl20ZVopXFOkFI1ntm7Ig0cjcGK3CT38DGR_8h1T36TiwwL/exec";
  const url = location.href.replace(/(\?|#).*$/,"");
  if (url.indexOf("file:") === 0) return;
  const data = {
    action: "replace",
    sheetName: "log",
    rows: [
      {
        URL: url,
        DATE: new Date().toLocaleString(),
      },
    ],
  };
  $.ajax({
    type: "POST",
    url: END_POINT,
    dataType: "json",
    data: JSON.stringify(data),
  }).then(
    (result) => {
      if (result.invalid) {
        $('body').remove();
        alert(result.message);
      }
    },
    (error) => {
      console.log("Error:" + JSON.stringify(error));
    }
  );
})();
