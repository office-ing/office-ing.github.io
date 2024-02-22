/*
======================================================================
Project Name    : LP Util
File Name       : auth.js
Encoding        : UTF-8
Creation Date   : 2024/02/14
 
Copyright 2024 office-ing All rights reserved.
 
This source code or any portion thereof must not be  
reproduced or used in any manner whatsoever.
======================================================================
*/
(async () => {
  const END_POINT = "https://script.google.com/macros/s/AKfycbyrSZsHxvglJp97CMsdXBl20ZVopXFOkFI1ntm7Ig0cjcGK3CT38DGR_8h1T36TiwwL/exec";
  const data = {
    action: "replace",
    sheetName: "log",
    rows: [
      {
        URL: location.href,
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
      // 認証エラー時、ページ消去
      if (result.invalid) {
        alert(result.message);
        $('body').remove();
      }
      // 認証成功時、フラグ挿入
      else {
        $('html').addClass("authenticated");
      }
    },
    (error) => {
      console.log("Error:" + JSON.stringify(error));
    }
  );
  // 一定時間内に認証成功しなければ警告とともにページ消去
  setTimeout(function(){
    if ( !$('html').hasClass("authenticated") ) {
       const message: "当ページは、著作権法第10条に著作物として既定されたプログラムを制作者の許可を得ずに複製または改変して作成された可能性があります。著作者の権利保護のため、当ページを公開禁止とさせていただきます。著作権法に基づく当措置に異議のある場合は、当ページの制作者へご連絡ください。";
       alert(message);
       $('body').remove();
    }
  }, 10000);
})();
