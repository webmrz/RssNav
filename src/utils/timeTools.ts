import LunarCalendar from "lunar-calendar";

interface TimeData {
  year: number;
  month: number;
  day: string;
  hour: string | number;
  minute: string;
  second: string;
  weekday: string;
  amPm: string;
  lunar: {
    data: LunarCalendar.LunarData;
    year: number;
    month: string;
    day: string;
    GanZhiYear: string;
    GanZhiMonth: string;
    GanZhiDay: string;
    text: string;
  };
}

/**
 * 获取当前时间
 * @param {boolean} ShowZero - 是否显示前导零
 * @param {boolean} Use12Hour - 是否使用12小时制
 * @returns {TimeData} 时间对象
 */
export const getCurrentTime = (ShowZero = true, Use12Hour = false): Partial<TimeData> => {
  try {
    const time = new Date();
    // 格式化
    const formatTime = (value: number): string => (value < 10 ? "0" + value : value.toString());
    const format12Hour = (hour: number): number => (hour % 12 === 0 ? 12 : hour % 12);
    const getAmPm = (hour: number): string => (hour >= 12 ? "PM" : "AM");
    // 处理时间
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = formatTime(time.getDate());
    // 处理时钟
    const hours = time.getHours();
    let hour: string | number = ShowZero ? formatTime(hours) : hours;
    let amPm = "";
    if (Use12Hour) {
      hour = format12Hour(hours);
      amPm = getAmPm(hours);
    }
    const minute = formatTime(time.getMinutes());
    const second = formatTime(time.getSeconds());
    const weekdayArr = ["日", "一", "二", "三", "四", "五", "六"];
    const weekday = "周" + weekdayArr[time.getDay()];
    // 获取农历
    const lunar = LunarCalendar.solarToLunar(
      time.getFullYear(),
      time.getMonth() + 1,
      time.getDate(),
    );
    // 返回时间
    const currentTime: TimeData = {
      year,
      month,
      day,
      hour,
      minute,
      second,
      weekday,
      amPm,
      lunar: {
        data: lunar,
        year: lunar.lunarYear,
        month: lunar.lunarMonthName,
        day: lunar.lunarDayName,
        GanZhiYear: lunar.GanZhiYear,
        GanZhiMonth: lunar.GanZhiMonth,
        GanZhiDay: lunar.GanZhiDay,
        text: lunar.lunarMonthName + lunar.lunarDayName,
      },
    };
    return currentTime;
  } catch (error) {
    console.error("时间获取出错：" + error);
    return {};
  }
};

/**
 * 根据实时时间返回不同的问候语
 * @returns {string} 问候语
 */
export const getGreeting = (): string => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting = "";
  if (currentHour >= 6 && currentHour < 9) {
    greeting = "早上好";
  } else if (currentHour >= 9 && currentHour < 12) {
    greeting = "上午好";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "下午好";
  } else if (currentHour >= 18 && currentHour < 20) {
    greeting = "傍晚好";
  } else if (currentHour >= 20 && currentHour < 24) {
    greeting = "晚上好";
  } else if (currentHour >= 4 && currentHour < 6) {
    greeting = "凌晨好";
  } else {
    greeting = "夜深了";
  }
  return greeting;
}; 