(async () => {
    const url = "https://script.google.com/macros/s/AKfycbyrSZsHxvglJp97CMsdXBl20ZVopXFOkFI1ntm7Ig0cjcGK3CT38DGR_8h1T36TiwwL/exec";
    const data = {}
    data.method = 'POST'
    data.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    const params = new URLSearchParams();
    params.append('href', location.href);
    data.body = params;
    const res = await fetch(url).catch(e=>console.error(e));
    //const json = await res.json();
    //return json
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
