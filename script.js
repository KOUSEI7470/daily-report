// =========================
// EmailJS 設定
// =========================
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

// =========================
// 作業員名
// 実名に置き換えてください
// =========================
const diverWorkers = [
  "潜水1", "潜水2", "潜水3", "潜水4", "潜水5",
  "潜水6", "潜水7", "潜水8", "潜水9", "潜水10"
];

const landWorkers = [
  "陸上1", "陸上2", "陸上3", "陸上4", "陸上5",
  "陸上6", "陸上7", "陸上8", "陸上9", "陸上10"
];

const standbyWorkers = [
  "待機1", "待機2", "待機3", "待機4", "待機5",
  "待機6", "待機7", "待機8", "待機9", "待機10"
];

const movingWorkers = [
  "移動1", "移動2", "移動3", "移動4", "移動5",
  "移動6", "移動7", "移動8", "移動9", "移動10"
];

// =========================
// 初期化
// =========================
document.addEventListener("DOMContentLoaded", () => {
  renderWorkerButtons("diver-list", "diver", diverWorkers);
  renderWorkerButtons("land-list", "land", landWorkers);
  renderWorkerButtons("standby-list", "standby", standbyWorkers);
  renderWorkerButtons("moving-list", "moving", movingWorkers);

  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
  });

  const sendButton = document.getElementById("send-button");
  sendButton.addEventListener("click", handleSendClick);
});

// =========================
// 作業員ボタン生成
// =========================
function renderWorkerButtons(containerId, groupName, workers) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  workers.forEach((workerName, index) => {
    const label = document.createElement("label");
    label.className = "worker-label";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = groupName;
    input.value = workerName;
    input.id = `${groupName}-${index}`;

    input.addEventListener("change", () => {
      label.classList.toggle("selected", input.checked);
    });

    const span = document.createElement("span");
    span.textContent = workerName;

    label.appendChild(input);
    label.appendChild(span);
    container.appendChild(label);
  });
}

// =========================
// 選択された作業員名取得
// =========================
function getSelectedWorkerNames(groupName) {
  const checked = document.querySelectorAll(`input[name="${groupName}"]:checked`);
  const names = Array.from(checked).map(el => el.value);
  return names.length > 0 ? names.join("、") : "なし";
}

// =========================
// 入力値取得
// =========================
function getFormValues() {
  return {
    report_date: document.getElementById("report-date").value,
    destination_company: document.getElementById("destination-company").value.trim(),
    site_name: document.getElementById("site-name").value.trim(),
    meeting_place: document.getElementById("meeting-place").value.trim(),
    prime_contractor: document.getElementById("prime-contractor").value.trim(),
    start_time: document.getElementById("start-time").value,
    end_time: document.getElementById("end-time").value,
    remarks: document.getElementById("remarks").value.trim(),
    divers: getSelectedWorkerNames("diver"),
    land_workers: getSelectedWorkerNames("land"),
    standby_workers: getSelectedWorkerNames("standby"),
    moving_workers: getSelectedWorkerNames("moving")
  };
}

// =========================
// 必須チェック
// =========================
function validateForm(data) {
  if (!data.report_date) {
    alert("日付を入力してください。");
    return false;
  }

  if (!data.site_name) {
    alert("現場名を入力してください。");
    return false;
  }

  return true;
}

// =========================
// 送信処理
// =========================
async function handleSendClick() {
  const sendButton = document.getElementById("send-button");
  const data = getFormValues();

  if (!validateForm(data)) {
    return;
  }

  sendButton.disabled = true;
  sendButton.textContent = "送信中...";

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      data
    );

    alert("送信完了しました。");
    resetForm();
  } catch (error) {
    console.error("EmailJS送信エラー:", error);
    alert("送信に失敗しました。設定値やテンプレートを確認してください。");
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "送信";
  }
}

// =========================
// フォーム初期化
// =========================
function resetForm() {
  document.getElementById("daily-report-form").reset();

  document.querySelectorAll(".worker-label").forEach(label => {
    label.classList.remove("selected");
  });
}