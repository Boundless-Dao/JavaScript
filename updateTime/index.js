/**
 * IM消息时间处理
 * time:时间格式'2020-01-15'或'2020/01/15'或'2020-01-15 15:00'或'2020/01/15 15:00'
 * yStr:日期拼接格式，默认'/'拼接
 * isHours:是否显示时分，默认不显示
 */
const upDateTimeShow = (time, yStr = "/", isHours = false) => {
  time = time.replace(/-/g, "/");
  const JUST_NOW = 3000; //3s内
  const IN_SECOND = 1000 * 60; //一分钟
  const IN_MINUTE = 1000 * 60 * 60; //一小时
  const IN_HOUR = 1000 * 60 * 60 * 12; //12小时
  const IN_DAY = 1000 * 60 * 60 * 24 * 1; //24小时
  const IN_MONTH = 1000 * 60 * 60 * 24 * 30; //1个月
  const IN_YEAR = 1000 * 60 * 60 * 24 * 30 * 12; //1年

  let realTime = "", //最终返回的时间
    localTime = new Date(), //当前时间 //Mon Dec 06 2021 21:32:28 GMT+0800 (中国标准时间)
    localDay =
      localTime.getDate() < 10
        ? "0" + localTime.getDate()
        : localTime.getDate(), //当天系统天数,就是几号
    localMsec = new Date().getTime(), //当前时间 //时间戳
    createTime = new Date(time), //传入的时间
    createMsec = new Date(time).getTime(), //传入的时间 //时间戳
    diff = localMsec - createMsec, //计算出来得时间戳
    list = new Date(time).toString().split(" "), //将后台返回得时间分割,用于取年月日时分
    year = list[3], //年
    month = getNumberMonth(list[1]), //月
    day = list[2], //日
    hhmmss = list[4].split(":"), //[时：分：秒]
    hourSec = hhmmss[0] + ":" + hhmmss[1]; //时分
  if (diff <= IN_SECOND) {
    //小于1分钟，显示刚刚
    return "刚刚";
  } else if (diff <= IN_MINUTE && diff > IN_SECOND) {
    //小于1小时,显示几分钟前
    return parseInt(diff / IN_SECOND) + "分钟前";
  } else if (diff <= IN_DAY && localDay == day) {
    //当天小于1天,显示时分
    return (realTime = hourSec);
  } else if (diff <= IN_DAY && localDay - day == 1) {
    //昨天当天24小时内,显示月日
    return (realTime = month + yStr + day);
  } else if (diff > IN_DAY && diff <= IN_DAY * 2 && localDay - day <= 1) {
    //大于1天&小于2天,显示昨天
    return "昨天";
  } else if (diff < IN_DAY * 7) {
    //本周时间内小于7天,显示周几+时间
    const t = createTime.toString().slice(0, 3);
    switch (t) {
      case "Mon":
        return "周一 ";
      case "Tue":
        return "周二 ";
      case "Wed":
        return "周三 ";
      case "Thu":
        return "周四 ";
      case "Fri":
        return "周五 ";
      case "Sat":
        return "周六 ";
      case "Sun":
        return "周日 ";
    }
  } else if (diff < IN_YEAR) {
    //小于1年,显示月日
    if (isHours) {
      //显示时分
      realTime = month + yStr + day + " " + hourSec;
    } else {
      //不显示时分
      realTime = month + yStr + day;
    }
    return realTime;
  } else if (diff > IN_YEAR) {
    //大于一年,显示年月日
    return (realTime = year + yStr + month + yStr + day);
  }
};
/**
 * 月份转化
 */
const getNumberMonth = (month) => {
  switch (month) {
    case "Jan":
      return "01";
    case "Feb":
      return "02";
    case "Mar":
      return "03";
    case "Apr":
      return "04";
    case "May":
      return "05";
    case "Jun":
      return "06";
    case "Jul":
      return "07";
    case "Aug":
      return "08";
    case "Sep":
      return "09";
    case "Oct":
      return "10";
    case "Nov":
      return "11";
    case "Dec":
      return "12";
  }
};
/**
 * 判断两个日期是否为同一周
 *  因为1970年1月1 是周4   所以（天数+4）/7 取整 就是周数  如果相同就是同一周反之就不是
经过测试,是以星期一作为每周的第一天的
 */
const isSameWeek = (now) => {
  let oneDayTime = 1000 * 60 * 60 * 24,
    old_count = parseInt(new Date().getTime() / oneDayTime),
    now_other = parseInt(new Date(now).getTime() / oneDayTime);
  // console.log('old周', old_count, 'now周', now_other)
  return parseInt((old_count + 4) / 7) == parseInt((now_other + 4) / 7);
};

module.exports = {
  upDateTimeShow,
  getNumberMonth,
  isSameWeek,
};
