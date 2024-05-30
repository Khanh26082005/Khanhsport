var currentTime = Math.floor(Date.now() / 1000);

// Số giây trong 30 ngày
var thirtyDaysInSeconds = 30 * 24 * 60 * 60;

// Tính toán thời gian đích 30 ngày sau
var targetTime = currentTime + thirtyDaysInSeconds;

// Khởi tạo SimpleCounter với thời gian đích là 30 ngày sau
new SimpleCounter("countdown4", targetTime, {
  continue: 0,
  format: "{D} {H} {M} {S}",
  lang: {
    d: {
      single: "day",
      plural: "days",
    }, //days
    h: {
      single: "hr",
      plural: "hrs",
    }, //hours
    m: {
      single: "min",
      plural: "min",
    }, //minutes
    s: {
      single: "sec",
      plural: "sec",
    }, //seconds
  },
  formats: {
    full: "<span class='countdown_number' style='color:  '>{number} </span> <span class='countdown_word' style='color:  '>{word}</span> <span class='countdown_separator'>:</span>", //Format for full units representation
    shrt: "<span class='countdown_number' style='color:  '>{number} </span>", //Format for short unit representation
  },
});
