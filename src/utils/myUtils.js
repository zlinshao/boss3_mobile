class myUtils {
  // 构造函数
  constructor(x, y) {
    //...
  }

  // 天数计算
  static countDay(now, day) {
    let format = new Date(now);
    let newDate = this.dateAdd("dd", day, format);
    return this.formatDate(newDate);
  }

  // 日期加减计算
  static dateAdd(interval, num, date) {
    num = Number(num);
    switch (interval) {
      case "yy":
        date.setFullYear(date.getFullYear() + num);
        return date;
      case "mm":
        date.setMonth(date.getMonth() + num);
        return date;
      case "dd"   :
        date.setDate(date.getDate() + num);
        return date;
      default:
        date.setDate(date.getDate() + num);
        return date;
    }
  };

  // 格式化日期 yyyy-MM-dd
  static formatDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();

    let mm = month.toString();  //月
    let dd = day.toString();    //日
    let hh = h.toString();      //时
    let md = m.toString();      //分
    let ss = s.toString();      //秒
    mm = mm[1] ? mm : '0' + mm;
    dd = dd[1] ? dd : '0' + dd;
    if (mm === '00') {
      year = year - 1;
      mm = '12';
    }
    return year + '-' + mm + '-' + dd;
  };
}

export default myUtils
