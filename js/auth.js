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
        const json = JSON.stringify(result);
        if (json.hasOwnProperty('validity') && json.validity === 'false') {
          $('html').remove();
        }
        console.log(json);
      },
      (error) => {
        alert("Error:" + JSON.stringify(error));
      }
    );
  })();
