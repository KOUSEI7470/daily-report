document.title = "TEST-20260421";

// ==============================
// EmailJS 設定（config.js 参照）
// ==============================
const EMAILJS_PUBLIC_KEY = window.EMAILJS_CONFIG?.publicKey || "";
const EMAILJS_SERVICE_ID = window.EMAILJS_CONFIG?.serviceId || "";
const EMAILJS_TEMPLATE_ID = window.EMAILJS_CONFIG?.templateId || "";


// ==============================
// 作業員名
// ==============================
const workerNames = [
  "藤田大伸",
  "千種克典",
  "木下卓也",
  "山本聖家",
  "前川善次",
  "小野義光",
  "田中大海",
  "稲垣英人",
  "田中昇翔"
];


// ==============================
// 分類
// 表示順がそのまま画面順
// ==============================
const categories = [
  {
    key: "diving",
    label: "潜水作業員",
    shortLabel: "潜水"
  },
  {
    key: "land",
    label: "陸上作業員",
    shortLabel: "陸上"
  },
  {
    key: "standby",
    label: "待機",
    shortLabel: "待機"
  },
  {
    key: "move",
    label: "移動",
    shortLabel: "移動"
  }
];


// ==============================
// 固定作業員の選択状態
// ==============================
const selectedWorkers = {
  diving: new Set(),
  land: new Set(),
  standby: new Set(),
  move: new Set()
};


// ==============================
// 予備作業員
// 臨時で氏名を入力する
// ==============================
const customWorkerNames = {
  diving: "",
  land: "",
  standby: "",
  move: ""
};


// ==============================
// HTML要素取得
// ==============================
const els = {

  workDate:
    document.getElementById("workDate"),

  datePreview:
    document.getElementById("datePreview"),

  destinationCompany:
    document.getElementById("destinationCompany"),

  siteName:
    document.getElementById("siteName"),

  meetingPlace:
    document.getElementById("meetingPlace"),

  primeCompany:
    document.getElementById("primeCompany"),

  startTime:
    document.getElementById("startTime"),

  endTime:
    document.getElementById("endTime"),

  otherNote:
    document.getElementById("otherNote"),

  workerSections:
    document.getElementById("workerSections"),

  clearButton:
    document.getElementById("clearButton"),

  summaryButton:
    document.getElementById("summaryButton"),

  excelButton:
    document.getElementById("excelButton"),

  summaryArea:
    document.getElementById("summaryArea")
};


// ==============================
// 日付関連
// ==============================

function setTodayDate() {

  const today = new Date();

  const yyyy =
    today.getFullYear();

  const mm =
    String(today.getMonth() + 1)
      .padStart(2, "0");

  const dd =
    String(today.getDate())
      .padStart(2, "0");

  els.workDate.value =
    `${yyyy}-${mm}-${dd}`;

  updateDatePreview();
}


// ------------------------------
// 2026-08-25
// ↓
// 2026/8/25
// ------------------------------
function formatDateSlash(dateString) {

  if (!dateString) {
    return "";
  }

  const date =
    new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const y =
    date.getFullYear();

  const m =
    date.getMonth() + 1;

  const d =
    date.getDate();

  return `${y}/${m}/${d}`;
}


// ------------------------------
// 曜日取得
// ------------------------------
function getWeekdayShort(dateString) {

  if (!dateString) {
    return "";
  }

  const date =
    new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const weekdays = [
    "日",
    "月",
    "火",
    "水",
    "木",
    "金",
    "土"
  ];

  return weekdays[date.getDay()];
}


// ------------------------------
// 日付＋曜日
//
// 例
// 2026/8/25（火）
// ------------------------------
function formatDateWithWeekday(dateString) {

  const dateSlash =
    formatDateSlash(dateString);

  const weekday =
    getWeekdayShort(dateString);

  if (!dateSlash || !weekday) {
    return "日付を選択してください";
  }

  return `${dateSlash}（${weekday}）`;
}


// ------------------------------
// 日付欄の下に曜日表示
// ------------------------------
function updateDatePreview() {

  els.datePreview.textContent =
    formatDateWithWeekday(
      els.workDate.value
    );
}


// ==============================
// 作業員ボタン生成
// ==============================

