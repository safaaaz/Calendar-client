import $ from "jquery";
import { initDateToggle } from "./dateToggle";
import { initGrid } from "./grid";
import { initCreateEventModal } from "./modal";
import { initCalendarsSideBar } from "./calendarsSideBar";

let id;

const initCalendar2 = async () => {
  initDateToggle();

  initGrid();

  initCreateEventModal();

  initCalendarsSideBar();
};

export { initCalendar2 };
