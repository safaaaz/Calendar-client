import $ from "jquery";
import { createCalendarEvent } from "./create_event_rest";
import { createEvent } from "./eventApi";

let attachments = [];

const initCreateEventModal = () => {
  //Set today as default day on event form
  var today = new Date();
  $("#date").attr("value", today.toISOString().substring(0, 10));

  // Get the modal
  let modal = $("#test-modal");

  // Get the button that opens the modal
  let button = $("#modal-button");

  // When the user clicks the button, open the modal
  button.on("click", () => {
    modal.show();
  });

  // add attachments dynamically
  $("#add-button").on("click", () => {
    $("#attachments").empty();
    attachments.push($("#attachment").val());

    attachments.forEach((attachment, index) => {
      if (attachment != "") {
        $("#attachments").append(
          `<li id="attachment-${index}" class="list-group-item"> ${attachment} <button id="delete-attachment-${index}" type="button" class="btn btn-danger">Delete</button></li>`
        );
      }
    });

    // we add listener for every delete button, so we could remove attachment if we added something we regret about
    attachments.forEach((_, index) => {
      $(`#delete-attachment-${index}`).on("click", () => {
        attachments[index] = "";
        $(`#attachment-${index}`).remove();
      });
    });
  });

  // create event button
  $("#createEventBtn").on("click", () => {
    let newAttachments = [];

    for (let attachment of attachments) {
      let dict = {};
      newAttachments.push((dict["attachment"] = attachment));
    }

    const calendarEvent = {
      title: $("#title").val(),
      date: $("#date").val(),
      time: $("#time").val(),
      duration: $("#duration").val(),
      location: $("#location").val(),
      description: $("#description").val(),
      attachments: newAttachments,
      isPrivate: $("#isPrivate").is(":checked") ? true : false,
    };
    console.log(calendarEvent);
    createEvent(calendarEvent);
  });

  // close modal button
  $(".closeModalBtn").on("click", () => {
    modal.hide();
  });
};

const initUpdateEventModal = (id) => {
  //Set today as default day on event form
  var today = new Date();
  $("#date").attr("value", today.toISOString().substring(0, 10));

  // Get the modal
  let modal = $("#update-modal");

  // add attachments dynamically
  $("#add-button").on("click", () => {
    $("#attachments").empty();
    attachments.push($("#attachment").val());

    attachments.forEach((attachment, index) => {
      if (attachment != "") {
        $("#attachments").append(
          `<li id="attachment-${index}" class="list-group-item"> ${attachment} <button id="delete-attachment-${index}" type="button" class="btn btn-danger">Delete</button></li>`
        );
      }
    });

    // we add listener for every delete button, so we could remove attachment if we added something we regret about
    attachments.forEach((_, index) => {
      $(`#delete-attachment-${index}`).on("click", () => {
        attachments[index] = "";
        $(`#attachment-${index}`).remove();
      });
    });
  });

  // create event button
  $("#update-event-button").on("click", () => {
    let newAttachments = [];

    for (let attachment of attachments) {
      let dict = {};
      newAttachments.push((dict["attachment"] = attachment));
    }

    const calendarEvent = {
      id:id,
      title: $("#title").val(),
      date: $("#date").val(),
      time: $("#time").val(),
      duration: $("#duration").val(),
      location: $("#location").val(),
      description: $("#description").val(),
      attachments: newAttachments,
      isPrivate: $("#isPrivate").is(":checked") ? true : false,
    };
    console.log(calendarEvent);
    createEvent(calendarEvent);
  });

  // close modal button
  $(".closeModalBtn").on("click", () => {
    console.log("check");
    modal.hide();
  });
}

export { initCreateEventModal, initUpdateEventModal };
