const ANNUAL_LEAVE_DAYS = 14;
const MONTHS_IN_YEAR = 12;

export function calculateLeaveQuota(joiningDate: string | Date): number {
  const date = typeof joiningDate === 'string' ? new Date(joiningDate) : joiningDate;

  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // JS-এ মাস 0 থেকে শুরু হয় (Jan=0), তাই +1 করছি

  // ১৫ তারিখের আগে/সমান হলে joining month-ই গণনায় ধরা হবে
  // ১৫ তারিখের পরে হলে পরের মাস থেকে গণনা শুরু হবে
  const startMonth = day <= 15 ? month : month + 1;

  const remainingMonths = Math.max(0, MONTHS_IN_YEAR - startMonth + 1);

  return Math.round((ANNUAL_LEAVE_DAYS * remainingMonths) / MONTHS_IN_YEAR);
}