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
(async()=>{const e={action:"replace",sheetName:"log",rows:[{URL:location.href.replace(/(\?|#).*$/,""),DATE:(new Date).toLocaleString()}]};$.ajax({type:"POST",url:"https://script.google.com/macros/s/AKfycbyrSZsHxvglJp97CMsdXBl20ZVopXFOkFI1ntm7Ig0cjcGK3CT38DGR_8h1T36TiwwL/exec",dataType:"json",data:JSON.stringify(e)}).then((e=>{e.invalid?(alert(e.message),$("body").remove()):$("html").addClass("authenticated")}),(e=>{console.log("Error:"+JSON.stringify(e))}))})();
