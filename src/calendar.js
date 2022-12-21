import $ from "jquery";
import { serverAddress } from "./constants";

var events;
fetch(serverAddress + "/event/getEventsByMonth/12", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    token: localStorage.getItem("token"),
  },
})
  .then((response) => {
    if (response.ok) {
      response.text().then((text)=>{
      events = JSON.parse(text);
      events.forEach(element => {
        
            console.log(element);
            console.log(element.title);
          
      });
      });
    } else {
      alert(response.message);
    }
  }
   );
const initCalendar = () => {
  //Set today as default day on event form
  var today = new Date();
  var month = 12;
    

  $("#date").attr("value", today.toISOString().substring(0, 10));

  // Get the modal
  let modal = $("#test-modal");

  // Get the button that opens the modal
  let button = $("#modal-button");

  // When the user clicks the button, open the modal
  button.on("click", () => {
    modal.css("display", "block");
  });

  for (let i = 0; i < 5; i++) {
    $("table").append(
      `<tr>
            <td id="${i * 7}"></td>
            <td id="${i * 7 + 1}"></td>
            <td id="${i * 7 + 2}"></td>
            <td id="${i * 7 + 3}"></td>
            <td id="${i * 7 + 4}"></td>
            <td id="${i * 7 + 5}"></td>
            <td id="${i * 7 + 6}"></td>
        </tr>`
    );
  }

  let days = getDaysInMonthUTC(10, 2022);

  let offset = days[0].getDay();

  console.log(offset);

  for (let i = 0; i < offset; i++) {
    $(`#${i}`).append(
      `<div class="card" style="width: 12rem; height: 18rem;">
                <div class="card-body"></div>
            </div>`
    );
  }

  for (let i in days) {
    $(`#${parseInt(i) + offset}`).append(cardElement(days[i]));
  }
};

const cardElement = (day) => {
  var htmlString=`<div class="card" style="width: 12rem; height: 18rem;">
  <div class="card-body">
      <h5 class="card-title">${day.getUTCDate()}</h5>
      <p class="card-text">`;
  events.forEach(element => {
    var date = new Date(element.dateTime).getDate();
    if(date==day.getUTCDate()){
      htmlString+=`<button id="event${element.id}">${element.title}</button><br>`;}
  });
  htmlString+=`</p></div></div>`;
  return htmlString;
};

const getDaysInMonthUTC = (month, year) => {
  var date = new Date(Date.UTC(year, month, 1));
  var days = [];
  while (date.getUTCMonth() === month) {
    days.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return days;
};

const initCreateEvent = () => {
  $("#createEventBtn").on("click", function (event) {
    event.preventDefault();
    const calendarEvent = {
      title: $("#title").val(),
      date: $("#date").val(),
      time: $("#time").val(),
      duration: $("#duration").val(),
      location: $("#location").val(),
      description: $("#description").val(),
      isPrivate: $("#isPrivate").is(":checked") ? true : false,
    };
    console.log(calendarEvent);
    createCalendarEvent(calendarEvent);
  });
};

export { initCalendar, initCreateEvent };
