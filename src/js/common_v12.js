/*
======================================================================
Project Name    : LP Util
File Name       : common.js
Encoding        : UTF-8
Creation Date   : 2024/02/06
History         : 
2024/04/17 ADD popup script
2024/04/30 MOD countdown format
2024/05/19 MOD popup script
2024/05/22 ADD youtube lazyload script
2024/06/05 ADD youtube params
2024/06/12 DEL init_deviceType
2024/06/12 MOD fully update
2024/06/18 ADD init_countup
2024/06/18 ADD init_date
2024/06/20 MOD init_countup
2024/06/26 MOD init_youtube
2025/03/18 ADD loadAuthScript()

Copyright 2024 office-ing All rights reserved.
 
This source code or any portion thereof must not be  
reproduced or used in any manner whatsoever.
======================================================================
*/

/**
 * 認証
 */
(function loadAuthScript() {
  const script = document.createElement("script");
  script.src = "auth.min.js";
  document.head.appendChild(script);
})();

$(function () {
  /**
   * LPユーティリティクラス
   */
  class Util {
    /**
     * コンストラクタ
     */
    constructor() {
      if (config) {
        this.#init_autofit(config.autofit);
        this.#init_animation(config.animation);
        this.#init_collapse(config.collapse);
        this.#init_accordion(config.accordion);
        this.#init_smoothscroll(config.smoothscroll);
        this.#init_protection(config.protection);
        this.#init_pagetop(config.pagetop);
        this.#init_countdown(config.countdown);
        this.#init_countup(config.countup);
        this.#init_loader(config.loader);
        this.#init_floating(config.floating);
        this.#init_slider(config.slider);
        this.#init_video(config.video);
        this.#init_form(config.form);
        this.#init_drawer(config.drawer);
        this.#init_particle(config.particle);
        this.#init_popup(config.popup);
        this.#init_youtube(config.youtube);
        this.#init_date(config.date);
      }
    }

    /**
     * init_autofit：
     * 画像サイズを自動計算して最大可視範囲内でセンタリングします。
     *
     * @param {Object} settings 設定情報
     */
    #init_autofit = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      const $window = $(window);
      const autofit = () => {
        const winW = $window.width();
        let ew = params.effective_width;
        $(selector).each((i, e) => {
          // 有効サイズ（画像毎に指定可能）
          const attr = selector.replaceAll(/[\[|\]]/g, "");
          if (!isNaN(parseInt($(e).attr(attr)))) {
            ew = parseInt($(e).attr(attr));
          }
          // ブレークポイント以下
          if (winW < params.break_point) {
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
          if (params.hasOwnProperty("callback") && params.callback) {
            params.callback($(e));
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
    };

    /**
     * init_animation：
     * アニメーションの設定を行います。
     *
     * @param {Object} settings 設定情報
     */
    #init_animation = (settings) => {
      if (!settings.enable) return;
      const params = settings.params;

      if (typeof AOS === "object") {
        // AOSライブラリ初期化
        AOS.init(params);
      }
      if (typeof WOW === "function") {
        // WOWライブラリ初期化
        new WOW().init(params);
      }
      // コールバック実行
      if (params.hasOwnProperty("callback") && params.callback) {
        params.callback();
      }
    };

    /**
     * init_collapse：
     * コンテンツの表示・非表示を制御します。
     *
     * @param {Object} settings 設定情報
     */
    #init_collapse = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      const $contents = $(selector);
      if ($contents[0]) {
        $contents.on("shown.bs.collapse", (e) => {
          // コンテンツを表示し、スクロールする
          $("html, body")
            .animate({ scrollTop: $(e.target).offset().top }, params.speed, "linear")
            .promise()
            .done(() => {
              // 開閉後にコールバック実行
              if (params.hasOwnProperty("callback") && params.callback) {
                params.callback($contents);
              }
              // コンテンツ表示直後にAOS再初期化
              this.#init_animation(config.animation);
            });
          // 一度きりの場合、二度と閉じないようにトグラーを無効化
          if (params.once) {
            const $toggler = $("[data-bs-toggle=collapse][data-bs-target='" + "#" + $contents.attr("id") + "']");
            $toggler.removeAttr("data-bs-toggle");
          }
        });
      }
    };

    /**
     * init_accordion：
     * アコーディオンの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_accordion = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      $(selector).on("click", function () {
        $(this).next().slideToggle();
        $(this).parent().toggleClass(params.open_class);
        // 開閉後にコールバック実行
        if (params.hasOwnProperty("callback") && params.callback) {
          params.callback($(this));
        }
      });
    };

    /**
     * init_smoothscroll：
     * ページ内リンクのスムーススクロールを行います。
     *
     * @param {Object} settings 設定情報
     */
    #init_smoothscroll = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      $(selector)
        .not(params.exclude)
        .on("click", function (e) {
          // スクロール先の座標を求める
          const href = $(this).attr("href");
          const $target = $(href == "#" || href == "" ? "html" : href.slice(href.indexOf("#")));
          let position = $target.offset().top - params.offset;
          // 固定ヘッダーが存在する場合、ヘッダーの高さを考慮
          if ($(params.header).length) {
            position -= $(params.header).height();
          }
          // スクロール実行
          $("html, body")
            .animate({ scrollTop: position }, params.speed, params.easing)
            .promise()
            .done(() => {
              // コールバック実行
              if (params.hasOwnProperty("callback") && params.callback) {
                params.callback($(this));
              }
            });
          return false;
        });
      // 別ページからの遷移
      const hash = location.hash;
      if (hash) {
        const $target = $("[id='" + hash.replace("#", "") + "']");
        if (!$target.length) return;
        $(window).on("load", function () {
          let position = $target.offset().top - params.offset;
          if ($(params.header).length) {
            // ヘッダーの高さを考慮
            position -= $(params.header).height();
          }
          // スクロール実行
          $("html, body").animate({ scrollTop: position }, params.speed, params.easing);
        });
      }
    };

    /**
     * init_protection：
     * コンテキストメニュー、画像のダウンロード、テキスト選択、長押しを抑止します。
     *
     * @param {Object} settings 設定情報
     */
    #init_protection = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      // コンテキストメニュー、テキスト選択抑止
      if (params.hasOwnProperty("contextmenu") && params.contextmenu) {
        $(document).on("contextmenu ontouchstart ontouchend selectstart", () => {
          return false;
        });
      }
      // 画像クリック抑止
      if (params.hasOwnProperty("image") && params.image) {
        $("img").each((i, e) => {
          $(e).attr("onmousedown", "return false").attr("onselectstart", "return false").attr("oncontextmenu", "return false");
        });
      }
      // 長押し抑止（iOS向け）
      if (params.hasOwnProperty("touch") && params.touch) {
        $("body").css({ "-webkit-touch-callout": "none", "-webkit-user-select": "none" });
      }
      // コールバック実行
      if (params.hasOwnProperty("callback") && params.callback) {
        params.callback();
      }
    };

    /**
     * init_pagetop：
     * ページ先頭に戻るボタンの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_pagetop = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      const $pagetop = $(selector);
      const $window = $(window);
      if ($pagetop[0]) {
        $window.on("load resize scroll", () => {
          if ($window.scrollTop() > params.threshold) {
            $pagetop.addClass(params.show_class);
          } else {
            $pagetop.removeClass(params.show_class);
          }
        });
        // 初期設定後にコールバック実行
        if (params.hasOwnProperty("callback") && params.callback) {
          params.callback();
        }
      }
    };

    /**
     * init_countup
     * カウントアップタイマーの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_countup = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      const key = params.KEY;
      const from = params.from;
      const to = params.to;
      const diff = params.diff;
      const interval = params.interval;
      const format = params.format;
      const message = params.message;
      const useStorage = params.useStorage;
      const $target = $(selector);

      // ターゲット要素の存在チェック
      if (!$target[0]) {
        return;
      }

      // 開始値
      let count = from;

      // ストレージを使う場合はストレージに保存されているカウントを復元
      if (useStorage) {
        if (localStorage.getItem(key)) {
          count = parseInt(localStorage.getItem(key));
        } else {
          localStorage.setItem(key, count);
        }
      }

      const formatString = (format) => {
        return format.replace(/{n}/g, count);
      };

      const tickCount = () => {
        // カウント更新
        count += diff;
        localStorage.setItem(key, count);
        // 描画更新
        $target.html(formatString(format));
        // 停止条件
        if ((from < to && to <= count) || (to < from && count <= to)) {
          count = to;
          // ストレージ削除
          if (useStorage) {
            localStorage.removeItem(key);
          }
          // タイマー停止
          clearInterval(timerID);
          // 描画更新
          if (message !== "") {
            $target.html(message);
          } else {
            $target.html(formatString(format));
          }
          // クラス付与
          $target.addClass("over");
          // コールバック実行
          if (params.hasOwnProperty("callback") && params.callback) {
            params.callback($target);
          }
        }
      };

      // タイマー起動
      let timerID = setInterval(tickCount, interval);

      // 初回実行
      $target.html(formatString(format));
    };

    /**
     * init_countdown：
     * カウントダウンタイマーの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_countdown = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      // ターゲット要素のループ
      $(selector).each((_, e) => {
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
            let dd = String(Math.floor((params.limit - passedTime) / 1000 / 60 / 60 / 24));
            if (params.hasOwnProperty("padDD")) {
              dd = dd.padStart(params.padDD, "0");
            }
            let hh = String(Math.floor((params.limit - passedTime) / 1000 / 60 / 60) % 24);
            if (params.hasOwnProperty("padHH")) {
              hh = hh.padStart(params.padHH, "0");
            }
            let mm = String(Math.floor((params.limit - passedTime) / 1000 / 60) % 60);
            if (params.hasOwnProperty("padMM")) {
              mm = mm.padStart(params.padMM, "0");
            }
            let ss = String(Math.floor((params.limit - passedTime) / 1000) % 60);
            if (params.hasOwnProperty("padSS")) {
              ss = ss.padStart(params.padSS, "0");
            }
            let ms = String(Math.floor((params.limit - passedTime) % 1000));
            if (params.hasOwnProperty("padMS")) {
              ms = ms.padStart(params.padMS, "0");
            }
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
            if (params.hasOwnProperty("callback_tick_count") && params.callback_tick_count) {
              params.callback_tick_count($target);
            }
          }
          // タイマー終了時
          else {
            // ストレージから残り時間を削除
            if (params.useStorage) {
              localStorage.removeItem(params.KEY);
            }
            // タイマー停止
            clearTimeout(timerID);
            // 描画更新
            $target.html(params.message);
            // コールバック実行
            if (params.hasOwnProperty("callback_stop_count") && params.callback_stop_count) {
              params.callback_stop_count($target);
            }
          }
        };
        // カウント開始
        tickCount();
      });
    };

    /**
     * init_loader：
     * ローディング画面を表示します。
     *
     * @param {Object} settings 設定情報
     */
    #init_loader = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      const $loader = $(selector);
      if ($loader[0]) {
        // ローディング開始の待機時間と表示時間はdata属性を優先する
        const delay = $loader.data("delay") ?? params.delay;
        const wait = $loader.data("wait") ?? params.wait;
        // delay(ms)後にローダーをフェードイン
        setTimeout(() => {
          $loader
            .fadeIn()
            .promise()
            .done(() => {
              // ローダー表示後にコールバック実行
              if (params.hasOwnProperty("callback_on_shown") && params.callback_on_shown) {
                params.callback_on_shown();
              }
              // ローダー表示 wait(ms)後にローダーをフェードアウト
              setTimeout(() => {
                $loader
                  .fadeOut()
                  .promise()
                  .done(() => {
                    // ローダー非表示後にコールバック実行
                    if (params.hasOwnProperty("callback_on_hidden") && params.callback_on_hidden) {
                      params.callback_on_hidden();
                    }
                  });
              }, wait);
            });
        }, delay);
      }
    };

    /**
     * init_floating：
     * 追従バナーの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_floating = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      const $btn = $(selector);
      if ($btn[0]) {
        const $window = $(window);
        const $start = $($btn.data("start") ?? params.start);
        const $stop = $($btn.data("stop") ?? params.stop);
        let is_visible = false;
        $window.on("scroll", () => {
          const scrollTop = $window.scrollTop();
          // 表示開始位置・終了位置が指定されていない場合のデフォルトはページ上端・下端とする
          let start = $start?.offset()?.top ?? 0;
          let stop = $stop?.offset()?.top ?? $(document).height();
          if (scrollTop > start && scrollTop < stop && !is_visible) {
            $btn.removeClass(params.hidden_class);
            $btn.fadeIn();
            is_visible = true;
          }
          if ((scrollTop > stop || scrollTop < start) && is_visible) {
            $btn
              .fadeOut()
              .promise()
              .done(() => {
                $btn.addClass(params.hidden_class);
              });
            is_visible = false;
          }
        });
        // ボタンのクリックイベント処理
        $btn.on("click", () => {
          if (params.hasOwnProperty("handler_on_click") && params.handler_on_click) {
            params.handler_on_click();
          }
        });
        // 初期設定完了時にコールバック実行
        if (params.hasOwnProperty("callback") && params.callback) {
          params.callback();
        }
      }
    };

    /**
     * init_slider：
     * スライドショーの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_slider = (settings) => {
      if (!settings.enable) return;

      $.each(settings.set, (_, settings) => {
        const selector = settings.selector;
        const params = settings.params;
        const $target = $(selector);
        if ($target[0]) {
          $target.slick(params);
          if (params.hasOwnProperty("callback") && params.callback) {
            params.callback($target);
          }
        }
      });
    };

    /**
     * init_video：
     * 自動再生が指定されていない動画がビューポートに入ったとき再生します。
     *
     * @param {Object} settings 設定情報
     */
    #init_video = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      const $window = $(window);
      const $target = $(selector).not("[autoplay]");
      if ($target[0]) {
        $window.on("load scroll", () => {
          $target.each((_, e) => {
            const $video = $(e);
            const player = $video[0];
            const win_p = $window.scrollTop();
            const win_h = $window.height();
            // ビューポートに入った
            if (win_p > $video.offset().top - win_h) {
              // 再生スタート
              if (params.autoplay) {
                player.play();
              }
              // コールバック実行
              if (params.hasOwnProperty("callback") && params.callback) {
                params.callback($target);
              }
            }
          });
        });
      }
    };

    /**
     * init_form
     * フォームの入力内容を検証します。
     *
     * @param {Object} settings 設定情報
     */
    #init_form = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      const forms = document.querySelectorAll(selector);
      // Loop over them and prevent submission
      Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener(
          "submit",
          function (event) {
            if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
              if (params.hasOwnProperty("callback") && params.callback) {
                params.callback($(form));
              }
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    };

    /**
     * init_drawer：
     * ドロワーメニューの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_drawer = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      const $target = $(selector);
      if ($target.length) {
        if (typeof $.fn.drawer === "function") {
          $target.drawer();
          $target.find("a").on("click", function () {
            $target.drawer("close");
            if (params.hasOwnProperty("callback") && params.callback) {
              params.callback($target);
            }
          });
        }
      }
    };

    /**
     * init_particle:
     * パーティクルの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_particle = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      const $target = [...$(selector)];
      if ($target.length) {
        $target.forEach((el, _) => {
          const id = $(el).attr("id");
          const json_name = $(el).data("particle-type");
          const json_path = params.json_path + (json_name ?? "default") + ".json";
          if (id) {
            particlesJS.load(id, json_path, params.callback);
          }
        });
      }
    };

    /**
     * init_popup
     * ポップアップの初期設定
     *
     * @param {Object} settings 設定情報
     */
    #init_popup = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      let stopFlg = false;

      // trigger only once
      let isShow = false;
      $("input[type='email']").on("focus", function () {
        stopFlg = true;
      });

      const $target = $(selector);
      if ($target.length === 0) return;

      // modal object, DOM element
      const modal = new bootstrap.Modal(selector);
      const element = document.querySelector(selector);

      // trigger by time
      if (params.hasOwnProperty("wait")) {
        setTimeout(function () {
          if (!stopFlg) modal.show();
        }, params.wait);
      }
      // close Element
      if (params.hasOwnProperty("close_element")) {
        const $closeElement = $(params.close_element);
        $closeElement.on("click", function (e) {
          modal.hide();
        });
      }
      // showOnVisible
      if (params.hasOwnProperty("show_on_visible") && params.show_on_visible) {
        let hidden, visibilityChange;
        let flag = false;
        if (typeof document.hidden !== "undefined") {
          hidden = "hidden";
          visibilityChange = "visibilitychange";
        } else if (typeof document.mozHidden !== "undefined") {
          hidden = "mozHidden";
          visibilityChange = "mozvisibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
          hidden = "msHidden";
          visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
          hidden = "webkitHidden";
          visibilityChange = "webkitvisibilitychange";
        }
        document.addEventListener(
          visibilityChange,
          function () {
            if (document.hidden) {
              flag = true;
            } else if (flag) {
              flag = false;
              //ここでポップアップを呼ぶ
              if (!stopFlg) modal.show();
            }
          },
          false
        );
      }
      // showOnEscape
      if (params.hasOwnProperty("show_on_escape") && params.show_on_escape) {
        $("body").on("mouseleave", function () {
          if (!stopFlg) modal.show();
        });
      }
      // transfer
      if (params.hasOwnProperty("transfer")) {
        // 待機時間とURLが指定されていれば遷移
        const transfer = params.transfer;
        if (transfer.hasOwnProperty("wait") && transfer.hasOwnProperty("url") && transfer.url !== "") {
          setTimeout(function () {
            location.href = transfer.url;
          }, transfer.wait);
        }
      }

      // ポップアップ起動
      const popup = () => {
        // 起動
        if (!isShow) {
          modal.show();
          isShow = true;
        }
      };
      // フォーム入力を開始すると二度と起動しない
      $("input[type='email']").on("focus", function () {
        isShow = true;
      });
      // showOnScroll
      if (params.hasOwnProperty("show_on_scroll") && params.show_on_scroll) {
        // 閉じるたびに定期タイマーを初期化
        element.addEventListener("hidden.bs.modal", (event) => {
          isShow = false;
          // showOnTimeout
          if (params.hasOwnProperty("timeout")) {
            const tid = setTimeout(function () {
              // 二重起動防止
              if (!isShow) {
                popup();
              }
              clearTimeout(tid);
            }, params.timeout);
          }
        });
        // スクロール位置
        let currentPos = 0;
        // 閾値
        const threshold = params.hasOwnProperty("threshold") ? params.threshold : 300;
        // 上部起動フラグ
        let onceTop = false;
        // 下部起動フラグ
        let onceBottom = false;
        // ページ全体の高さ
        const scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
        // 一番下までスクロールした時の数値
        const pageMostBottom = scrollHeight - window.innerHeight - threshold;

        $(window).on("scroll", function () {
          // 現在のスクロール位置
          const scrollTop = $(this).scrollTop();
          // スクロール位置：上部の閾値よりも上
          if (scrollTop <= threshold) {
            // 上移動中
            if (scrollTop < currentPos) {
              // 上部起動フラグOFF
              if (params.hasOwnProperty("onceTop") && params.onceTop) {
              } else {
                onceTop = false;
              }
            }
          }
          // スクロール位置：上下閾値の中間
          else if (threshold < scrollTop && scrollTop < pageMostBottom) {
            // 上移動中
            if (scrollTop < currentPos) {
              // 下部起動フラグOFF
              onceBottom = false;
            }
            // 下移動中
            else {
              // 上部未起動なら起動
              if (!onceTop) {
                popup();
                onceTop = !onceTop;
              }
            }
          }
          // スクロール位置：下部の閾値よりも下
          else {
            // 下移動中
            if (currentPos < scrollTop) {
              // 下部未起動なら起動
              if (!onceBottom) {
                popup();
                onceBottom = !onceBottom;
              }
            }
          }
          // 現在位置更新
          currentPos = scrollTop;
        });
      }
    };

    /**
     * init_youtube
     * YouTube動画の初期設定
     *
     * @param {Object} settings 設定情報
     */
    #init_youtube = (settings) => {
      if (!settings.enable) return;
      const selector = settings.selector;
      const params = settings.params;

      // ターゲット要素のループ
      $(selector).each((_, e) => {
        const $target = $(e);
        const video_id = $target.data("video-id");
        $target.find("img").on("click", () => {
          const video_src = `https://www.youtube.com/embed/${video_id}?si=&autoplay=1&rel=0`;
          const iframe = $("<iframe>", {
            src: video_src,
            frameborder: 0,
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            allowfullscreen: true,
          });
          $target.html(iframe);
        });
      });
    };

    /**
     * init_date
     * 日付の初期設定
     *
     * @param {Object} settings 設定情報
     */
    #init_date = (settings) => {
      if (!settings.enable) return;

      $.each(settings.set, (_, settings) => {
        const selector = settings.selector;
        const params = settings.params;
        const $target = $(selector);

        // 要素の存在チェック
        if (!$target[0]) {
          return;
        }

        // 日付作成
        let dt = new Date();

        // 基準日が指定されている場合
        if (params.hasOwnProperty("date") && params.date !== "") {
          dt = new Date(params.date);
        }

        // 基準日からの差分が指定されている場合
        if (params.hasOwnProperty("diff") && !isNaN(params.diff)) {
          dt.setDate(dt.getDate() + params.diff);
        }

        // 書式整形
        let yy = String(dt.getFullYear());
        let mm = String(dt.getMonth() + 1);
        let dd = String(dt.getDate());
        if (params.hasOwnProperty("padMM")) {
          mm = mm.padStart(params.padMM, "0");
        }
        if (params.hasOwnProperty("padDD")) {
          dd = dd.padStart(params.padDD, "0");
        }
        let dateString = params.format;
        dateString = dateString.replace(/yy/g, yy);
        dateString = dateString.replace(/mm/g, mm);
        dateString = dateString.replace(/dd/g, dd);

        // 描画更新
        $target.html(dateString);
      });
    };
  }

  // 初期化
  new Util();
});
