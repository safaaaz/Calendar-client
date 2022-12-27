import $ from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {openConnection} from "./notifications"

import { initRouter } from "./router";

$(() => {
  openConnection();

  initRouter();
});

