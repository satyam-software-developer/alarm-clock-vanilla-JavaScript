// Selecting DOM elements and get references to HTML elements
const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const alarmContainer = document.querySelector("#alarms-container");
const ringTone = new Audio("./files/ringtone3.mp3");

// Get the current date
const currentDate = new Date();

// Array of week days and months
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Get the week day, month, day, and year
const weekDay = weekDays[currentDate.getDay()];
const month = months[currentDate.getMonth()];
const day = currentDate.getDate();
const year = currentDate.getFullYear();

// Update the HTML elements with the values
document.getElementById("week").textContent = weekDay;
document.getElementById("month").textContent = month;
document.getElementById("date").textContent = day;
document.getElementById("year").textContent = year;

// Adding Hours, Minutes, Seconds in DropDown Menu
window.addEventListener("DOMContentLoaded", (event) => {
  // Populate dropdowns for hours, minutes, and seconds
  dropDownMenu(1, 12, setHours);
  dropDownMenu(0, 59, setMinutes);
  dropDownMenu(0, 59, setSeconds);

  // Update the current time every second
  setInterval(getCurrentTime, 1000);

  // Fetch any saved alarms
  fetchAlarm();
});

// Event Listener added to Set Alarm Button
setAlarmButton.addEventListener("click", getInput);

// Function to update the clock display
function updateClock() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();

  var timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");
}

// Update the clock every second
setInterval(updateClock, 1000);

// Function to populate dropdown menu
function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}

// Function to get the current time
function getCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.innerHTML = time;

  return time;
}


// Function to handle form submission and set alarm
function getInput(e) {
  e.preventDefault(); // Prevent the default form submission behavior

  // Get the selected values from the form inputs
  const hourValue = parseInt(setHours.value); // Convert to integer
  const minuteValue = parseInt(setMinutes.value); // Convert to integer
  const secondValue = parseInt(setSeconds.value); // Convert to integer
  const amPmValue = setAmPm.value;

  // Check if any of the selected values are not valid numbers
  if (isNaN(hourValue) || isNaN(minuteValue) || isNaN(secondValue)) {
    alert("Please select a valid time"); // Alert the user if any value is not a number
    return; // Exit the function
  } else {
    // Call the function to convert the selected values to a valid time format
    const alarmTime = convertToTime(hourValue, minuteValue, secondValue, amPmValue);
    // Call the function to set the alarm with the calculated time
    setAlarm(alarmTime);
  }
}

// Example function to convert selected values to a valid time format
function convertToTime(hour, minute, second, amPm) {
  // Example logic to convert 12-hour format to 24-hour format
  if (amPm === 'PM' && hour !== 12) {
    hour += 12;
  } else if (amPm === 'AM' && hour === 12) {
    hour = 0;
  }
  // Return the formatted time as an object
  return {
    hour: hour,
    minute: minute,
    second: second
  };
}


// Function to convert time to 24-hour format
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

// Function to set alarm
function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      alert("Alarm Ringing");
      ringTone.play();
    }
  }, 1000); // Check every second for the alarm time match

  // Add alarm to DOM
  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

// Function to add alarm to the DOM
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
              `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) =>
    deleteAlarm(e, time, intervalId)
  );

  alarmContainer.prepend(alarm);
}

// Function to check if alarms are saved in Local Storage
function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}

// Function to save alarm to local storage
function saveAlarm(time) {
  const alarms = checkAlarams();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Function to fetch alarms from local storage
function fetchAlarm() {
  const alarms = checkAlarams();

  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

// Function to delete an alarm
function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocal(time);
  alarm.remove();
}

// Function to delete an alarm from local storage
function deleteAlarmFromLocal(time) {
  const alarms = checkAlarams();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}
