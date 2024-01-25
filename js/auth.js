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
        if (result.invalid) {
          $('body').remove();
          alert("当ページは、著作権法第10条に著作物として既定されたプログラムを制作者の許可を得ずに複製または改変して作成された可能性があります。著作者の権利保護のため、当ページを公開禁止とさせていただきます。著作権法に基づく当措置に異議のある場合は、当ページの制作者へご連絡ください。");
        }
      },
      (error) => {
        alert("Error:" + JSON.stringify(error));
      }
    );
  })();
