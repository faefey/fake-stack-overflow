/**
 * Formats given time as a string indicating how long ago the time was.
 * @param {*} t Time in milliseconds since midnight, January 1, 1970.
 * @returns A string indicating the amount of time since the given time.
 */
export function formatTime(t) {
  t = new Date(t);
  let time = (new Date()) - t;

  if(time < 24*60*60*1000) {
    if(time < 60*1000)
      time = Math.floor(time/1000) + " second" + (Math.floor(time/1000)===1?"":"s") + " ago";
    else if(time < 60*60*1000)
      time = Math.floor(time/60/1000) + " minute" + (Math.floor(time/60/1000)===1?"":"s") + " ago";
    else if(time < 24*60*60*1000)
      time = Math.floor(time/60/60/1000) + " hour" + (Math.floor(time/60/60/1000)===1?"":"s") + " ago";
  }
  else if(time < 365*24*60*60*1000)
    time = t.toDateString().substring(4,10) + " at " + t.toTimeString().substring(0,5);
  else
    time = t.toDateString().substring(4,10) + ", " + t.getFullYear() + " at " + t.toTimeString().substring(0,5);

  return time;
}

/**
 * Sorts questions by newest.
 * @param {*} questions Questions to be sorted.
 * @returns Sorted questions.
 */
export function sortByNewest(questions) {
  questions = [...questions];
  questions.sort((a, b) => Date.parse(b.ask_date_time) - Date.parse(a.ask_date_time));
  return questions;
}

/**
 * Sorts questions by active.
 * @param {*} questions Questions to be sorted.
 * @returns Sorted questions.
 */
export function sortByActive(questions) {
  questions = [...questions];

  questions.sort((a, b) => {
    a.answers.sort((c, d) => Date.parse(d.ans_date_time) - Date.parse(c.ans_date_time));
    b.answers.sort((c, d) => Date.parse(d.ans_date_time) - Date.parse(c.ans_date_time));

    if(a.answers.length === 0 && b.answers.length === 0)
      return 0;
    else if(a.answers.length === 0 && b.answers.length > 0)
      return 1;
    else if(a.answers.length > 0 && b.answers.length === 0)
      return -1;
    else
      return Date.parse(b.answers[0].ans_date_time) - Date.parse(a.answers[0].ans_date_time);
  });

  return questions;
}

/**
 * Sorts questions by unanswered.
 * @param {*} questions Questions to be sorted.
 * @returns Sorted questions.
 */
export function sortByUnanswered(questions) {
  return questions.filter(a => a.answers.length === 0).sort((a, b) => Date.parse(b.ask_date_time) - Date.parse(a.ask_date_time));
}
