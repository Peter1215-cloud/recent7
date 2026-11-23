// recent7-quick.js：對照用。只用一句話請 AI 寫的版本放這裡。
// 函式名稱一樣叫 recent7，輸入、輸出的格式跟 recent7.js 一樣（見 README.md）。

function recent7(records, today) {
  if (!Array.isArray(records) || !today) {
    return { minutes: 0, count: 0 };
  }

  const [tYear, tMonth, tDay] = today.split('-').map(Number);
  const todayUtc = Date.UTC(tYear, tMonth - 1, tDay);
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  let totalMinutes = 0;
  let totalCount = 0;

  for (const record of records) {
    if (!record || typeof record.log_date !== 'string') {
      continue;
    }

    const [rYear, rMonth, rDay] = record.log_date.split('-').map(Number);
    const recordUtc = Date.UTC(rYear, rMonth - 1, rDay);
    const diffDays = Math.round((todayUtc - recordUtc) / MS_PER_DAY);

    // 最近 7 天：包含今天及過去 6 天 (0 <= diffDays < 7)
    if (diffDays >= 0 && diffDays < 7) {
      totalCount += 1;
      if (record.minutes != null) {
        const mins = Number(record.minutes);
        if (!isNaN(mins)) {
          totalMinutes += mins;
        }
      }
    }
  }

  return { minutes: totalMinutes, count: totalCount };
}
