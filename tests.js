// tests.js：測試都寫在這個檔。一條測試呼叫一次 addCase，格式見 README.md。
// 依據 rules.md 的規則撰寫測試案例。

// ----------------------------------------------------
// 規則 1：日期範圍包含今天在內往前推 7 天（以 2026-11-23 為例，就是 2026-11-17 到 2026-11-23），
// 早於這 7 天的（如 11/16）不算。同一天若有多筆有效紀錄，每筆獨立計算，分鐘數與筆數皆累加。
// ----------------------------------------------------

addCase({
  name: '規則 1：範圍內的正常單筆紀錄（包含今天）',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 30 }
  ],
  expect: { minutes: 30, count: 1 }
});

addCase({
  name: '規則 1：剛好在第 7 天邊界（2026-11-17）算入',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-17', minutes: 20 }
  ],
  expect: { minutes: 20, count: 1 }
});

addCase({
  name: '規則 1：早於 7 天的紀錄（2026-11-16）不算',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-16', minutes: 50 }
  ],
  expect: { minutes: 0, count: 0 }
});

addCase({
  name: '規則 1：同一天有多筆有效紀錄時，每筆獨立累加分鐘數與筆數',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-20', minutes: 30 },
    { log_date: '2026-11-20', minutes: 40 }
  ],
  expect: { minutes: 70, count: 2 }
});

addCase({
  name: '規則 1：records 陣列日期未排序（亂序）也能正確計算最近 7 天',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-18', minutes: 25 },
    { log_date: '2026-11-23', minutes: 35 },
    { log_date: '2026-11-15', minutes: 50 }, // 早於7天
    { log_date: '2026-11-20', minutes: 15 }
  ],
  expect: { minutes: 75, count: 3 }
});

addCase({
  name: '規則 1：單筆極大值（如 2000 分鐘）不設上限照實累加',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-22', minutes: 2000 }
  ],
  expect: { minutes: 2000, count: 1 }
});

// ----------------------------------------------------
// 規則 2：未來的日期：日期晚於今天的紀錄不算。
// ----------------------------------------------------

addCase({
  name: '規則 2：未來的日期（明天 2026-11-24）不計入',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-24', minutes: 60 }
  ],
  expect: { minutes: 0, count: 0 }
});

addCase({
  name: '規則 2：混合今天與未來的紀錄，只計算今天及範圍內的紀錄',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 30 },
    { log_date: '2026-11-25', minutes: 45 }
  ],
  expect: { minutes: 30, count: 1 }
});

// ----------------------------------------------------
// 規則 3：沒填分鐘：分鐘數未填寫（null 或缺少 minutes 欄位為 undefined）時，不算分鐘數，也不計入筆數。
// ----------------------------------------------------

addCase({
  name: '規則 3：minutes 為 null 時不算分鐘數也不計入筆數',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: null }
  ],
  expect: { minutes: 0, count: 0 }
});

addCase({
  name: '規則 3：缺少 minutes 欄位（undefined）時不算分鐘數也不計入筆數',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-22' }
  ],
  expect: { minutes: 0, count: 0 }
});

addCase({
  name: '規則 3：混合正常填寫與未填寫，只計入正常填寫的紀錄',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 30 },
    { log_date: '2026-11-22', minutes: null },
    { log_date: '2026-11-21' }
  ],
  expect: { minutes: 30, count: 1 }
});

// ----------------------------------------------------
// 規則 4：完全沒紀錄：傳入空陣列 [] 或沒有任何符合條件的紀錄時，回傳 0 分鐘、0 筆。
// ----------------------------------------------------

addCase({
  name: '規則 4：傳入空陣列 [] 時回傳 0 分鐘 0 筆',
  today: '2026-11-23',
  records: [],
  expect: { minutes: 0, count: 0 }
});

addCase({
  name: '規則 4：所有紀錄皆不符合條件時（均早於 7 天），回傳 0 分鐘 0 筆',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-10', minutes: 60 }
  ],
  expect: { minutes: 0, count: 0 }
});

// ----------------------------------------------------
// 規則 5：單筆學習時間少於 5 分鐘（即小於 5 分鐘，剛好 5 分鐘算有效）的不列入計算，不算分鐘數，也不計入筆數。
// ----------------------------------------------------

addCase({
  name: '規則 5：剛好 5 分鐘算有效紀錄（計入 5 分鐘與 1 筆）',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 5 }
  ],
  expect: { minutes: 5, count: 1 }
});

addCase({
  name: '規則 5：少於 5 分鐘（如 4 分鐘）不算分鐘數也不計入筆數',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 4 }
  ],
  expect: { minutes: 0, count: 0 }
});

addCase({
  name: '規則 5：少於 5 分鐘（如 1 分鐘）不列入計算',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-22', minutes: 1 }
  ],
  expect: { minutes: 0, count: 0 }
});

// ----------------------------------------------------
// 規則 6：學習時間為負數或 0 分鐘時，不算分鐘數，也不計入筆數（併入少於 5 分鐘的條件一起排除）。
// ----------------------------------------------------

addCase({
  name: '規則 6：學習時間為 0 分鐘時不算分鐘數也不計入筆數',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 0 }
  ],
  expect: { minutes: 0, count: 0 }
});

addCase({
  name: '規則 6：學習時間為負數（如 -10 分鐘）時不算分鐘數也不計入筆數',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: -10 }
  ],
  expect: { minutes: 0, count: 0 }
});


// ----------------------------------------------------
// 規則 7：多回報一個欄位 days，計算這 7 天內「有至少一筆有效學習紀錄」的不重複天數；
// 若該天只有無效紀錄（如未填分鐘或少於 5 分鐘），則該天不計入 days，沒有任何有效紀錄時回傳 0。
// ----------------------------------------------------

addCase({
  name: '規則 7：同一天有多筆有效紀錄，days 只算 1 天',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-20', minutes: 30 },
    { log_date: '2026-11-20', minutes: 40 }
  ],
  expect: { days: 1 }
});

addCase({
  name: '規則 7：只有無效紀錄（未填分鐘或少於 5 分鐘）的天數不計入 days',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-21', minutes: null },
    { log_date: '2026-11-22', minutes: 4 },
    { log_date: '2026-11-23', minutes: 0 }
  ],
  expect: { days: 0 }
});

addCase({
  name: '規則 7：沒有任何紀錄（空陣列）時，days 回傳 0',
  today: '2026-11-23',
  records: [],
  expect: { days: 0 }
});

addCase({
  name: '規則 7：跨多天有效紀錄與無效紀錄混合，正確計算不重複有效天數',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-21', minutes: 30 },
    { log_date: '2026-11-22', minutes: 20 },
    { log_date: '2026-11-22', minutes: 15 },
    { log_date: '2026-11-23', minutes: 3 }
  ],
  expect: { days: 2 }
});
