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
2024/07/09 MOD init_youtube
2024/08/06 MOD init_popup
2024/08/07 MOD init_youtube
2024/10/19 ADD countdown2
2024/10/25 MOD constructor
2024/11/07 MOD init_countdown
2025/03/18 ADD loadAuthScript()
2025/04/02 ADD default settings
2025/04/07 MOD refactoring all method

Copyright 2024 office-ing All rights reserved.
 
This source code or any portion thereof must not be  
reproduced or used in any manner whatsoever.
======================================================================
*/

$(function () {
  /**
   * デフォルト設定を尊重しつつ、案件側設定を再帰的にマージする
   * 特定プロパティ名（set）は配列であってもプロパティごとにマージ
   * @param {Object|Array} target - デフォルト設定
   * @param {Object|Array} source - 案件側設定
   * @returns {Object|Array} - マージ後のオブジェクト
   */
  function deepMerge(target, source) {
    if (typeof target !== "object" || target === null) return target;
    if (typeof source !== "object" || source === null) return target;

    const specialKeysForElementwiseMerge = ["set"];

    // 特定のキーでは要素単位マージ（setのみ）
    const mergeArraysElementwise = (key, tArr, sArr) => {
      return sArr.map((srcItem, index) => {
        const tgtItem = tArr[index];
        if (typeof srcItem === "object" && srcItem !== null && typeof tgtItem === "object") {
          return deepMerge(tgtItem, srcItem);
        }
        return srcItem;
      });
    };

    // 通常の配列は上書き
    if (Array.isArray(target) && Array.isArray(source)) {
      return source;
    }

    // オブジェクトのマージ
    const merged = { ...target };

    for (const key in source) {
      if (!source.hasOwnProperty(key)) continue;

      const sourceVal = source[key];
      const targetVal = target[key];

      if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
        if (specialKeysForElementwiseMerge.includes(key)) {
          merged[key] = mergeArraysElementwise(key, targetVal, sourceVal);
        } else {
          merged[key] = sourceVal;
        }
      } else if (typeof sourceVal === "object" && sourceVal !== null && typeof targetVal === "object") {
        merged[key] = deepMerge(targetVal, sourceVal);
      } else {
        merged[key] = sourceVal;
      }
    }

    return merged;
  }

  /**
   * デフォルト設定
   */
  const defaultConfig = {
    auth: {
      enable: true,
    },

    autofit: {
      enable: true,
      selector: "[autofit]",
      params: {
        breakPoint: 992,
        effectiveWidth: 1100,
        callback: null,
      },
    },

    animation: {
      enable: true,
      params: {
        offset: 30,
        callback: null,
      },
    },

    collapse: {
      enable: true,
      selector: "#contents",
      params: {
        speed: 500,
        once: false,
        callback: null,
      },
    },

    accordion: {
      enable: true,
      selector: "[data-type=accordion]",
      params: {
        openClass: "active",
        speed: 300, // 300msで開閉
        callback: (el) => {
          console.log(`${el.text()} が開閉されました`);
        },
      },
    },

    smoothscroll: {
      enable: true,
      selector: "a[href^='#']",
      params: {
        exclude: ".no-link",
        speed: 500,
        header: "[data-scroll-header]",
        offset: 0,
        easing: "linear",
        callback: null,
      },
    },

    protection: {
      enable: false,
      params: {
        features: ["contextmenu", "image", "touch"],
        callback: () => {
          console.log("Protection applied");
        },
      },
    },

    pagetop: {
      enable: true,
      selector: "[data-type=pagetop]",
      params: {
        offset: 300,
        showClass: "show",
        callback: null,
      },
    },

    countup: {
      enable: true,
      selector: "[data-type=countup]",
      params: {
        KEY: location.hostname + location.pathname + "countup",
        from: 0,
        to: 100,
        step: 1,
        randomStep: (count) => 1,
        message: "終了準備中",
        interval: 1 * 1000,
        format: "{n}",
        useStorage: true,
        onTick: null,
        onStop: null,
      },
    },

    countdown: {
      enable: true,
      selector: "[data-type=countdown]",
      params: {
        KEY: location.hostname + location.pathname + " countdown",
        limit: 1 * 24 * 60 * 60 * 1000,
        message: "終了準備中",
        interval: 1000,
        format: "<span>hh</span>:<span>mm</span> <span>ss</span>",
        useStorage: true,
        onTick: null,
        onStop: null,
      },
    },

    countdown2: {
      enable: true,
      selector: "[data-type=countdown2]",
      params: {
        KEY: location.hostname + location.pathname + " countdown2",
        from: 72, // カウントの初期値
        to: 0, // カウントの終了値
        step: -1, // カウントの増減ステップ
        format: "残り{n}名", // 表示フォーマット。{n}にカウントが入る
        message: "終了準備中", // カウント終了後のメッセージ
        useStorage: true, // カウントをlocalstorageに保存するかどうか
        timeout: (n) => 1000, // 次のtimeoutを呼び出すまでの待機時間（ミリ秒）
        onTick: null,
        onStop: null,
      },
    },

    loader: {
      enable: true,
      selector: "[data-type=loader]",
      params: {
        delay: 10 * 1000, // ローダー表示までの待機時間（ミリ秒）
        wait: 15 * 1000, // ローダー表示から消去までの待機時間（ミリ秒）
        onShow: null, // ローダー表示完了後のコールバック
        onHide: null, // ローダー消去完了後のコールバック
      },
    },

    floating: {
      enable: true,
      selector: "[data-type=floating]",
      params: {
        offsetBottom: 50, // ページ最下部のオフセット（px）
        hiddenClass: "stop",
        onClick: null,
        callback: null,
      },
    },

    slider: {
      enable: true,
      set: [
        {
          selector: "[data-type=slider1]",
          reinitOnResize: true,
          params: {
            fade: false,
            autoplay: true,
            autoplaySpeed: 0,
            speed: 5000,
            arrows: false,
            nextArrow: '<button type="button" class="slick-next"><i class="fa-solid fa-chevron-right"></i></button>',
            prevArrow: '<button type="button" class="slick-prev"><i class="fa-solid fa-chevron-left"></i></button>',
            dots: false,
            slidesToShow: 3,
            adaptiveHeight: true,
            cssEase: "linear",
            waitForAnimate: false,
            infinite: true,
            mobileFirst: true,
            draggable: false,
            pauseOnFocus: false,
            pauseOnHover: false,
            pauseOnDotsHover: false,
            swipe: false,
            touchMove: false,
            responsive: [],
          },
          callback: null,
        },
        {
          selector: "[data-type=slider2]",
          reinitOnResize: true,
          params: {
            fade: false,
            autoplay: true,
            autoplaySpeed: 0,
            speed: 10000,
            arrows: false,
            nextArrow: '<button type="button" class="slick-next"><i class="fa-solid fa-chevron-right"></i></button>',
            prevArrow: '<button type="button" class="slick-prev"><i class="fa-solid fa-chevron-left"></i></button>',
            dots: false,
            slidesToShow: 1,
            adaptiveHeight: true,
            cssEase: "linear",
            waitForAnimate: false,
            infinite: true,
            mobileFirst: true,
            draggable: false,
            pauseOnFocus: false,
            pauseOnHover: false,
            pauseOnDotsHover: false,
            swipe: false,
            touchMove: false,
            responsive: [],
          },
          callback: null,
        },
      ],
    },

    video: {
      enable: true,
      selector: "video",
      params: {
        autoplay: false,
        callback: null,
      },
    },

    form: {
      enable: true,
      selector: ".needs-validation",
      params: {
        callback: null,
      },
    },

    drawer: {
      enable: true,
      selector: ".drawer",
      params: {
        callback: null,
      },
    },

    particle: {
      enable: true,
      selector: "[data-type=particle]",
      params: {
        jsonPath: "./assets/lib/particles/", // 設定ファイルのパス
        particleType: "default", // 設定ファイル名 "nasa","snow","bubble", etc...
        callback: null,
      },
    },

    popup: {
      enable: true,
      selector: "[data-type=popup]",
      params: {
        wait: 30 * 1000,
        closeElement: ".layer--popup .btn",
        offset: 300,
        enableTop: false,
        enableBottom: true,
        transfer: {
          wait: 3 * 1000,
          url: "",
        },
        repop: $("[data-type=popup]").data("timeout") * 1000,
        callback: null,
      },
    },

    youtube: {
      enable: true,
      selector: "[data-video-id]",
      params: {
        useAPI: false,
        lazyload: false,
        autoplay: false,
        buttonAnimation: "ring",
        onPlayerStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            $(event.target.g).find(".fa-youtube").remove();
          }
        },
      },
    },

    date: {
      enable: true,
      set: [
        {
          selector: "[data-type=today]",
          params: {
            format: "<span>mm</span>月<span>dd</span>日",
            baseDate: "",
            diff: 0,
          },
        },
      ],
    },
  };

  // ユーザーの `config.js` をデフォルト設定にマージ
  window.config = deepMerge(defaultConfig, window.config || {});

  /**
   * LPユーティリティクラス
   */
  class Util {
    /**
     * コンストラクタ
     */
    constructor() {
      if (config.auth.enable) this.#init_auth(config.auth);
      if (config.autofit.enable) this.#init_autofit(config.autofit);
      if (config.animation.enable) this.#init_animation(config.animation);
      if (config.collapse.enable) this.#init_collapse(config.collapse);
      if (config.accordion.enable) this.#init_accordion(config.accordion);
      if (config.smoothscroll.enable) this.#init_smoothscroll(config.smoothscroll);
      if (config.protection.enable) this.#init_protection(config.protection);
      if (config.pagetop.enable) this.#init_pagetop(config.pagetop);
      if (config.countup.enable) this.#init_countup(config.countup);
      if (config.countdown.enable) this.#init_countdown(config.countdown);
      if (config.countdown2.enable) this.#init_countdown2(config.countdown2);
      if (config.loader.enable) this.#init_loader(config.loader);
      if (config.floating.enable) this.#init_floating(config.floating);
      if (config.slider.enable) this.#init_slider(config.slider);
      if (config.video.enable) this.#init_video(config.video);
      if (config.form.enable) this.#init_form(config.form);
      if (config.drawer.enable) this.#init_drawer(config.drawer);
      if (config.particle.enable) this.#init_particle(config.particle);
      if (config.popup.enable) this.#init_popup(config.popup);
      if (config.youtube.enable) this.#init_youtube(config.youtube);
      if (config.date.enable) this.#init_date(config.date);
    }

    /**
     * 指定フォーマットの時間表現文字列を返す
     * @param {Number} date - 時間の内部形式（ミリ秒）
     * @param {String} format - フォーマット文字列
     * @returns {String} - フォーマットした文字列
     */
    formatDateTime = (date, format) => {
      const isMS = typeof date === "number";
      const d = isMS ? new Date(date) : date;

      const parts = {
        yyyy: d.getFullYear(),
        mo: d.getMonth() + 1,
        dd: d.getDate(),
        hh: d.getHours(),
        mi: d.getMinutes(),
        ss: d.getSeconds(),
        ms: Math.floor(d.getMilliseconds() / 10), // 2桁
        mms: d.getMilliseconds(), // 3桁
      };

      const padded = {
        YYYY: String(parts.yyyy).padStart(4, "0"),
        MO: String(parts.mo).padStart(2, "0"),
        DD: String(parts.dd).padStart(2, "0"),
        HH: String(parts.hh).padStart(2, "0"),
        MI: String(parts.mi).padStart(2, "0"),
        SS: String(parts.ss).padStart(2, "0"),
        MS: String(parts.ms).padStart(2, "0"),
        MMS: String(parts.mms).padStart(3, "0"),
      };

      return (
        format
          // 大文字ゼロ埋め
          .replace(/YYYY/g, padded.YYYY)
          .replace(/MO/g, padded.MO)
          .replace(/DD/g, padded.DD)
          .replace(/HH/g, padded.HH)
          .replace(/MI/g, padded.MI)
          .replace(/SS/g, padded.SS)
          .replace(/MS/g, padded.MS)
          .replace(/MMS/g, padded.MMS)
          // 小文字（ゼロ埋めなし）
          .replace(/yyyy/g, parts.yyyy)
          .replace(/mo/g, parts.mo)
          .replace(/dd/g, parts.dd)
          .replace(/hh/g, parts.hh)
          .replace(/mi/g, parts.mi)
          .replace(/ss/g, parts.ss)
          .replace(/ms/g, parts.ms)
          .replace(/mms/g, parts.mms)
      );
    };

    /**
     * init_auth:
     * ライブラリを参照したURLに対する認証を行います。
     *
     * @param {Object} settings 設定情報
     */
    #init_auth = (settings) => {
      const script = document.createElement("script");
      script.src = "https://office-ing.github.io/js/auth.min.js";
      document.head.appendChild(script);
    };

    /**
     * init_autofit：
     * 画像サイズを自動計算して最大可視範囲内でセンタリングします。
     *
     * @param {Object} settings 設定情報
     */
    #init_autofit = (settings) => {
      const { selector, params } = settings;
      const { breakPoint, effectiveWidth, callback } = params;

      const $target = $(selector);
      const $window = $(window);
      const attrName = selector.replaceAll(/[\[|\]]/g, "");

      const autofit = () => {
        const winW = $window.width();

        $target.each((_, el) => {
          const $el = $(el);
          const customEW = parseInt($el.attr(attrName));
          const ew = isNaN(customEW) ? effectiveWidth : customEW;

          const nW = el.naturalWidth;
          const nH = el.naturalHeight;

          if (winW < breakPoint) {
            if (nW < winW) {
              $el.css({
                objectFit: "unset",
                width: "auto",
                height: "auto",
              });
            } else {
              const heightCalc = `calc(100vw * (${nH} / ${ew}))`;
              $el.css({
                objectFit: "cover",
                width: nW < ew ? "auto" : "100%",
                height: heightCalc,
              });
            }
          } else {
            $el.css({
              objectFit: "unset",
              width: "auto",
              height: "auto",
            });
          }

          // コールバックが関数であれば実行
          if (typeof callback === "function") callback($el);
        });

        $("body").css("visibility", "visible");
      };

      $window.on("load resize scroll", autofit);
      autofit();
    };

    /**
     * init_animation：
     * アニメーションの設定を行います。
     *
     * @param {Object} settings 設定情報
     */
    #init_animation = (settings) => {
      const { params } = settings;

      if (typeof AOS === "object") {
        // AOSライブラリ初期化
        AOS.init(params);
      }
      if (typeof WOW === "function") {
        // WOWライブラリ初期化
        new WOW().init(params);
      }
      // コールバック実行
      params.callback?.();
    };

    /**
     * init_collapse：
     * コンテンツの表示・非表示を制御します。
     *
     * @param {Object} settings 設定情報
     */
    #init_collapse = async (settings) => {
      const { selector, params } = settings;
      const { speed = 400, once, callback } = params;
      const $contents = $(selector);

      if (!$contents.length) return;

      $contents.on("shown.bs.collapse", async (e) => {
        const targetOffset = $(e.target).offset()?.top ?? 0;

        await $("html, body").animate({ scrollTop: targetOffset }, speed, "linear").promise();

        callback?.($contents);

        // AOS再初期化（対象が表示された直後に）
        this.#init_animation(config.animation);

        // 一度きりならトグラーを無効化（閉じられないように）
        if (once) {
          const $toggler = $(`[data-bs-toggle="collapse"][data-bs-target="#${$contents.attr("id")}"]`);
          $toggler.removeAttr("data-bs-toggle");
        }
      });
    };

    /**
     * init_accordion：
     * アコーディオンの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_accordion = (settings) => {
      const { selector, params } = settings;
      const { openClass = "active", speed = 400, callback } = params;
      const $triggers = $(selector);

      if (!$triggers.length) return;

      $triggers.on("click", function () {
        const $trigger = $(this);
        const $content = $trigger.next();

        $content.slideToggle(speed);
        $trigger.parent().toggleClass(openClass);

        callback?.($trigger);
      });
    };

    /**
     * init_smoothscroll：
     * ページ内リンクのスムーススクロールを行います。
     *
     * @param {Object} settings 設定情報
     */
    #init_smoothscroll = (settings) => {
      const { selector, params } = settings;
      const { exclude, speed, header, offset, easing, callback } = params;

      /**
       * href属性からスクロール対象の要素を取得
       * - "#" または空文字なら <html> をターゲットに
       * - それ以外は hrefからidを抽出し、それに該当する要素を取得
       */
      const getScrollTarget = (href) => {
        const id = href === "#" || href === "" ? "html" : href.slice(href.indexOf("#"));
        return $(id);
      };

      /**
       * スクロール先の位置を算出
       * - ヘッダー分の高さと任意のオフセットを引いた位置へスクロール
       */
      const calcScrollPosition = ($target) => {
        let position = $target.offset().top - offset;
        const $header = $(header);
        if ($header.length) {
          position -= $header.height();
        }
        return position;
      };

      /**
       * 指定した要素までスムーススクロールし、完了後にコールバックを実行
       * - triggerが渡されていれば、そちらを callback に渡す
       */
      const scrollTo = async ($target, $trigger = null) => {
        const position = calcScrollPosition($target);
        await $("html, body").animate({ scrollTop: position }, speed, easing).promise();
        callback?.($trigger || $target);
      };

      // a[href^="#"] で exclude条件を満たさないリンクを取得
      const $links = $(selector).not(exclude);

      /**
       * 対象リンクのクリック時にスクロールを発動
       * - hrefから対象要素を取得し、該当すればスムーススクロール
       * - デフォルトのリンクジャンプ動作は抑制
       */
      $links.on("click", function (e) {
        const href = $(this).attr("href");
        const $target = getScrollTarget(href);

        if (!$target.length) return;

        e.preventDefault();
        scrollTo($target, $(this));
      });

      /**
       * ページ読み込み時に、URLに#が含まれていれば該当要素へスクロール
       * - ページ内リンクとして直接遷移したときに備える
       */
      $(window).on("load", () => {
        const hash = window.location.hash;
        if (!hash) return;

        const $target = $(`[id='${hash.slice(1)}']`);
        if ($target.length) {
          scrollTo($target);
        }
      });
    };

    /**
     * init_protection：
     * コンテキストメニュー、画像のダウンロード、テキスト選択、長押しを抑止します。
     *
     * @param {Object} settings 設定情報
     */
    #init_protection = (settings) => {
      const { features, callback } = settings.params;

      /**
       * 右クリック・テキスト選択・タッチ操作の防止
       * - contextmenu: 右クリック
       * - selectstart: テキスト選択開始
       * - ontouchstart / ontouchend: タッチ操作系の不正利用防止
       */
      if (features.includes("contextmenu")) {
        $(document).on("contextmenu selectstart ontouchstart ontouchend", () => false);
      }

      /**
       * img要素に対するマウス・コンテキスト操作の無効化
       * - 右クリック・ドラッグなどによる画像保存を防止
       */
      if (features.includes("image")) {
        $("img").attr({
          onmousedown: "return false",
          onselectstart: "return false",
          oncontextmenu: "return false",
        });
      }

      /**
       * タッチデバイスでの長押しコピーや選択防止
       * - iOS Safari等での「画像保存」「コピー」メニューを抑制
       */
      if (features.includes("touch")) {
        $("body").css({
          "-webkit-touch-callout": "none", // 長押しでのメニュー非表示
          "-webkit-user-select": "none", // テキスト選択不可
        });
      }

      /**
       * 保護処理の完了後に、任意の処理を実行（ログ出力や通知など）
       */
      callback?.();
    };

    /**
     * init_pagetop：
     * ページ先頭に戻るボタンの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_pagetop = (settings) => {
      const { selector, params } = settings;
      const { offset, showClass, callback } = params;

      const $pagetop = $(selector);
      const $window = $(window);

      // 対象要素が存在しない場合は何もしない
      if (!$pagetop.length) return;

      /**
       * スクロール・リサイズ・ページロード時に
       * ページトップボタンの表示/非表示を制御するイベントを登録
       */
      $window.on("load resize scroll", () => {
        const shouldShow = $window.scrollTop() > offset;
        $pagetop.toggleClass(showClass, shouldShow);
      });

      /**
       * 初期化完了後に任意の処理を実行（例: ログ出力、フェードインなど）
       */
      callback?.();
    };

    /**
     * init_countup
     * カウントアップタイマーの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_countup = (settings) => {
      const { selector, params } = settings;
      const { KEY, from, to, step, randomStep, message, interval, format, useStorage, onTick, onStop } = params;

      const $targets = $(selector);
      if (!$targets.length) return; // 対象要素が存在しない場合は即終了

      $targets.each((_, el) => {
        const $target = $(el);
        let count = from;

        // ストレージにカウント値が保存されていれば復元
        if (useStorage) {
          const saved = localStorage.getItem(KEY);
          count = saved ? parseInt(saved) : from;
          if (!saved) localStorage.setItem(KEY, count);
        }

        /**
         * カウントをフォーマット文字列に変換して返す
         * 例: format = "残り {n} 件" → "残り 42 件"
         */
        const formatCount = (val) => format.replace(/{n}/g, val);

        /**
         * カウントが継続可能かを判定
         * step が正のときは上限未満、負のときは下限超過まで継続
         */
        const isCounting = () => (step > 0 ? count < to : count > to);

        /**
         * 一定間隔でカウントを更新・描画し、停止条件を満たせば終了処理
         */
        const tick = () => {
          const next = count + (typeof randomStep === "function" ? randomStep(count) : step);
          count = next;

          if (useStorage) localStorage.setItem(KEY, count);

          $target.html(formatCount(count));

          // カウント終了時の処理
          if (!isCounting()) {
            if (useStorage) localStorage.removeItem(KEY);
            $target.html(message).addClass("over");
            clearInterval(timerID);
            // カウント停止時のコールバックを実行
            onStop?.($target);
          }

          // カウント進行中のコールバックを実行
          onTick?.($target);
        };

        // タイマーを起動し、一定間隔で tick 実行
        const timerID = setInterval(tick, interval);
      });
    };

    /**
     * init_countdown：
     * カウントダウンタイマーの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_countdown = (settings) => {
      const { selector, params } = settings;
      const { KEY, limit, interval, format, message, onTick, onStop, useStorage } = params;

      const $targets = $(selector);
      if (!$targets.length) return; // 対象要素が存在しない場合は即終了

      $targets.each((_, e) => {
        const $target = $(e);
        let startTime = new Date().getTime();

        // 初回読み込み時にlocalStorageから開始時刻を取得（useStorage=true時のみ）
        if (useStorage) {
          if (localStorage.getItem(KEY)) {
            startTime = parseInt(localStorage.getItem(KEY));
          } else {
            localStorage.setItem(KEY, startTime);
          }
        }

        // カウントダウン中かどうかを判定
        const isCounting = () => {
          const passed = Date.now() - startTime;
          return limit - passed > 0;
        };

        // 時間単位ごとのフォーマット処理（ゼロ埋めあり／なしを制御）
        const formatTime = (value, key) => {
          if (key === "mms" || key === "MMS") {
            return String(value).padStart(3, "0");
          }
          if (key === "ms" || key === "MS") {
            return String(Math.floor(value / 10)).padStart(2, "0");
          }
          return format.includes(key.toUpperCase()) ? String(value) : String(value).padStart(2, "0");
        };

        // 残り時間を受け取り、フォーマット文字列に変換
        const buildCountdownString = (remaining) => {
          const useDays = /dd|DD/.test(format);
          let days = Math.floor(remaining / (1000 * 60 * 60 * 24));
          let hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
          if (!useDays) {
            hours = Math.floor(remaining / (1000 * 60 * 60));
          }
          let minutes = Math.floor((remaining / (1000 * 60)) % 60);
          let seconds = Math.floor((remaining / 1000) % 60);
          let milliseconds = remaining % 1000;

          return format.replace(/mms/g, formatTime(milliseconds, "mms")).replace(/MMS/g, formatTime(milliseconds, "MMS")).replace(/ms/g, formatTime(milliseconds, "ms")).replace(/MS/g, formatTime(milliseconds, "MS")).replace(/dd/g, formatTime(days, "dd")).replace(/DD/g, formatTime(days, "DD")).replace(/hh/g, formatTime(hours, "hh")).replace(/HH/g, formatTime(hours, "HH")).replace(/mm/g, formatTime(minutes, "mm")).replace(/MM/g, formatTime(minutes, "MM")).replace(/ss/g, formatTime(seconds, "ss")).replace(/SS/g, formatTime(seconds, "SS"));
        };

        // カウントダウンの進行処理（一定間隔で再帰実行される）
        const tick = () => {
          let timerID = 0;
          const passed = Date.now() - startTime;
          const remaining = limit - passed;

          // カウント終了時の処理
          if (!isCounting()) {
            if (useStorage) {
              localStorage.removeItem(KEY);
            }
            clearTimeout(timerID);
            $target.html(message);

            // カウント停止時のコールバックを実行
            onStop?.($target);
            return;
          }

          // カウント途中の表示更新
          $target.html(buildCountdownString(remaining));

          // 次回更新の予約
          timerID = setTimeout(tick, interval);

          // カウント進行中のコールバックを実行
          onTick?.($target);
        };

        // DOM生成後、各要素ごとにカウントダウン処理を開始
        tick();
      });
    };

    /**
     * init_countdown2：
     * カウントダウンタイマーの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_countdown2 = (settings) => {
      const { selector, params } = settings;
      const { KEY, from, to, step, format, message, useStorage, timeout, onTick, onStop } = params;

      const $targets = $(selector);
      if ($targets.length === 0) return; // 対象要素が存在しない場合は即終了

      $targets.each((_, el) => {
        const $target = $(el);
        let count = from;

        // 初回読み込み時、localStorageから現在のカウントを取得または保存
        if (useStorage) {
          const saved = localStorage.getItem(KEY);
          if (saved !== null) {
            count = parseInt(saved);
          } else {
            localStorage.setItem(KEY, count);
          }
        }

        // カウントの継続条件を判定
        const isCounting = () => {
          return step > 0 ? count < to : count > to;
        };

        // フォーマット文字列の置換（{n} → 現在のカウント）
        const formatTime = (value) => {
          return format.replace(/{n}/g, value);
        };

        // カウントを更新してDOMに反映、終了条件に達したら停止
        const tick = () => {
          let timerID;

          // カウント更新
          count += step;
          if (useStorage) {
            localStorage.setItem(KEY, count);
          }

          // 表示更新
          $target.html(formatTime(count));

          // カウント終了時の処理
          if (!isCounting()) {
            if (useStorage) {
              localStorage.removeItem(KEY);
            }
            clearTimeout(timerID);
            $target.html(message).addClass("over");

            // カウント停止時のコールバックを実行
            onStop?.($target);
            return;
          }

          // 次のtickを予約
          clearTimeout(timerID);
          timerID = setTimeout(tick, timeout(count));

          // カウント進行中のコールバックを実行
          onTick?.($target);
        };

        // 初回tickを実行
        tick();
      });
    };

    /**
     * init_loader：
     * ローディング画面を表示します。
     *
     * @param {Object} settings 設定情報
     */
    #init_loader = async (settings) => {
      const { selector, params } = settings;
      const $loader = $(selector);

      // ローダー要素が存在しない場合は何もしない
      if (!$loader.length) return;

      const { delay, wait, onShow, onHide } = params;

      // 指定されたdelay後にローダーを表示
      await waitFor(delay);
      await fadeIn($loader);

      // ローダー表示後にコールバック実行
      if (onShow) onShow();

      // 指定されたwait後にローダーを非表示にする
      await waitFor(wait);
      await fadeOut($loader);

      // ローダー非表示後にコールバック実行
      if (onHide) onHide();

      // 指定時間待機する関数
      async function waitFor(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      }

      // 要素をフェードインする関数
      async function fadeIn($element) {
        return new Promise((resolve) => {
          $element.fadeIn(() => resolve());
        });
      }

      // 要素をフェードアウトする関数
      async function fadeOut($element) {
        return new Promise((resolve) => {
          $element.fadeOut(() => resolve());
        });
      }
    };

    /**
     * init_floating：
     * 追従バナーの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_floating = async (settings) => {
      const { selector, params } = settings;
      const { offsetBottom, hiddenClass, onClick, callback, start, stop } = params;

      const $target = $(selector);
      if (!$target.length) return;

      const $window = $(window);

      // data属性の指定が優先、なければparamsのstart/stopを使う
      const startSelector = $target.data("start") || start;
      const stopSelector = $target.data("stop") || stop;

      const $start = $(startSelector);
      const $stop = $(stopSelector);

      // 開始位置のY座標（要素がなければ0）
      const getStartTop = () => ($start.length ? $start.offset().top : 0);

      // 終了位置のY座標（要素がなければドキュメント末尾 - オフセット）
      const getStopTop = () => {
        if ($stop.length) return $stop.offset().top;
        return $(document).height() - $(window).height() - offsetBottom;
      };

      // 表示条件：スクロール位置が開始〜終了の間か
      const shouldShow = (scrollTop) => scrollTop > getStartTop() && scrollTop < getStopTop();

      // スクロールイベント：表示・非表示の切り替えを制御
      $window.on("scroll", async () => {
        const scrollTop = $window.scrollTop();
        const currentlyVisible = $target.is(":visible");

        if (shouldShow(scrollTop) && !currentlyVisible) {
          $target.removeClass(hiddenClass).fadeIn();
        } else if (!shouldShow(scrollTop) && currentlyVisible) {
          await $target.fadeOut().promise();
          $target.addClass(hiddenClass);
        }
      });

      // クリックイベント：onClickがあれば実行
      $target.on("click", () => {
        onClick?.();
      });

      // 初期化完了時にcallbackがあれば実行
      callback?.();
    };

    /**
     * init_slider：
     * スライドショーの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_slider = (settings) => {
      // 指定されたブレークポイントにマッチする設定を取得する関数
      const getMatchedSettings = (params) => {
        const { responsive = [], mobileFirst } = params;

        // 現在のウィンドウ幅がブレークポイント条件にマッチしているか判定
        const matchBreakpoint = (bp) => {
          return mobileFirst ? window.innerWidth < bp.breakpoint : window.innerWidth >= bp.breakpoint;
        };

        // ブレークポイントを昇順または降順にソート
        const sorted = responsive.slice().sort((a, b) => (mobileFirst ? a.breakpoint - b.breakpoint : b.breakpoint - a.breakpoint));

        // 最初にマッチした設定を返す
        return sorted.find((bp) => matchBreakpoint(bp));
      };

      // 実際にslickへ渡す初期化パラメータを構築する関数
      const buildInitParams = (params, matched) => {
        const initParams = $.extend(true, {}, params);

        if (matched && typeof matched.settings === "object") {
          $.extend(true, initParams, matched.settings);
        }

        delete initParams.responsive; // slickが解釈しないよう削除

        return initParams;
      };

      $.each(settings.set, (_, setting) => {
        const { selector, reinitOnResize, params, callback } = setting;

        const $target = $(selector);
        if (!$target.length) return; // 対象要素が存在しなければ終了

        // スライダーを初期化する関数
        const init = () => {
          const matched = getMatchedSettings(params);

          // マッチした設定が "unslick" の場合は初期化をスキップ
          if (matched && matched.settings === "unslick") return;

          const initParams = buildInitParams(params, matched);

          // slick未初期化のときのみ初期化を実行
          if (!$target.hasClass("slick-initialized")) {
            $target.slick(initParams);
          }
        };

        init(); // 初回初期化

        // 初期化後にcallbackが指定されていれば実行
        callback?.($target);

        // ウィンドウのリサイズ・画面回転で再初期化する場合
        if (reinitOnResize) {
          const { responsive = [] } = params;
          const hasUnslick = responsive.some((bp) => bp.settings === "unslick");

          // responsive配列に何らかの設定がある or "unslick" が含まれている場合のみ監視
          if (hasUnslick || responsive.length > 0) {
            let resizeTimer;

            $(window).on("resize orientationchange", () => {
              clearTimeout(resizeTimer);

              resizeTimer = setTimeout(() => {
                const matched = getMatchedSettings(params);
                const shouldUnslick = matched && matched.settings === "unslick";
                const isInitialized = $target.hasClass("slick-initialized");

                // 条件1: unslick指定かつ初期化済み → slickを解除
                if (shouldUnslick && isInitialized) {
                  $target.slick("unslick");
                  return;
                }

                const initParams = buildInitParams(params, matched);

                // 条件2: 初期化済み → unslickしてから再初期化
                if (isInitialized) {
                  $target.slick("unslick");

                  // 環境によって slick 再初期化が走らないことがあるため、setTimeoutで確実に再初期化
                  setTimeout(() => {
                    $target.slick(initParams);
                  }, 100);
                }

                // 条件3: 初期化されていない → 通常の初期化
                else {
                  $target.slick(initParams);
                }
              }, 150); // リサイズ終了を少し待ってから再初期化
            });
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
      const { selector, params } = settings;
      const { autoplay, callback } = params;

      const $target = $(selector).not("[autoplay]"); // autoplay属性のないvideo要素を対象

      if (!$target.length) return; // 対象が存在しない場合は何もせず終了

      // IntersectionObserverによる再生監視
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            const target = entry.target;

            // ビューポート内に入ったら
            if (entry.isIntersecting) {
              if (autoplay) {
                target.play(); // 動画を再生
              }

              callback?.($(target)); // コールバックを実行

              obs.unobserve(target); // 一度再生したら監視を解除
            }
          });
        },
        {
          threshold: 0.1, // 10%見えたら判定
        }
      );

      // 各video要素にObserverを登録
      $target.each((_, el) => {
        observer.observe(el);
      });
    };

    /**
     * init_form
     * フォームの入力内容を検証します。
     *
     * @param {Object} settings 設定情報
     */
    #init_form = (settings) => {
      const { selector, params } = settings;
      const { callback } = params;

      // フォームのセレクタが指定されていない場合は早期リターン
      if (!selector) return;

      // フォームが存在しない場合も早期リターン
      const $forms = $(selector);
      if ($forms.length === 0) return;

      // スクロールアニメーションの完了を待機するための関数
      const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      // フォームのバリデーション処理
      $forms.each((_, form) => {
        $(form).on("submit", async function (event) {
          // フォームが無効な場合は処理を中断
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();

            // 最初の無効なフォーム項目へスクロール
            const $firstInvalid = $(form).find(".form-control:invalid").first();
            if ($firstInvalid.length) {
              const pos = $firstInvalid.offset().top - 20; // 余白をつけてスクロール

              // スクロールアニメーション完了後にコールバックを実行
              $("html,body").animate({ scrollTop: pos }, 400);

              // waitForを使ってアニメーションが終了するまで待機
              await waitFor(400);

              // 最初のエラー項目にフォーカスを当てる
              $firstInvalid.focus();

              // スクロール終了後にコールバックを実行
              callback?.($(form));
            }
          }

          // フォームに 'was-validated' クラスを追加
          $(form).addClass("was-validated");
        });
      });
    };

    /**
     * init_drawer：
     * ドロワーメニューの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_drawer = (settings) => {
      // 設定から必要な値を分割代入
      const {
        selector,
        params: { callback },
      } = settings;

      // 対象要素が存在しない場合、またはdrawer機能がない場合は早期リターン
      const $target = $(selector);
      if (!$target.length || typeof $.fn.drawer !== "function") return;

      // drawerの初期化
      $target.drawer();

      // "a"タグがクリックされた時の処理
      $target.find("a").on("click", () => {
        // drawerを閉じる
        $target.drawer("close");

        // コールバックが指定されていれば実行
        callback?.();
      });
    };

    /**
     * init_particle:
     * パーティクルの動作を設定します。
     *
     * @param {Object} settings 設定情報
     */
    #init_particle = (settings) => {
      // 設定から必要な値を分割代入
      const {
        selector,
        params: { jsonPath, particleType, callback },
      } = settings;

      // 対象要素が存在しない場合は早期リターン
      const $targets = $(selector);
      if (!$targets.length) return;

      // particleTypeが指定されていない場合はデフォルトを設定
      const particleTypeToUse = particleType || "default";

      // 対象要素ごとに処理
      $targets.each((_, el) => {
        const $el = $(el);

        // 要素にidが設定されているか確認
        const id = $el.attr("id");

        // jsonファイル名を設定したparticleTypeに基づいて組み立て
        const jsonFilePath = `${jsonPath}${particleTypeToUse}.json`;

        // idが設定されている場合にparticlesJSをロード
        if (id) {
          particlesJS.load(id, jsonFilePath, callback);
        }
      });
    };

    /**
     * init_popup
     * ポップアップの初期設定
     *
     * @param {Object} settings 設定情報
     */
    #init_popup = (settings) => {
      const { selector, params } = settings;

      // 必要なパラメータを分割代入
      const { wait, closeElement, offset, enableTop, enableBottom, transfer, repop, callback } = params;

      const $target = $(selector);
      if (!$target.length) return;

      const modal = new bootstrap.Modal(selector);
      const element = document.querySelector(selector);

      // 一度だけポップアップを表示するためのフラグ
      let isShown = false;

      // ユーザーがフォームに入力を開始したらポップアップを表示しないためのフラグ
      let stopFlag = false;

      // ┌────────────┬──────────────────────┬──────────────────────────────┬────────────────────────────────────────────────┐
      // │ フラグ名    │ 意味                 │ いつ立つ？                    │ なぜ必要？                                      │
      // ├────────────┼──────────────────────┼──────────────────────────────┼────────────────────────────────────────────────┤
      // │ isShown    │ モーダルが表示されたか │ 表示時 / 手動フォーカス時      │ 同じポップアップが何度も出ないようにする           │
      // │ stopFlag   │ ユーザーの入力意思あり │ email入力欄にフォーカス時      │ ユーザー操作を尊重してポップアップを止める         │
      // └────────────┴──────────────────────┴──────────────────────────────┴────────────────────────────────────────────────┘

      // ユーザーがemail欄にフォーカスした際にポップアップを止める
      $("input[type='email']").on("focus", function () {
        stopFlag = true;
        isShown = true; // ユーザー操作で表示をブロックしたので、ポップアップも不要
      });

      // 指定時間後にポップアップを表示
      if (wait) {
        setTimeout(() => {
          if (!stopFlag) modal.show();
        }, wait);
      }

      // 閉じるボタン
      if (closeElement) {
        $(closeElement).on("click", () => modal.hide());
      }

      // 自動遷移（transfer）処理
      if (transfer?.wait && transfer.url) {
        setTimeout(() => {
          location.href = transfer.url;
        }, transfer.wait);
      }

      // ポップアップ表示関数
      const popup = () => {
        if (!isShown && !stopFlag) {
          modal.show();
          isShown = true;
          callback?.();
        }
      };

      // モーダル非表示時に再表示用タイマー設定
      if (repop) {
        let tid;
        element.addEventListener("hidden.bs.modal", () => {
          isShown = false; // モーダルを閉じたので、再度表示可能に
          clearTimeout(tid);
          tid = setTimeout(() => {
            if (!isShown) popup(); // 一定時間後に再度表示
          }, repop);
        });
      }

      // スクロールによる表示
      const scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      const pageBottom = scrollHeight - window.innerHeight - offset;

      let lastScrollTop = 0; // 前回のスクロール位置
      let triggeredTop = false; // 上部スクロールでポップアップを表示したか
      let triggeredBottom = false; // 下部スクロールでポップアップを表示したか

      $(window).on("scroll", function () {
        const scrollTop = $(this).scrollTop();

        // 上部でスクロールしたとき
        if (enableTop && scrollTop <= offset && scrollTop < lastScrollTop && !triggeredTop) {
          popup();
          triggeredTop = true; // 上部で表示したフラグを立てる
        }

        // 下部でスクロールしたとき
        if (enableBottom && scrollTop >= pageBottom && scrollTop > lastScrollTop && !triggeredBottom) {
          popup();
          triggeredBottom = true; // 下部で表示したフラグを立てる
        }

        lastScrollTop = scrollTop; // スクロール位置を更新
      });
    };

    /**
     * init_youtube
     * YouTube動画の初期設定
     *
     * @param {Object} settings 設定情報
     */
    #init_youtube = (settings) => {
      const { selector, params } = settings;

      // 必要なパラメータを分割代入
      const { useAPI = false, lazyload = false, autoplay = false, buttonAnimation = "ring", onPlayerStateChange } = params;

      const $target = $(selector);

      // 対象要素がない場合は処理を抜ける
      if (!$target.length) return;

      // ボタンアニメーションを追加する関数
      const addButtonAnimation = ($el, useAPI = false) => {
        if (!buttonAnimation) return;

        // すでにアニメーションが追加されているか確認
        const $existing = $el.children(`[data-aos="${buttonAnimation}"]`);
        if ($existing.length) return;

        // アニメーション用の div 要素を作成
        const $animationDiv = $(`<div data-aos="${buttonAnimation}"></div>`);

        if (useAPI) {
          // iframeの兄弟要素として追加
          $el.after($animationDiv);
        } else {
          // 通常通り、子要素として追加
          $el.prepend($animationDiv);
        }
      };

      // ▼ useAPI: false → クリックでiframe差し替え
      if (!useAPI) {
        $target.each((_, el) => {
          const $el = $(el);
          const videoId = $el.data("video-id");

          // videoIdがない場合は処理を抜ける
          if (!videoId) return;

          // アニメーションをボタンに追加
          addButtonAnimation($el, false);

          // クリックしたらiframeを挿入
          const iframe = `<iframe
            src="https://www.youtube.com/embed/${videoId}?si=&autoplay=1&rel=0"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>`;

          $el.find("img").on("click", () => {
            $el.empty().append(iframe);
          });
        });
        return;
      }

      // ▼ useAPI: true → IFrame APIを使用
      const loadYouTubeVideo = ($el) => {
        const videoId = $el.data("video-id");

        // videoIdがない場合は処理を抜ける
        if (!videoId) return;

        // アニメーションをボタンに追加
        addButtonAnimation($el, true);

        const $icon = $el.find(".fa-youtube").first();
        const $restoredIcon = $icon.length ? $icon.clone(true) : null;

        const playerId = $el.attr("id");

        // 新しいYouTubeプレーヤーを作成
        new YT.Player(playerId, {
          videoId,
          events: {
            onReady: (event) => {
              // プレーヤー準備完了時の処理
              if ($restoredIcon) {
                // 元の $el は <iframe> に置換されているので、id属性で再取得
                const $iframe = $(`#${playerId}`);
                $iframe.after($restoredIcon);
                $restoredIcon.css("pointer-events", "auto"); // ← クリック可能に

                // アイコンクリック時に動画再生
                $restoredIcon.on("click", () => {
                  event.target.playVideo();
                  $restoredIcon.remove();

                  // アニメーション要素（data-aos）も削除
                  const $aos = $iframe.siblings(`[data-aos="${buttonAnimation}"]`);
                  if ($aos.length) $aos.remove();
                });
              }

              // 自動再生
              if (autoplay) {
                event.target.playVideo();

                if ($restoredIcon) $restoredIcon.remove();

                // autoplay時もアニメーション要素を削除
                const $iframe = $(`#${playerId}`);
                const $aos = $iframe.siblings(`[data-aos="${buttonAnimation}"]`);
                if ($aos.length) $aos.remove();
              }
            },
            onStateChange: (event) => {
              // プレーヤー状態が変化した場合のコールバック
              if (typeof onPlayerStateChange === "function") {
                onPlayerStateChange(event);
              }
            },
          },
        });
      };

      // APIロード後の初期化処理
      window.onYouTubeIframeAPIReady = () => {
        // ▼ lazyloadが有効の場合、IntersectionObserverを使ってビデオを遅延読み込みする
        if (lazyload) {
          const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // 要素が画面内に入ったらYouTube動画を読み込む
                loadYouTubeVideo($(entry.target));
                // 読み込んだ要素は監視から外す
                obs.unobserve(entry.target);
              }
            });
          });

          // 各ターゲット要素にIntersectionObserverを適用
          $target.each((_, el) => observer.observe(el));
        } else {
          // ▼ lazyloadが無効の場合、全てのターゲット要素を即座に読み込む
          $target.each((_, el) => loadYouTubeVideo($(el)));
        }
      };

      // APIスクリプトが未ロードなら読み込む
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      } else if (window.YT && window.YT.Player) {
        window.onYouTubeIframeAPIReady();
      }
    };

    /**
     * init_date
     * 日付の初期設定
     *
     * @param {Object} settings 設定情報
     */
    #init_date = (settings) => {
      $.each(settings.set, (_, setting) => {
        const { selector, params } = setting;
        const $target = $(selector);

        // ▼ 対象要素が存在しない場合、処理を中止
        if (!$target.length) return;

        // ▼ baseDate が未指定の場合は、今日の日付を基準日として設定
        const { baseDate = "", diff = 0, format } = params;
        const date = baseDate ? new Date(baseDate) : new Date();

        // ▼ 差分日数を適用（diff が指定されていれば、日付を更新）
        const dateDiff = Number(diff) || 0;
        date.setDate(date.getDate() + dateDiff);

        // ▼ 指定されたフォーマットで日付をフォーマット
        const formatted = this.formatDateTime(date, format);

        // ▼ 対象要素にフォーマット済みの日付をセット
        $target.html(formatted);
      });
    };
  }

  // 初期化
  new Util();
});
