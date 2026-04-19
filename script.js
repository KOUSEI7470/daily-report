// =========================
// EmailJS 設定
// =========================
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

// =========================
// EmailJS 初期化
// =========================
document.addEventListener("DOMContentLoaded", function () {
  if (typeof emailjs === "undefined") {
    console.error("EmailJS の読み込みに失敗しています。index.html の script タグを確認してください。");
    return;
  }

  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
  });

  const sendButton = document.getElementById("send-button");
  if (sendButton) {
    sendButton.addEventListener("click", function (e) {
      e.preventDefault();
      sendDailyReportEmail();
    });
  } else {
    console.error("id='send-button' のボタンが見つかりません。");
  }
});

// =========================
// チェックされている作業員名を取得
// =========================
function getSelectedWorkerNames(groupName) {
  const checked = document.querySelectorAll(`input[name="${groupName}"]:checked`);
  const names = Array.from(checked).map(el => el.value).filter(Boolean);
  return names.length > 0 ? names.join("、") : "なし";
}

// =========================
// 入力値取得
// ※ id名が今のHTMLと違う場合はここだけ直してください
// =========================
function buildMailParams() {
  return {
    report_date: getValue("report-date"),
    destination_company: getValue("destination-company"),
    site_name: getValue("site-name"),
    meeting_place: getValue("meeting-place"),
    prime_contractor: getValue("prime-contractor"),
    start_time: getValue("start-time"),
    end_time: getValue("end-time"),
    remarks: getValue("remarks"),

    divers: getSelectedWorkerNames("diver"),
    land_workers: getSelectedWorkerNames("land"),
    standby_workers: getSelectedWorkerNames("standby"),
    moving_workers: getSelectedWorkerNames("moving")
  };
}

// =========================
// 要素の値を安全に取得
// =========================
function getValue(id) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`id='${id}' が見つかりません。`);
    return "";
  }
  return (el.value || "").trim();
}

// =========================
// 必須チェック
// =========================
function validateMailParams(params) {
  if (!params.report_date) {
    alert("日付を入力してください。");
    return false;
  }

  if (!params.site_name) {
    alert("現場名を入力してください。");
    return false;
  }

  return true;
}

// =========================
// 送信処理
// =========================
async function sendDailyReportEmail() {
  const params = buildMailParams();

  if (!validateMailParams(params)) {
    return;
  }

  const sendButton = document.getElementById("send-button");
  const originalText = sendButton ? sendButton.textContent : "送信";

  try {
    if (sendButton) {
      sendButton.disabled = true;
      sendButton.textContent = "送信中...";
    }

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      params
    );

    alert("送信完了しました。");
  } catch (error) {
    console.error("EmailJS送信エラー:", error);
    alert("送信に失敗しました。設定値やテンプレートを確認してください。");
  } finally {
    if (sendButton) {
      sendButton.disabled = false;
      sendButton.textContent = originalText;
    }
  }
}