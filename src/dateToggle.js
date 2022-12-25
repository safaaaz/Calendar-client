import $ from "jquery";

import { DateSingleton } from "./dateSingleton";
import { urlLocationHandler } from "./router";

const initDateToggle = () => {
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
};

export { initDateToggle };
