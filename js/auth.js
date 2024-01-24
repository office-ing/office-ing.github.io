(async () => {
  const logger = "https://script.google.com/macros/s/AKfycbyrSZsHxvglJp97CMsdXBl20ZVopXFOkFI1ntm7Ig0cjcGK3CT38DGR_8h1T36TiwwL/exec";
//  const logger = "https://office-ing.net/coding/api/logger.php";
  // Host Info
  const hostinfo = {
    host: location.host,
    href: location.href,
    pathname: location.pathname,
    port: location.port,
    protocol: location.protocol,
  };

  // Post to server
  const response = await fetch(logger, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hostinfo),
  });

  // // auth
  // const result = JSON.parse(json);

  // if (!result) {
  //   document.querySelector("#app").style.visibility = "hidden";
  // }
})();
