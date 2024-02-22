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
        URL: location.href.replace(/(\?|#).*$/,""),
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
})();
