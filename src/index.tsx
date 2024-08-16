import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import TimeAgo from "javascript-time-ago";

import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter } from "react-router-dom";

import es from "javascript-time-ago/locale/es";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(es);
TimeAgo.addLocale(en);

ReactDOM.render(
	<HashRouter>
		<App />
	</HashRouter>,
	document.getElementById("root")
);