function createWorkerSections() {

  els.workerSections.innerHTML = "";

  categories.forEach((category) => {

    // --------------------------
    // 分類全体
    // --------------------------
    const block =
      document.createElement("div");

    block.className =
      "worker-block";


    // --------------------------
    // 見出し
    // --------------------------
    const title =
      document.createElement("h3");

    title.className =
      "worker-title";

    title.textContent =
      `${category.label}（${workerNames.length}名＋予備）`;


    // --------------------------
    // 作業員ボタン配置エリア
    // --------------------------
    const grid =
      document.createElement("div");

    grid.className =
      "worker-grid";


    // ==========================
    // 固定作業員
    // ==========================
    workerNames.forEach((name) => {

      const button =
        document.createElement("button");

      button.type =
        "button";

      button.className =
        "worker-button";

      button.textContent =
        name;

      button.dataset.category =
        category.key;

      button.dataset.name =
        name;


      // ------------------------
      // 作業員ボタンを押した時
      // ------------------------
      button.addEventListener(
        "click",
        () => {

          toggleWorker(
            category.key,
            name,
            button
          );

        }
      );


      grid.appendChild(button);

    });


    // ==========================
    // 予備作業員入力欄
    // ==========================

    const customWrap =
      document.createElement("div");

    customWrap.className =
      "custom-worker-wrap";


    const customInput =
      document.createElement("input");

    customInput.type =
      "text";

    customInput.className =
      "custom-worker-input";

    customInput.placeholder =
      "予備：氏名を入力";

    customInput.dataset.category =
      category.key;


    // --------------------------
    // 予備作業員の氏名入力
    // --------------------------
    customInput.addEventListener(
      "input",
      () => {

        const oldName =
          customWorkerNames[
            category.key
          ];

        const newName =
          customInput.value.trim();


        // ----------------------
        // 以前入力されていた
        // 予備作業員を削除
        // ----------------------
        if (
          oldName &&
          selectedWorkers[
            category.key
          ].has(oldName)
        ) {

          selectedWorkers[
            category.key
          ].delete(oldName);

        }


        // ----------------------
        // 新しい氏名を保存
        // ----------------------
        customWorkerNames[
          category.key
        ] = newName;


        // ----------------------
        // 氏名が入力されていれば
        // 自動的に選択扱い
        // ----------------------
        if (newName) {

          selectedWorkers[
            category.key
          ].add(newName);

          customWrap.classList.add(
            "active"
          );

        } else {

          customWrap.classList.remove(
            "active"
          );

        }

      }
    );


    customWrap.appendChild(
      customInput
    );

    grid.appendChild(
      customWrap
    );


    // --------------------------
    // 画面へ追加
    // --------------------------
    block.appendChild(
      title
    );

    block.appendChild(
      grid
    );

    els.workerSections.appendChild(
      block
    );

  });
}


// ==============================
// 固定作業員
// 選択／解除
// ==============================

function toggleWorker(
  categoryKey,
  workerName,
  buttonEl
) {

  const set =
    selectedWorkers[
      categoryKey
    ];


  // ----------------------------
  // 選択済みなら解除
  // ----------------------------
  if (set.has(workerName)) {

    set.delete(workerName);

    buttonEl.classList.remove(
      "active"
    );

  }

  // ----------------------------
  // 未選択なら選択
  // ----------------------------
  else {

    set.add(workerName);

    buttonEl.classList.add(
      "active"
    );

  }
}


// ==============================
// 入力値取得
// ==============================

function getInputValue(el) {

  if (!el) {
    return "";
  }

  return el.value.trim();
}


// ==============================
// 入力内容をまとめて取得
// ==============================

function getFormData() {

  return {

    workDate:
      getInputValue(
        els.workDate
      ),

    workDateSlash:
      formatDateSlash(
        getInputValue(
          els.workDate
        )
      ),

    weekday:
      getWeekdayShort(
        getInputValue(
          els.workDate
        )
      ),

    workDateText:
      formatDateWithWeekday(
        getInputValue(
          els.workDate
        )
      ),

    destinationCompany:
      getInputValue(
        els.destinationCompany
      ),

    siteName:
      getInputValue(
        els.siteName
      ),

    meetingPlace:
      getInputValue(
        els.meetingPlace
      ),

    primeCompany:
      getInputValue(
        els.primeCompany
      ),

    startTime:
      getInputValue(
        els.startTime
      ),

    endTime:
      getInputValue(
        els.endTime
      ),

    workContent:
      getInputValue(
        document.getElementById(
          "work-content"
        )
      ),

    otherNote:
      getInputValue(
        els.otherNote
      ),

    diving:
      Array.from(
        selectedWorkers.diving
      ),

    land:
      Array.from(
        selectedWorkers.land
      ),

    standby:
      Array.from(
        selectedWorkers.standby
      ),

    move:
      Array.from(
        selectedWorkers.move
      )

  };
}


