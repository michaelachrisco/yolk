import { dedent } from "../utils/dedent.js";
import { createapplet } from "./createapplet.js";

export async function createproject() {
	const path = await import("https://deno.land/std/path/" + "mod.ts")

	Deno.writeTextFile("server.js", dedent(`
		import { Application } from "https://deno.land/x/oak/mod.ts";
		import { Database } from 'https://deno.land/x/denodb/mod.ts';
		import { dbconfig } from "./config/dbconfig.js";
		import { queryParserAsync } from "https://raw.githubusercontent.com/denjucks/oak-query-parser-async/master/mod.ts";
		import { Snelm } from "https://deno.land/x/snelm/mod.ts";
		import { Session } from "https://deno.land/x/session/mod.ts";
		import { organ } from "https://deno.land/x/organ/mod.ts";

		const app = new Application();
		
		
		/* Server configurations */
		let port = 55555;
		if (Deno.args[0]) {
		    port = Number.parseInt(Deno.args[0]);
		}
		
		
		/* Database */
		const database = new Database(dbconfig.client, dbconfig.connection);
		app.use(async (context, next) => {
			context.database = database;
			await next();
		});

		
		/* Middleware */
		// Logging middleware
		app.use(organ());

		// Query Parser Middleware
		app.use(queryParserAsync());
		
		// Security Middleware
		const snelm = new Snelm("oak");
		await snelm.init();
		
		app.use(async (context, next) => {
		    context.response = snelm.snelm(context.request, context.response);
		
		    await next();
		});
		
		// Session Middleware
		const session = new Session({
		    framework: "oak",
		    store: "memory",
		});
		await session.init();
		app.use(session.use()(session));
		
		
		/* Routers */
		import main from "./applets/main/router.js";
		app.use(main.routes());
		app.use(main.allowedMethods());

		import mainapi from "./applets/main/api/router.js";
		app.use(mainapi.routes());
		app.use(mainapi.allowedMethods());
		
		
		// Starting the server
		console.log("Starting server at port: " + port);
		await app.listen({ port: port });
	`));
	
	Deno.mkdirSync("applets");

	Deno.mkdirSync("config");
	
	Deno.writeTextFile(path.join("config", "dbconfig.js"), dedent(`
		export const dbconfig = {
			client: "sqlite3",
			connection: {
				filepath: "sqlite.db",
			}
		}
	`));
	
	Deno.mkdirSync("utilities");
	
	Deno.writeTextFile(path.join("utilities", "util.js"), dedent(`
		export function crossPlatformPathConversion(filePath) {
			if (Deno.build.os === "win") {
				filePath = filePath.split("/").join("\\\\");
				filePath = filePath.substr(1, filePath.length - 1);
			}
		
			return filePath
		}
	`));
	
	await createapplet("main");
}