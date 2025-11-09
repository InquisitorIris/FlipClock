// generateTimeInfo returns string digits for each place and am/pm string
function generateTimeInfo() {
  const now = new Date();
  const rawHours = now.getHours(); // 0 - 23
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const ampm = rawHours >= 12 ? "PM" : "AM";

  // convert to 12-hour number
  let hours12 = rawHours % 12;
  hours12 = hours12 === 0 ? 12 : hours12; // map 0 -> 12

  // format two-digit strings
  const hh = String(hours12).padStart(2, "0"); // "01".."12"
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return {
    hours: {
      first: hh.charAt(0),
      last: hh.charAt(1),
    },
    minutes: {
      first: mm.charAt(0),
      last: mm.charAt(1),
    },
    seconds: {
      first: ss.charAt(0),
      last: ss.charAt(1),
    },
    ampm,
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const flipClock = document.querySelector(".flip-clock");
  const ampmEl = flipClock.querySelector(".ampm");

  const hoursFirst = createHandles(flipClock.querySelector(".hours-first"));
  const hoursLast = createHandles(flipClock.querySelector(".hours-last"));
  const minutesFirst = createHandles(flipClock.querySelector(".minutes-first"));
  const minutesLast = createHandles(flipClock.querySelector(".minutes-last"));
  const secondsFirst = createHandles(flipClock.querySelector(".seconds-first"));
  const secondsLast = createHandles(flipClock.querySelector(".seconds-last"));

  // initialize with current time
  const initial = generateTimeInfo();
  setInitialValues(hoursFirst, initial.hours.first);
  setInitialValues(hoursLast, initial.hours.last);
  setInitialValues(minutesFirst, initial.minutes.first);
  setInitialValues(minutesLast, initial.minutes.last);
  setInitialValues(secondsFirst, initial.seconds.first);
  setInitialValues(secondsLast, initial.seconds.last);
  ampmEl.textContent = initial.ampm;

  // update every second
  setInterval(() => {
    const t = generateTimeInfo();
    flipDigit(secondsLast, t.seconds.last);
    flipDigit(secondsFirst, t.seconds.first);
    flipDigit(minutesLast, t.minutes.last);
    flipDigit(minutesFirst, t.minutes.first);
    flipDigit(hoursLast, t.hours.last);
    flipDigit(hoursFirst, t.hours.first);

    // update AM/PM text (no flip tile for AM/PM)
    ampmEl.textContent = t.ampm;
  }, 1000);
});

function setInitialValues(flipElement, initialChar) {
  const {
    flipperTop,
    flipperBottom,
    flipDisplayBottom,
    flipDisplayTop,
    flipHiddenInput,
  } = flipElement;

  // store values as strings
  flipperTop.textContent = initialChar;
  flipperBottom.textContent = initialChar;
  flipDisplayBottom.textContent = initialChar;
  flipDisplayTop.textContent = initialChar;
  flipHiddenInput.value = initialChar;
}

function createHandles(flipElement) {
  return {
    flipElement,
    flipperTop: flipElement.querySelector(".flipper-top"),
    flipperBottom: flipElement.querySelector(".flipper-bottom"),
    flipDisplayTop: flipElement.querySelector(".flip-display-top"),
    flipDisplayBottom: flipElement.querySelector(".flip-display-bottom"),
    flipHiddenInput: flipElement.querySelector("input[type='hidden']"),
  };
}

function flipDigit(flipHandles, newChar) {
  const {
    flipElement,
    flipperTop,
    flipperBottom,
    flipDisplayBottom,
    flipDisplayTop,
    flipHiddenInput,
  } = flipHandles;

  const current = flipHiddenInput.value; // string (may be "")
  if (current === newChar) return;

  // set previous (top flipper & bottom display) to current
  const setPrevious = (v) => {
    flipperTop.textContent = v;
    flipDisplayBottom.textContent = v;
  };
  // set after values (top display & bottom flipper) to new value
  const setAfter = (v) => {
    flipDisplayTop.textContent = v;
    flipperBottom.textContent = v;
  };

  // if current is empty (first run), show newChar as both previous and after gracefully
  setPrevious(current || newChar);
  flipHiddenInput.value = newChar;
  setAfter(newChar);

  // trigger animation
  flipElement.classList.add("play");

  // when the bottom flipper animation ends, finalize and remove play class
  flipperBottom.addEventListener(
    "animationend",
    () => {
      setPrevious(newChar);
      flipElement.classList.remove("play");
    },
    { once: true }
  );
}