// ==============================
// 選択作業員人数
// ==============================

function getSelectedCount(data) {

  return (
    data.diving.length +
    data.land.length +
    data.standby.length +
    data.move.length
  );
}


// ==============================
// 作業員名表示
// ==============================

function joinWorkerNames(list) {

  return (
    list.length > 0
      ? list.join("、")
      : "なし"
  );
}


// ==============================
// 確認用テキスト
// ==============================

function buildSummaryText(data) {

  return [

    "【基本情報】",

    `日付：${data.workDateText}`,

    `行先会社名：${
      data.destinationCompany ||
      "未入力"
    }`,

    `現場名：${
      data.siteName ||
      "未入力"
    }`,

    `集合場所：${
      data.meetingPlace ||
      "未入力"
    }`,

    `元請会社名：${
      data.primeCompany ||
      "未入力"
    }`,

    `始業時間：${
      data.startTime ||
      "未入力"
    }`,

    `終業時間：${
      data.endTime ||
      "未入力"
    }`,

    `作業内容：${
      data.workContent ||
      "未入力"
    }`,

    "",

    "【作業員分類】",

    `潜水作業員：${
      joinWorkerNames(
        data.diving
      )
    }`,

    `陸上作業員：${
      joinWorkerNames(
        data.land
      )
    }`,

    `待機：${
      joinWorkerNames(
        data.standby
      )
    }`,

    `移動：${
      joinWorkerNames(
        data.move
      )
    }`,

    "",

    "【その他】",

    data.otherNote ||
      "未入力"

  ].join("\n");
}


// ==============================
// HTML表示用
// ==============================

function buildSummaryHTML(data) {

  return `

    <div>
      <strong>
        【基本情報】
      </strong>
    </div>

    <div>
      日付：
      ${data.workDateText}
    </div>

    <div>
      行先会社名：
      ${
        data.destinationCompany ||
        "未入力"
      }
    </div>

    <div>
      現場名：
      ${
        data.siteName ||
        "未入力"
      }
    </div>

    <div>
      集合場所：
      ${
        data.meetingPlace ||
        "未入力"
      }
    </div>

    <div>
      元請会社名：
      ${
        data.primeCompany ||
        "未入力"
      }
    </div>

    <div>
      始業時間：
      ${
        data.startTime ||
        "未入力"
      }
    </div>

    <div>
      終業時間：
      ${
        data.endTime ||
        "未入力"
      }
    </div>

    <div>
      作業内容：
      ${
        (
          data.workContent ||
          "未入力"
        )
        .replace(
          /\n/g,
          "<br>"
        )
      }
    </div>

    <br>

    <div>
      <strong>
        【作業員分類】
      </strong>
    </div>

    <div>
      潜水作業員：
      ${
        joinWorkerNames(
          data.diving
        )
      }
    </div>

    <div>
      陸上作業員：
      ${
        joinWorkerNames(
          data.land
        )
      }
    </div>

    <div>
      待機：
      ${
        joinWorkerNames(
          data.standby
        )
      }
    </div>

    <div>
      移動：
      ${
        joinWorkerNames(
          data.move
        )
      }
    </div>

    <br>

    <div>
      <strong>
        【その他】
      </strong>
    </div>

    <div>
      ${
        data.otherNote ||
        "未入力"
      }
    </div>

  `;
}


// ==============================
// 確認ボタン
// ==============================

function showSummary() {

  const data =
    getFormData();

  els.summaryArea.innerHTML =
    buildSummaryHTML(data);
}


// ==============================
// メール送信用テキスト
// ==============================

