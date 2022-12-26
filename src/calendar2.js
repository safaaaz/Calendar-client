import $ from "jquery";
import { initDateToggle } from "./dateToggle";
import { initGrid } from "./grid";
import { initCreateEventModal } from "./modal";
import { initFilterSideBar, initFilterBtn } from "./filterSideBar";

let id;

const initCalendar2 = async (calendarsMap) => {
  initDateToggle();

  initGrid(calendarsMap);

  initCreateEventModal();

  initFilterSideBar(calendarsMap);

  initFilterBtn();
};

export { initCalendar2 };
