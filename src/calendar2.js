import $ from "jquery";
import { initDateToggle } from "./dateToggle";
import { initGrid } from "./grid";
import { initCreateEventModal } from "./modal";

let id;

const initCalendar2 = async () => {

  initDateToggle();

  initGrid();
  
  initCreateEventModal();
};

export { initCalendar2 };
