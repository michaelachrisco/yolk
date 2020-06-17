import { dedent } from "../utils/dedent.js";
import { createapplet } from "./createapplet.js";

export async function createproject(dependenciesFlag) {
	const path = await import("https://deno.land/std/path/" + "mod.ts")

	Deno.writeTextFile("server.js", dedent(`
		import { Application } from "./deps/oak.js";
		import { Database } from './deps/denodb.js';
		import { dbconfig } from "./config/dbconfig.js";
		import { queryParserAsync } from "./deps/oakAsyncQueryParser.js";
		import { Snelm } from "./deps/snelm.js";
		import { Session } from "./deps/session.js";
		import { organ } from "./deps/organ.js";

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


		// General 404 Error Page
		app.use(async (context, next) => {
			context.response.status = 404;
			context.response.body = "404 - Page Not Found";

			await next();
		});
		

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

	Deno.mkdirSync("deps");
	
	if (dependenciesFlag === "dynamic") {
		Deno.writeTextFile(path.join("deps", "denjucks.js"), dedent(`
			import denjucks from "https://deno.land/x/denjucks/mod.js";
			export default denjucks;
		`));

		Deno.writeTextFile(path.join("deps", "denodb.js"), dedent(`
			export { Database, Model, DATA_TYPES } from 'https://deno.land/x/denodb/mod.ts';
		`));

		Deno.writeTextFile(path.join("deps", "oak.js"), dedent(`
			export { Application, Router } from "https://deno.land/x/oak/mod.ts";
		`));

		Deno.writeTextFile(path.join("deps", "oakAsyncQueryParser.js"), dedent(`
			export { queryParserAsync } from "https://raw.githubusercontent.com/denjucks/oak-query-parser-async/master/mod.ts";
		`));

		Deno.writeTextFile(path.join("deps", "organ.js"), dedent(`
			export { organ } from "https://deno.land/x/organ/mod.ts";
		`));

		Deno.writeTextFile(path.join("deps", "path.js"), dedent(`
			import * as path from "https://deno.land/std/path/mod.ts";
			export default path;
		`));

		Deno.writeTextFile(path.join("deps", "session.js"), dedent(`
			export { Session } from "https://deno.land/x/session/mod.ts";
		`));

		Deno.writeTextFile(path.join("deps", "snelm.js"), dedent(`
			export { Snelm } from "https://deno.land/x/snelm/mod.ts";
		`));


	} else {
		Deno.writeTextFile(path.join("deps", "denjucks.js"), dedent(`
			import denjucks from "https://deno.land/x/denjucks@1.1.1/mod.js";
			export default denjucks;
		`));

		Deno.writeTextFile(path.join("deps", "denodb.js"), dedent(`
			export { Database, Model, DATA_TYPES } from 'https://raw.githubusercontent.com/eveningkid/denodb/afa87202bfde36aeab303a3317fc249c8f92e896/mod.ts';
		`));

		Deno.writeTextFile(path.join("deps", "oak.js"), dedent(`
			export { Application, Router } from "https://deno.land/x/oak@v5.1.1/mod.ts";
		`));

		Deno.writeTextFile(path.join("deps", "oakAsyncQueryParser.js"), dedent(`
			export { queryParserAsync } from "https://raw.githubusercontent.com/denjucks/oak-query-parser-async/1.0.0/mod.ts";
		`));

		Deno.writeTextFile(path.join("deps", "organ.js"), dedent(`
			export { organ } from "https://deno.land/x/organ@1.1.1/mod.ts";
		`));

		Deno.writeTextFile(path.join("deps", "path.js"), dedent(`
			import * as path from "https://deno.land/std@0.56.0/path/mod.ts";
			export default path;
		`));

		Deno.writeTextFile(path.join("deps", "session.js"), dedent(`
			export { Session } from "https://deno.land/x/session@1.1.0/mod.ts";
		`));

		Deno.writeTextFile(path.join("deps", "snelm.js"), dedent(`
			export { Snelm } from "https://deno.land/x/snelm@1.3.0/mod.ts";
		`));
	}
	
	await createapplet("main");
}
