(async () => {
    const url = "https://script.google.com/macros/s/AKfycbyrSZsHxvglJp97CMsdXBl20ZVopXFOkFI1ntm7Ig0cjcGK3CT38DGR_8h1T36TiwwL/exec";
    const json = {
    action: "replace",
    sheetName: "log",
    rows: [
        {
          host: location.host,
          href: location.href,
          pathname: location.pathname,
          port: location.port,
          protocol: location.protocol,
        }
      ]
    };
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(json),
    });
})();
/*
(async () => {
  const logger = "https://script.google.com/macros/s/AKfycbyrSZsHxvglJp97CMsdXBl20ZVopXFOkFI1ntm7Ig0cjcGK3CT38DGR_8h1T36TiwwL/exec";
//  const logger = "https://office-ing.net/coding/api/logger.php";
  // Host Info
  const json = {
    action: "replace",
    sheetName: "log",
    rows: [
        {
          host: location.host,
          href: location.href,
          pathname: location.pathname,
          port: location.port,
          protocol: location.protocol,
        }
      ]
  };

  // Post to server
  const response = await fetch(logger, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(json),
  });

  // // auth
  // const result = JSON.parse(json);

  // if (!result) {
  //   document.querySelector("#app").style.visibility = "hidden";
  // }
})();
*/
