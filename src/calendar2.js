import $ from "jquery";
import { initDateToggle } from "./dateToggle";
import { initGrid } from "./grid";
import { initCreateEventModal, initUpdateEventModal } from "./modal";
import { initFilterSideBar, initFilterBtn } from "./filterSideBar";
import { initShareBtn } from "./share";

let id;

const initCalendar2 = async (calendarsMap) => {

  initDateToggle();
  initShareBtn();

  initGrid(calendarsMap);

  initCreateEventModal();

  initFilterSideBar(calendarsMap);
  initFilterBtn();
};

export { initCalendar2 };
