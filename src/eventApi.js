import { event } from "jquery";
import { serverAddress } from "./constants";
import { urlLocationHandler } from "./router";
import {stompClient} from "./notifications";
const createEvent = (data) => {
  console.log("Calling localhost:8080/event/add");
  fetch(serverAddress + "/event/add", {
    method: "POST",
    body: JSON.stringify({
      title: data.title,
      dateTime: data.date + "T" + data.time,
      duration: data.duration,
      description: data.description,
      isPrivate: data.isPrivate,
      location: data.location,
      attachments: data.attachments,
    }),
    headers: {
      token: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.status == 200) {
        alert(response.message);
        return;
      }
      console.log(response);
      return response.json();
    })
    .then((response) => {
      alert("Event " + response.title + " added successfully");
      console.log(response);

      window.history.pushState({}, "", "/calendar");
      urlLocationHandler();
    })
    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
};
const getEvent = async (id) => {
  var event;
  await fetch(serverAddress + "/event/findOne/" + id, {
    method: "GET",
    headers: {
      token: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log(response);
      event = response;
    });
  return event;
};
const updateEvent = (data) => {
  fetch(serverAddress + "/event/update", {
    method: "POST",
    body: JSON.stringify({
      id: data.id,
      title: data.title,
      dateTime: data.date + "T" + data.time,
      duration: data.duration,
      description: data.description,
      isPrivate: data.isPrivate,
      location: data.location,
    }),
    headers: {
      eventId: data.id,
      token: localStorage.getItem("token"),
      title:data.title,
      duration:data.duration,
      date: data.date,
      time:data.time,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log(response.status);
      return Promise.all([response.status, response.json()]);
    })
    .then(([status, body]) => {
      console.log(status, body);
      if (status == 200) {
        alert("Event " + body.eventTitle + " has been updated successfully");
        stompClient.send("/app/update/", [],JSON.stringify({
          eventId: body.eventId,
          eventTitle: body.eventTitle,
          editorEmail: body.editorEmail,
      }));
        window.history.pushState({}, "", "/calendar");
        urlLocationHandler();
      } else {
        alert(body.message);
      }
    })
    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
};
export { createEvent, updateEvent, getEvent };