function buildMailBody(data) {

  return [

    "【作業日報テスト999】",

    "",

    `日付：${
      data.workDateText ||
      "未入力"
    }`,

    `行先会社名：${
      data.destinationCompany ||
      "未入力"
    }`,

    `現場名：${
      data.siteName ||
      "未入力"
    }`,

    `集合場所：${
      data.meetingPlace ||
      "未入力"
    }`,

    `元請会社名：${
      data.primeCompany ||
      "未入力"
    }`,

    `始業時間：${
      data.startTime ||
      "未入力"
    }`,

    `終業時間：${
      data.endTime ||
      "未入力"
    }`,

    `作業内容：${
      data.workContent ||
      "未入力"
    }`,

    "",

    "【作業員分類】",

    `潜水作業員：${
      joinWorkerNames(
        data.diving
      )
    }`,

    `陸上作業員：${
      joinWorkerNames(
        data.land
      )
    }`,

    `待機：${
      joinWorkerNames(
        data.standby
      )
    }`,

    `移動：${
      joinWorkerNames(
        data.move
      )
    }`,

    "",

    "【その他】",

    data.otherNote ||
      "未入力"

  ].join("\n");
}


// ==============================
// 送信
// ==============================

async function sendReport() {

  const data =
    getFormData();


  // ============================
  // 必須入力チェック
  // ============================

  if (!data.workDate) {

    alert(
      "日付を入力してください。"
    );

    return;
  }


  if (!data.destinationCompany) {

    alert(
      "行先会社名を入力してください。"
    );

    return;
  }


  if (!data.siteName) {

    alert(
      "現場名を入力してください。"
    );

    return;
  }


  if (!data.startTime) {

    alert(
      "始業時間を入力してください。"
    );

    return;
  }


  if (!data.endTime) {

    alert(
      "終業時間を入力してください。"
    );

    return;
  }


  if (
    getSelectedCount(data) === 0
  ) {

    alert(
      "作業員を1人以上選択してください。"
    );

    return;
  }


  // ============================
  // EmailJS確認
  // ============================

  if (
    typeof emailjs ===
    "undefined"
  ) {

    alert(
      "EmailJSが読み込まれていません。"
    );

    return;
  }


  const originalText =
    els.excelButton.textContent;

  const mailBody =
    buildMailBody(data);


  // ============================
  // EmailJS送信
  // ============================

  try {

    els.excelButton.disabled =
      true;

    els.excelButton.textContent =
      "送信中...";


    await emailjs.send(

      EMAILJS_SERVICE_ID,

      EMAILJS_TEMPLATE_ID,

      {
        message:
          mailBody
      }

    );


    // --------------------------
    // 送信内容を確認欄に表示
    // --------------------------

    els.summaryArea.innerHTML =
      buildSummaryHTML(data);


    // --------------------------
    // 画面中央に
    // 「送信完了」を表示
    // --------------------------

    if (
      typeof window
        .showSendComplete ===
      "function"
    ) {

      window.showSendComplete(
        2500
      );

    } else {

      alert(
        "送信完了"
      );

    }


    // --------------------------
    // 送信完了表示が消えた後
    // 入力欄をクリア
    // --------------------------

    setTimeout(
      () => {

        clearAll();

      },
      2800
    );

  }

  // ============================
  // 送信失敗
  // ============================

  catch (error) {

    console.error(
      "送信エラー:",
      error
    );

    alert(
      "送信に失敗しました。"
    );

  }

  // ============================
  // 最後にボタンを元へ戻す
  // ============================

  finally {

    els.excelButton.disabled =
      false;

    els.excelButton.textContent =
      originalText;

  }
}


// ==============================
// 全クリア
// ==============================

function clearAll() {

  // ----------------------------
  // 基本情報
  // ----------------------------

  els.destinationCompany.value =
    "";

  els.siteName.value =
    "";

  els.meetingPlace.value =
    "";

  els.primeCompany.value =
    "";

  els.startTime.value =
    "";

  els.endTime.value =
    "";

  els.otherNote.value =
    "";


  // ----------------------------
  // 作業内容
  // ----------------------------

  const workContent =
    document.getElementById(
      "work-content"
    );

  if (workContent) {

    workContent.value =
      "";

  }


  // ----------------------------
  // 作業員選択状態を削除
  // ----------------------------

  Object.keys(
    selectedWorkers
  ).forEach((key) => {

    selectedWorkers[
      key
    ].clear();

  });


  // ----------------------------
  // 予備作業員名を削除
  // ----------------------------

  Object.keys(
    customWorkerNames
  ).forEach((key) => {

    customWorkerNames[
      key
    ] = "";

  });


  // ----------------------------
  // 固定作業員ボタン
  // 緑色を解除
  // ----------------------------

  document.querySelectorAll(
    ".worker-button"
  ).forEach((button) => {

    button.classList.remove(
      "active"
    );

  });


  // ----------------------------
  // 予備作業員入力欄を空欄へ
  // ----------------------------

  document.querySelectorAll(
    ".custom-worker-input"
  ).forEach((input) => {

    input.value =
      "";

  });


  // ----------------------------
  // 予備欄の選択表示解除
  // ----------------------------

  document.querySelectorAll(
    ".custom-worker-wrap"
  ).forEach((wrap) => {

    wrap.classList.remove(
      "active"
    );

  });


  // ----------------------------
  // 日付を今日に戻す
  // ----------------------------

  setTodayDate();


  // ----------------------------
  // 確認表示を初期化
  // ----------------------------

  els.summaryArea.textContent =
    "ここに表示";
}


