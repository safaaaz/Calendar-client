import $ from "jquery";
import { serverAddress } from "./constants";
import { updateEvent, getEvent } from "./eventApi";
import { DateSingleton } from "./dateSingleton";
import { initUpdateEventModal } from "./modal";
import {stompClient} from "./notifications";

let myEvents;

const initGrid = async (sharedEventsMap) => {
  myEvents = await fetchMyEvents();

  initHtmlTable();

  injectCards();

  placeMyEvents(myEvents);

  placeSharedEvents(sharedEventsMap);

  activateEvents(myEvents, sharedEventsMap);

};

const fetchMyEvents = async () => {
  let events;

  await fetch(
    serverAddress +
      `/event/myEventsByMonth/${DateSingleton.getInstance().getMonth() + 1}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    }
  )
    .then((response) => {
      return response.status == 200 ? response.json() : null;
    })
    .then((data) => {
      events = data;
    });

  return events;
};

const initHtmlTable = () => {
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
};

const injectCards = () => {
  // that way we know, which cards can be empty
  let days = getDaysInMonthUTC(
    DateSingleton.getInstance().getMonth(),
    DateSingleton.getInstance().getYear()
  );

  let offset = days[0].getDay();

  for (let i = 0; i < offset; i++) {
    $(`#${i}`).append(emptyCardElement());
  }

  for (let i in days) {
    $(`#${parseInt(i) + offset}`).append(cardElement(days[i]));
  }
};
const placeMyEvents = (myEvents) => {
  // add my own events
  console.log("Placing my events: ", myEvents);
  for (let event of myEvents) {
    let dateStamp = event.dateTime.split("T")[0];
    $(`#${dateStamp}`).append(
      `<button id="event${event.id}" class="btn btn-primary" eventId="${event.id}">${event.title}</button><br>`
    );
  }
};

const placeSharedEvents = (sharedEventsMap) => {
  let colorArray = ["secondary", "success", "danger", "info", "dark"];

  for (let user in sharedEventsMap) {
    let color = colorArray[Math.floor(Math.random() * 5)];
    let sharedEvents = sharedEventsMap[user];

    for (let event of sharedEvents) {
      let dateStamp = event.dateTime.split("T")[0];
      $(`#${dateStamp}`).append(
        `<button id="event${event.id}" class="btn btn-${color}" eventId="${event.id}">${event.title}</button><br>`
      );
    }
  }
};

const initInviteGuestBtn = (eventId) => {
  $("#invite-guest-btn").on("click", () => {
    let email = $("#invite-guest").val();
    fetch(serverAddress + "/event/inviteGuest/", {
      method: "POST",
      body: JSON.stringify({ email: email }),
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        eventId: eventId,
      },
    })
      .then((response) => {
        console.log(response.status);
        return Promise.all([response.status, response.json()]);
      })
      .then(([status, body]) => {
        console.log(status, body);
        if (status == 200) {
          stompClient.send("/app/inviteGuest/", [],JSON.stringify({
            name: body.name,
            email: body.email,
            eventId: body.eventId,
        }));
          alert(`User ${body.email} invited successfully!`);
        } else {
          alert(body.message);
        }
      });
  });
};

const makeAdmin = async (eventId, userEmail) => {
  var success = false;
  await fetch(serverAddress + "/event/makeAdmin/", {
    method: "POST",
    headers: {
      token: localStorage.getItem("token"),
      "Content-Type": "application/json",
      eventId: eventId,
    },
    body: JSON.stringify({
      email: userEmail,
    }),
  })
    .then((response) => {
      console.log(response.status);
      return Promise.all([response.status, response.json()]);
    })
    .then(([status, body]) => {
      console.log(status, body);
      if (status == 200) {
        console.log(body);
        alert(`admin added: ${body.email}`);
      } else {
        alert(body.message);
      }
    });
  // .then((response) => {
  //   if (!response.status == 200) {
  //     alert(response.message);
  //     return;
  //   }
  //   return response.json();
  // })
  // .then((response) => {
  //   console.log("make admin res:", res);
  //   success = true;
  // });
  return success;
};

const guestsElements = async (roles, statuses, eventId) => {
  console.log("arrive to guest elements");
  //console.log(guests.data);
  const list = document.createDocumentFragment();
  let li;
  for (let i in roles) {
    li = document.createElement(`li`);
    let div = document.createElement(`div`);
    let email = document.createElement(`span`);
    email.innerHTML = `${roles[i].user.email}`;
    let status = document.createElement("span");
    status.innerHTML = `${statuses[i].status}   `;
    console.log(statuses[i].status);
    switch (statuses[i].status) {
      case "PENDING":
        status.setAttribute("class", "badge rounded-pill bg-warning text-dark");
        break;
      case "APPROVED":
        status.setAttribute("class", "badge rounded-pill bg-success");
        break;
      case "TENTATIVE":
        status.setAttribute("class", "badge rounded-pill bg-secondary");
        break;
      case "REJECTED":
        status.setAttribute("class", "badge rounded-pill bg-danger");
        break;
    }

    div.appendChild(email);
    if (roles[i].role == "GUEST") {
      let button = document.createElement(`button`);
      button.innerHTML = `make admin`;
      button.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("make admin clicked!!");
        makeAdmin(eventId, `${roles[i].user.email}`);
        updateModal.hide();
        updateModal.show();
        // window.history.pushState({}, "", "/calendar");
        // urlLocationHandler();
      });
      div.appendChild(button);
    } else {
      let admin = document.createElement("span");
      admin.setAttribute("class", "badge bg-secondary");
      admin.innerHTML = `admin`;
      div.appendChild(admin);
    }
    div.appendChild(status);
    li.appendChild(div);
    console.log(roles[i].user.email, roles[i].role);
    console.log(statuses[i].user.email, statuses[i].status);
    list.appendChild(li);
  }
  return list;
};

