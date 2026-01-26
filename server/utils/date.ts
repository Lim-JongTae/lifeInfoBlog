export function getKstMidnight(date = new Date()) {
  // 현재 UTC 시간 → KST(+9시간)으로 보정
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  // KST 자정으로 절단
  kst.setUTCHours(0, 0, 0, 0)
  // 다시 UTC 타임스탬프로 환산(−9시간)
  return new Date(kst.getTime() - 9 * 60 * 60 * 1000)
}