// ==============================
// 時刻を指定単位へ丸める
//
// 初期値
// 300秒 = 5分
// ==============================

function roundTimeStringToStep(
  timeString,
  stepSeconds = 300
) {

  if (!timeString) {
    return "";
  }


  const [
    hours,
    minutes
  ] =
    timeString
      .split(":")
      .map(Number);


  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {

    return timeString;
  }


  const totalSeconds =
    hours * 3600 +
    minutes * 60;


  const steppedSeconds =
    Math.round(
      totalSeconds /
      stepSeconds
    ) *
    stepSeconds;


  const steppedHours =
    Math.floor(
      (
        steppedSeconds %
        86400
      ) /
      3600
    );


  const steppedMinutes =
    Math.floor(
      (
        steppedSeconds %
        3600
      ) /
      60
    );


  return (
    `${String(
      steppedHours
    ).padStart(
      2,
      "0"
    )}:` +

    `${String(
      steppedMinutes
    ).padStart(
      2,
      "0"
    )}`
  );
}


// ==============================
// イベント登録
// ==============================

function bindEvents() {

  // ----------------------------
  // 日付変更
  // ----------------------------

  els.workDate.addEventListener(
    "change",
    updateDatePreview
  );


  // ----------------------------
  // 確認
  // ----------------------------

  els.summaryButton
    .addEventListener(
      "click",
      showSummary
    );


  // ----------------------------
  // クリア
  // ----------------------------

  els.clearButton
    .addEventListener(
      "click",
      clearAll
    );


  // ----------------------------
  // 送信
  // ----------------------------

  els.excelButton
    .addEventListener(
      "click",
      sendReport
    );


  // ============================
  // 始業時間
  // 5分単位
  // ============================

  if (els.startTime) {

    els.startTime.setAttribute(
      "step",
      "300"
    );


    const snapStartTime =
      () => {

        els.startTime.value =
          roundTimeStringToStep(
            els.startTime.value,
            300
          );

      };


    els.startTime.addEventListener(
      "input",
      snapStartTime
    );

    els.startTime.addEventListener(
      "change",
      snapStartTime
    );

    els.startTime.addEventListener(
      "blur",
      snapStartTime
    );

  }


  // ============================
  // 終業時間
  // 5分単位
  // ============================

  if (els.endTime) {

    els.endTime.setAttribute(
      "step",
      "300"
    );


    const snapEndTime =
      () => {

        els.endTime.value =
          roundTimeStringToStep(
            els.endTime.value,
            300
          );

      };


    els.endTime.addEventListener(
      "input",
      snapEndTime
    );

    els.endTime.addEventListener(
      "change",
      snapEndTime
    );

    els.endTime.addEventListener(
      "blur",
      snapEndTime
    );

  }
}


// ==============================
// 初期化
// ==============================

function init() {

  // ----------------------------
  // EmailJS初期化
  // ----------------------------

  if (
    typeof emailjs !==
      "undefined" &&
    EMAILJS_PUBLIC_KEY
  ) {

    emailjs.init({

      publicKey:
        EMAILJS_PUBLIC_KEY

    });

  }


  // ----------------------------
  // 作業員ボタン生成
  // ----------------------------

  createWorkerSections();


  // ----------------------------
  // 今日の日付
  // ----------------------------

  setTodayDate();


  // ----------------------------
  // ボタン等のイベント登録
  // ----------------------------

  bindEvents();

}


// ==============================
// アプリ起動
// ==============================

init();