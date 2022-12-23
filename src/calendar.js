import $ from "jquery";
import { createCalendarEvent } from "./create_event_rest";
import { updateCalendarEvent } from "./event";
import { serverAddress } from "./constants";
import { urlLocationHandler } from "./router";
import { DateSingleton } from "./date";

let events;

const initCalendar = async () => {
  let id;

  //Set today as default day on event form
  var today = new Date();
  var month = 12;

  await fetch(serverAddress + "/event/getEventsByMonth/12", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
    },
  }).then((response) => {
    if (response.ok) {
      response.text().then((text) => {
        events = JSON.parse(text);
      });
    } else {
      alert(response.message);
    }
  });
  $("#date").attr("value", today.toISOString().substring(0, 10));

  // Get the modal
  let modal = $("#test-modal");

  // Get the button that opens the modal
  let button = $("#modal-button");

  // When the user clicks the button, open the modal
  button.on("click", () => {
    modal.show();
  });

  $(".closeModalBtn").on("click", () => {
    modal.hide();
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

  $("#month").text(DateSingleton.getInstance().getMonth() + 1);
  $("#year").text(DateSingleton.getInstance().getYear());

  $("#left-button").on("click", async () => {
    DateSingleton.getInstance().setMonth(
      DateSingleton.getInstance().getMonth() - 1
    );
    window.history.pushState({}, "", "/calendar");
    await urlLocationHandler();
  });

  $("#right-button").on("click", async () => {
    DateSingleton.getInstance().setMonth(
      DateSingleton.getInstance().getMonth() + 1
    );
    window.history.pushState({}, "", "/calendar");
    await urlLocationHandler();
  });

  let days = getDaysInMonthUTC(
    DateSingleton.getInstance().getMonth(),
    DateSingleton.getInstance().getYear()
  );

  let offset = days[0].getDay();

  console.log(offset);

  const emptyCardElement = () => {
    return `<div class="card" style="width: 12rem; height: 18rem;">
              <div class="card-body"></div>
            </div>`;
  };

  for (let i = 0; i < offset; i++) {
    $(`#${i}`).append(emptyCardElement());
  }

  for (let i in days) {
    $(`#${parseInt(i) + offset}`).append(cardElement(days[i]));
  }

  $("#update-event-button").on("click", () => {
    let updateEventData = collectUpdateEventData(id);
    console.log(updateEventData);
    updateCalendarEvent(updateEventData);
  });

  let updateModal = $("#update-modal");

  $(".closeModalBtn").on("click", () => {
    updateModal.hide();
  });

  for (let event of events) {
    $(`#event${event.id}`).on("click", () => {
      updateModal.show();
      id = event.id;
    });
  }
};

const cardElement = (day) => {
  let htmlString = `<div class="card" style="width: 12rem; height: 18rem;">
    <div class="card-body">
    <h5 class="card-title">${day.getUTCDate()}</h5>
    <p class="card-text">`;
  if (events != undefined) {
    events.forEach((element) => {
      let date = new Date(element.dateTime);
      if (date.getDate() == day.getUTCDate()) {
        //  && date.getMonth() == day.getUTCMonth() && date.getYear() == day.getYear()
        htmlString += `<button id="event${element.id}">${element.title}</button><br>`;
      }
    });
  }
  htmlString += `</p>
    </div>
  </div>`;

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

// collects the data from input fields and wraps them into a dictionary
const collectUpdateEventData = (id) => {
  const updateEventData = {
    id: id,
    title: $("#update-title").val(),
    date: $("#update-date").val(),
    time: $("#update-time").val(),
    duration: $("#update-duration").val(),
    location: $("#update-location").val(),
    description: $("#update-description").val(),
    isPrivate: $("#update-isPrivate").is(":checked") ? true : false,
  };
  return updateEventData;
};

export { initCalendar, initCreateEvent };
