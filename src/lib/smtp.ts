/* SmtpJS.com - v3.0.0 */
export const Email = {
  send: function (a: any) {
    return new Promise<string>(function (n) {
      (a.nocache = Math.floor(1e6 * Math.random() + 1)), (a.Action = "Send");
      const t = JSON.stringify(a);
      Email.ajaxPost(
        "https://smtpjs.com/v3/smtpjs.aspx?",
        t,
        function (e: any) {
          n(e);
        }
      );
    });
  },
  ajaxPost: function (e: any, n: any, t: any) {
    const a = Email.createCORSRequest("POST", e);
    a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
      (a.onload = function () {
        const e = a.responseText;
        null != t && t(e);
      }),
      a.send(n);
  },
  ajax: function (e: any, n: any) {
    const t = Email.createCORSRequest("GET", e);
    (t.onload = function () {
      const e = t.responseText;
      null != n && n(e);
    }),
      t.send();
  },
  createCORSRequest: function (e: any, n: any) {
    let t = new XMLHttpRequest();
    return (
      "withCredentials" in t
        ? t.open(e, n, !0)
        : "undefined" != typeof XDomainRequest
        ? (t = new XDomainRequest()).open(e, n)
        : (t = null),
      t
    );
  },
};
