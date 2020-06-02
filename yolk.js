import { createproject } from "./functions/createproject.js";
import { createapplet } from "./functions/createapplet.js";
import { migrate } from "./functions/migrate.js";
import { rundenon } from "./functions/denon.js";

let command = Deno.args[0];
if (command === undefined) {
	command = "--help";
}

switch (command) {
	case "createproject":
		await createproject();
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

	case "--help":
		console.log(`
Yolk CLI - Oak-Based, Batteries-Included
Copyright 2020 - Anthony Mancini
Licensed under an MIT license

Available Commands:
    createproject
        "Creates a new project"

    createapplet <applet_name>
        "Creates an new applet with a specified name"
	
    migrate [drop]
        "Migrates all of the models in all of the applets. Add the drop"
        "parameter to drop the existing models in the database in the case"
        "where those models already exist"

    run [<port_number>]
        "Runs the server using denon, restarting the server whenever a file"
        "in the project is updated. You can change the port number by"
        "specifying a port number, with the default set to 55555 if no port"
        "number is chosen"

    --help
        "Displays this help information."
`.trim());
		
		break;
}