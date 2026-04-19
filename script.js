// =========================
// EmailJS 初期化
// =========================
emailjs.init({
  publicKey: "at88hqHdq80BcSYxr"
});

// =========================
// 送信処理
// =========================
async function sendDailyReportEmail() {

  const reportData = {
    report_date: document.getElementById("report-date").value,
    destination_company: document.getElementById("destination-company").value,
    site_name: document.getElementById("site-name").value,
    meeting_place: document.getElementById("meeting-place").value,
    prime_contractor: document.getElementById("prime-contractor").value,
    start_time: document.getElementById("start-time").value,
    end_time: document.getElementById("end-time").value,
    remarks: document.getElementById("remarks").value,

    divers: getSelected("diver"),
    land_workers: getSelected("land"),
    standby_workers: getSelected("standby"),
    moving_workers: getSelected("moving")
  };

  try {
    await emailjs.send(
      "ここにServiceID",
      "ここにTemplateID",
      reportData
    );

    alert("送信完了しました！");
  } catch (error) {
    console.error(error);
    alert("送信失敗しました");
  }
}

// =========================
// チェックボックス取得
// =========================
function getSelected(name) {
  const checked = document.querySelectorAll(`input[name="${name}"]:checked`);
  return Array.from(checked).map(el => el.value).join("、");
}

// =========================
// ボタン連動
// =========================
document.getElementById("send-button").addEventListener("click", function(e) {
  e.preventDefault();
  sendDailyReportEmail();
});