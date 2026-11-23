// recent7.js：照 rules.md 寫的版本
// 輸入：records＝一串紀錄，每筆像 { log_date: '2026-11-23', minutes: 30 }（minutes 可能是 null）
//       today＝今天的日期，例如 '2026-11-23'
// 輸出：{ minutes: 總共幾分鐘, count: 幾筆 }
// 格式說明在 README.md；要怎麼算看 rules.md。

function recent7(records, today) {
  if (!Array.isArray(records) || !today) {
    return { minutes: 0, count: 0 };
  }

  var parts = today.split('-');
  var todayUtc = Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  var MS_PER_DAY = 24 * 60 * 60 * 1000;

  var minutes = 0;
  var count = 0;

  for (var i = 0; i < records.length; i++) {
    var record = records[i];
    if (!record || typeof record.log_date !== 'string') {
      continue;
    }

    // 規則 3：沒填分鐘（null 或缺少 minutes 欄位為 undefined）時不算
    if (record.minutes === null || record.minutes === undefined) {
      continue;
    }

    // 規則 5 & 規則 6：少於 5 分鐘（包括 0 或負數）不列入計算
    if (record.minutes < 5) {
      continue;
    }

    var rParts = record.log_date.split('-');
    var recordUtc = Date.UTC(parseInt(rParts[0], 10), parseInt(rParts[1], 10) - 1, parseInt(rParts[2], 10));
    var diffDays = Math.round((todayUtc - recordUtc) / MS_PER_DAY);

    // 規則 1 & 規則 2：包含今天往前推 7 天（diffDays 為 0 到 6），晚於今天 (diffDays < 0) 或早於 7 天 (diffDays >= 7) 不算
    if (diffDays >= 0 && diffDays < 7) {
      minutes += record.minutes;
      count += 1;
    }
  }

  return { minutes: minutes, count: count };
}
