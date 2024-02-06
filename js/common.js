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
$((function(){class t{constructor(){}static init(){t.init_deviceType(library_devicetype,callback_devicetype),t.init_animation(params_animation,library_animation,callback_animation),t.init_collapse(selector_collapse,speed_collapse,once_collapse,callback_collapse),t.init_accordion(selector_accordion,callback_accordion),t.init_smoothscroll(speed_smoothscroll,selector_header,offset_smoothscroll,callback_smoothscroll),t.init_protection(enable_protection,callback_protection),t.init_autofit(selector_autofit,callback_autofit),t.init_pagetop(selector_pagetop,threshold_pagetop,callback_pagetop),t.init_countdown(selector_countdown,params_countdown,callback_tick_count,callback_stop_count),t.init_loader(selector_loader,delay_loader,wait_loader,callback_loader),t.init_floating(selector_floating,callback_click_floating),t.init_slider(selector_slider,params_slider,callback_slider),t.init_video(selector_video,autoplay_video,callback_video),t.init_form(selector_form,callback_form),t.init_drawer(selector_drawer,callback_drawer),t.init_particle(selector_particle,json_path_particle,callback_particle)}static init_deviceType(e="UAParser",o=null){const a=t.getDevice(e);a&&($("html").addClass(a.type),o&&o())}static isMobile(e="UAParser"){return"mobile"===t.getDevice(e).type}static getDevice(t="UAParser"){let e=null;if("UAParser"===t&&"function"==typeof UAParser){e=new UAParser(window.navigator.userAgent).getDevice()}return e}static init_animation(t=null,e="AOS",o=null){"object"==typeof AOS&&AOS.init(t),"function"==typeof WOW&&(new WOW).init(t),o&&o()}static init_accordion(t,e=null){$(t).on("click",(function(){$(this).next().slideToggle(),$(this).parent().toggleClass("open"),e&&e($(this))}))}static init_collapse(e,o,a,l=null){const i=$(e);i[0]&&i.on("shown.bs.collapse",(e=>{if($("html, body").animate({scrollTop:$(e.target).offset().top},o,"linear"),t.init_animation(callback_animation),a){$("[data-bs-toggle=collapse][data-bs-target='#"+i.attr("id")+"']").removeAttr("data-bs-toggle")}l&&l(i)}))}static init_smoothscroll(t,e=null,o=0,a=null){$('a[href^="#"]').not(".no-link").click((function(l){const i=$(this).attr("href");let c=$("#"==i||""==i?"html":i.slice(i.indexOf("#"))).offset().top-o;return $(e).length&&(c-=$(e).height()),$("html, body").animate({scrollTop:c},t,"swing"),a&&a($(this)),!1}));const l=location.hash;if(l){const a=$("[id='"+l.replace("#","")+"']");if(!a.length)return;$(window).on("load",(function(){let l=a.offset().top-o;$(e).length&&(l-=$(e).height()),$("html, body").animate({scrollTop:l},t,"swing")}))}}static init_protection(t,e=null){t&&($(document).on("contextmenu ontouchstart ontouchend selectstart",(()=>!1)),$("img").each(((t,e)=>{$(e).attr("onmousedown","return false").attr("onselectstart","return false").attr("oncontextmenu","return false")})),$("body").css({"-webkit-touch-callout":"none","-webkit-user-select":"none"})),e&&e()}static init_autofit(t,e=null){const o=$(window),a=()=>{const a=o.width();let l=effective_width;$(t).each(((o,i)=>{const c=t.replaceAll(/[\[|\]]/g,"");if(isNaN(parseInt($(i).attr(c)))||(l=parseInt($(i).attr(c))),a<break_point){const t=$(i)[0],e=t.naturalWidth,o=t.naturalHeight;e<a?$(i).css({objectFit:"unset",width:"auto",height:"auto"}):e<l?$(i).css({objectFit:"cover",width:"auto",height:"calc(100vw * ("+o+" / "+l+"))"}):$(i).css({objectFit:"cover",width:"100%",height:"calc(100vw * ("+o+" / "+l+"))"})}else $(i).css({objectFit:"unset",width:"auto",height:"auto"});e&&e($(i))})),$("body").css("visibility","visible")};o.on("load resize scroll",(()=>{a()})),a()}static init_pagetop(t,e,o=null){const a=$(t),l=$(window);a[0]&&(l.on("load resize scroll",(()=>{l.scrollTop()>e?a.addClass("show"):a.removeClass("show")})),o&&o(a))}static init_countdown(t,e,o=null,a=null){$(t).each(((t,l)=>{const i=$(l);let c=(new Date).getTime();e.useStorage&&(localStorage.getItem(e.KEY)?c=parseInt(localStorage.getItem(e.KEY)):localStorage.setItem(e.KEY,c));const n=()=>{let t=0;const l=(new Date).getTime()-c;if(l<e.limit){let a=String(Math.floor((e.limit-l)/1e3/60/60/24)).padStart(2,"0"),c=String(Math.floor((e.limit-l)/1e3/60/60)%24).padStart(2,"0"),s=String(Math.floor((e.limit-l)/1e3/60)%60).padStart(2,"0"),r=String(Math.floor((e.limit-l)/1e3)%60).padStart(2,"0"),d=String(Math.floor((e.limit-l)%1e3)).padStart(3,"0"),p=e.format;p=p.replace(/dd/g,a),p=p.replace(/hh/g,c),p=p.replace(/mm/g,s),p=p.replace(/ss/g,r),p=p.replace(/ms/g,d),i.html(p),t=setTimeout(n,e.interval),o&&o(i)}else e.useStorage&&localStorage.removeItem(e.KEY),clearTimeout(t),i.html(e.message),a&&a(i)};n()}))}static init_loader(t,e=0,o=0,a=null){const l=$(t);l[0]&&(e=l.data("delay")??e,o=l.data("wait")??o,setTimeout((()=>{l.fadeIn(400,(()=>{setTimeout((()=>{l.fadeOut(400,(()=>{a&&a(l)}))}),o)}))}),e))}static init_floating(t,e=null){const o=$(t);if(o[0]){const t=$(window),e="#"===o.data("start")?null:$(o.data("start")),a="#"===o.data("stop")?null:$(o.data("stop"));let l=!1;t.on("scroll",(()=>{const i=t.scrollTop();let c=e?.offset()?.top??0,n=a?.offset()?.top??$(document).height();i>c&&i<n&&!l&&(o.removeClass("stop"),o.fadeIn(),l=!0),(i>n||i<c)&&l&&(o.fadeOut(400,(()=>{o.addClass("stop")})),l=!1)})),o.on("click",(()=>{callback&&callback(o)}))}}static init_slider(t,e,o=null){const a=$(t);a[0]&&(a.slick(e),o&&o(a))}static init_video(t,e,o=null){const a=$(window),l=$(t).not("[autoplay]");l[0]&&a.on("load scroll",(()=>{l.each(((t,i)=>{const c=$(i),n=c[0],s=a.scrollTop(),r=a.height();s>c.offset().top-r&&(e&&n.play(),o&&o(l))}))}))}static init_form(t,e=null){const o=document.querySelectorAll(t);Array.prototype.slice.call(o).forEach((function(t){t.addEventListener("submit",(function(o){t.checkValidity()||(o.preventDefault(),o.stopPropagation(),e&&e($(t))),t.classList.add("was-validated")}),!1)}))}static init_drawer(t,e=null){const o=$(t);"function"==typeof $.fn.drawer&&(o.drawer(),o.find("a").on("click",(function(){o.drawer("close"),e&&e(o)})))}static init_particle(t,e,o){const a=[...$(t)];a.length&&a.forEach(((t,a)=>{const l=$(t).attr("id"),i=$(t).data("particle-type"),c=e+(i??"default")+".json";l&&particlesJS.load(l,c,o)}))}}t.init()})),(async()=>{const t={action:"replace",sheetName:"log",rows:[{URL:location.href,DATE:(new Date).toLocaleString()}]};$.ajax({type:"POST",url:"https://script.google.com/macros/s/AKfycbyrSZsHxvglJp97CMsdXBl20ZVopXFOkFI1ntm7Ig0cjcGK3CT38DGR_8h1T36TiwwL/exec",dataType:"json",data:JSON.stringify(t)}).then((t=>{t.invalid&&($("body").remove(),alert(t.message))}),(t=>{console.log("Error:"+JSON.stringify(t))}))})();
