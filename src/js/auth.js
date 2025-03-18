/*
======================================================================
Project Name    : LP Util
File Name       : auth.js
Encoding        : UTF-8
Creation Date   : 2024/02/14
History         : 
2025/03/18 use fetch instead of ajax
 
Copyright 2024 office-ing All rights reserved.
 
This source code or any portion thereof must not be  
reproduced or used in any manner whatsoever.
======================================================================
*/
(async () => {
  const t = location.href.replace(/(\?|#).*$/, "");
  if (0 === t.indexOf("file:")) return;

  const e = {
    action: "replace",
    sheetName: "log",
    rows: [
      {
        URL: t,
        DATE: new Date().toLocaleString(),
      },
    ],
  };

  const endpoint = "https://script.google.com/macros/s/AKfycbyIy4JhcJrBd6jMGHjAcG9D9JfuakATBcyfBQgD1mehEaHZNDo3vJyxasOypJZdB6Y/exec";

  try {
    // const response = await fetch("https://script.google.com/macros/s/AKfycbyrSZsHxvglJp97CMsdXBl20ZVopXFOkFI1ntm7Ig0cjcGK3CT38DGR_8h1T36TiwwL/exec", {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // body: JSON.stringify(e),
      // URLエンコード
      body: new URLSearchParams({
        action: "replace",
        sheetName: "log",
        rows: [
          {
            URL: t,
            DATE: new Date().toLocaleString(),
          },
        ],
      }),
    });

    const data = await response.json();
    if (data.invalid) {
      document.body.innerHTML = "";
      alert(data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
})();
