import { createproject } from "./functions/createproject.js";
import { createapplet } from "./functions/createapplet.js";
import { migrate } from "./functions/migrate.js";
import { rundenon } from "./functions/denon.js";

import * as colors from "https://deno.land/std@0.63.0/fmt/colors.ts";

function red(str) {
	const run = (str, code) => {
		return `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
	}

	const code = (open, close) => {
		return {
			open: `\x1b[${open.join(";")}m`,
			close: `\x1b[${close}m`,
			regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
		};
	}

	return run(str, code([31], 39));
}

let command = Deno.args[0];

switch (command) {
	case "createproject":
		await createproject(Deno.args[1]);
		console.log("Yolk project created sucessfully.");
		break;
	
	case "createapplet":
		if (Deno.args[1] === undefined) {
			console.log("No applet created. Please provide a name for the applet.");
		} else {
			await createapplet(Deno.args[1]);
			console.log("Applet {" + Deno.args[1] + "} created sucessfully.");
		}
		break;

	case "migrate":
		if (Deno.args[1] === "drop") {
			await migrate(true);
		} else {
			await migrate(false);
		}
		console.log("All models created sucessfully.");
		break;

	case "run":
		if (Deno.args[1] === undefined) {
			await rundenon("deno run -A --unstable server.js");
		} else {
			await rundenon("deno run -A --unstable server.js " + Deno.args[1]);
		}
		break;

	default:
		let helpText;

		if (command === undefined || command === "--help" || command === "help") {
			helpText = "";
		} else {
			helpText = `\n\n--> Command {${command}} is not a valid command\n`;
		}

		console.log(`
${colors.yellow("Yolk CLI")} - Oak-Based, Batteries-Included
Copyright 2020 - Anthony Mancini
Licensed under an MIT license

Available Commands:
-------------------

    ${colors.yellow("createproject [<dynamic>]")}
        | Creates a new project. By default dependencies for a new project
        | are linked to specific version numbers of that dependency. You can
        | optionally include the dynamic flag to make all dependencies use
        | the master branch of their respective repositories.


    ${colors.yellow("createapplet <applet_name>")}
        | Creates an new applet with a specified name.
	

    ${colors.yellow("migrate [drop]")}
        | Migrates all of the models in all of the applets. Add the drop
        | parameter to drop the existing models in the database in the case
        | where those models already exist.


    ${colors.yellow("run [<port_number>]")}
        | Runs the server using denon, restarting the server whenever a file
        | in the project is updated. You can change the port number by
        | specifying a port number, with the default set to 55555 if no port
        | number is chosen.


    ${colors.yellow("help")}
        | Displays this help information.
`.trim() + "\n" + red(helpText));
		
		break;
}