// for each event we have to activate a listener for update modal
let updateModal = $("#update-modal");
const getEventGuests = async (eventId) => {
  let guests;
  await fetch(serverAddress + `/event/getEventGuests/${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log("okkkkkkkkkkkkkkkkkkkkkkkk");

      console.log(response);
      guests = response;
    });
  return guests;
};
const setEventDetails = async (event) => {
  console.log(event);
  $("#update-title").val(event.title);
  const eventDate = new Date(event.dateTime);
  var eventTime = eventDate.toTimeString().split(" ")[0];
  const eventDay = eventDate.toISOString().split("T")[0];
  $("#organizer-label").text("Organizer: " + event.organizer.email);
  $("#update-date").val(eventDay),
    $("#update-time").val(eventTime),
    $("#update-duration").val(event.duration),
    $("#update-location").val(event.location),
    $("#update-description").val(event.description),
    $("#update-isPrivate").prop("checked", event.private);
  $("#event-guest").append(
    await guestsElements(event.userRoles, event.userStatuses, event.id)
  );
};

const activateEvents = (myEvents, sharedEventsMap) => {
  // for each event we have to activate a listener for update modal
  let updateModal = $("#update-modal");

  $(".closeModalBtn").on("click", () => {
    $("#event-guest").empty();
    updateModal.hide();
  });

  for (let event of myEvents) {
    $(`#event${event.id}`).on("click", async (button) => {
      console.log(button.target.getAttribute("eventId"));
      let id = button.target.getAttribute("eventId");
      var event = await getEvent(id);

      setEventDetails(event);
      initInviteGuestBtn(id);

      updateModal.show();

      $("#update-event-button").on("click", () => {
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

        updateEvent(updateEventData);
      });
    });
  }

  for (let user in sharedEventsMap) {
    let sharedEvents = sharedEventsMap[user];
    for (let event of sharedEvents) {
      $(`#event${event.id}`).on("click", async (button) => {
        console.log(button.target.getAttribute("eventId"));
        let id = button.target.getAttribute("eventId");
        var event = await getEvent(id);
        setEventDetails(event);
        updateModal.show();

        $("#update-event-button").on("click", () => {
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

          updateEvent(updateEventData);
        });
      });
    }
  }
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

const emptyCardElement = () => {
  return `<div class="card" style="width: 12rem; height: 18rem;">
            <div class="card-body"></div>
          </div>`;
};

const cardElement = (day) => {
  let dateStamp = day.toISOString().split("T")[0];
  return `<div class="card" style="width: 12rem; height: 18rem;">
            <div class="card-body">
              <h5 class="card-title">${day.getUTCDate()}</h5>
              <p class="card-text">
              <div id="${dateStamp}"></div>
              </p>
            </div>
          </div>`;
  // if (events != undefined) {
  //   var eventsByDay = [];
  //   events.forEach((element) => {
  //     let date = new Date(element.dateTime);
  //     if (date.getDate() == day.getUTCDate()) {
  //       eventsByDay.push(element);
  //     }
  //   });
  //   if (eventsByDay.length != 0) {
  //     eventsByDay = eventsByDay.sort(function (b, a) {
  //       return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
  //     });
  //     eventsByDay.forEach((element)=>{
  //       htmlString += `<button id="event${element.id}" eventId="${element.id}">${element.title}</button><br>`;
  //     });
  //   }
  // }
  //  htmlString += `</p>
  //   </div>
  // </div>`;

  // <div id="${dateStamp}T00:00:00"></div>
  // <div id="${dateStamp}T02:00:00"></div>
  // <div id="${dateStamp}T04:00:00"></div>
  // <div id="${dateStamp}T06:00:00"></div>
  // <div id="${dateStamp}T08:00:00"></div>
  // <div id="${dateStamp}T10:00:00"></div>
  // <div id="${dateStamp}T12:00:00"></div>
  // <div id="${dateStamp}T14:00:00"></div>
  // <div id="${dateStamp}T16:00:00"></div>
  // <div id="${dateStamp}T18:00:00"></div>
  // <div id="${dateStamp}T20:00:00"></div>
  // <div id="${dateStamp}T22:00:00"></div>

  // return htmlString;
};

export { initGrid };
