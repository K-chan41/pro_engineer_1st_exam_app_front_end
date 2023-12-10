export function convertToJapaneseEra(year) {
  if (year >= 2019) {
    return `令和${year - 2018}年`;
  } else if (year >= 1989) {
    return `平成${year - 1988}年`;
  } // その他の元号に対する処理を追加
  return `${year}年`;
}
