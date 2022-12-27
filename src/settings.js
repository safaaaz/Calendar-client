import $ from "jquery";
import { serverAddress } from "./constants";

const initSettings = () => {
  $("#save-button").on("click", async () => {
    await fetch(serverAddress + "/settings/notification/update", {
      method: "POST",
      body: JSON.stringify({
        byEmail: $("#delivery-by-email").prop("checked"),
        byPopUp: $("#delivery-by-pop-up").prop("checked"),
        newEventInvitation: $("#notify-new-event-invitation").prop("checked"),
        userStatusChanged: $("#notify-user-status-changed").prop("checked"),
        eventDataChanged: $("#notify-event-data-changed").prop("checked"),
        eventCanceled: $("#notify-event-canceled").prop("checked"),
        userWasUninvited: $("#notify-user-was-uninvited").prop("checked"),
        remind1MinBefore: $("#remind-1-min-before").prop("checked"),
        remind5MinBefore: $("#remind-5-min-before").prop("checked"),
        remind10MinBefore: $("#remind-10-min-before").prop("checked"),
      }),
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    });
  });
};

export { initSettings };
