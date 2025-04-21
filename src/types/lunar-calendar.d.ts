declare module "lunar-calendar" {
  interface LunarData {
    lunarYear: number;
    lunarMonthName: string;
    lunarDayName: string;
    GanZhiYear: string;
    GanZhiMonth: string;
    GanZhiDay: string;
  }

  export function solarToLunar(year: number, month: number, day: number): LunarData;
} 