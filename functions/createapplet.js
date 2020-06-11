import { dedent } from "../utils/dedent.js";
import { existsSync } from "../utils/existsSync.js";

export async function createapplet(appletName) {
	const path = await import("https://deno.land/std@0.56.0/path/" + "mod.ts")
	const appletDir = path.join("applets", appletName); 
	
	if (existsSync(appletDir)) {
		throw new Error("Applet already exists, try a different applet name.");
	}
	
	Deno.mkdirSync(appletDir);
	
	Deno.mkdirSync(path.join(appletDir, "controllers"));

	Deno.writeTextFile(path.join(appletDir, "controllers", `${appletName}Controller.js`), dedent(`
		// You can create controllers for your applet in this folder
		import Users from "../models/users.js";

		async function createUser(database, firstname, lastname) {
			database.link([Users]);

			await Users.create([{
				firstname: firstname,
				lastname: lastname,
			}]);

			return {
				statusText: "User added to database",
			};
		}

		async function selectUserByName(database, firstname) {
			database.link([Users]);

			return await Users.where("firstname", firstname).all();
		}

		async function deleteUserByName(database, firstname) {
			database.link([Users]);

			Users.where("firstname", firstname).delete();

			return {
				statusText: "User deleted from the database",
			};
		}

		export default {
			createUser: createUser,
			selectUserByName: selectUserByName,
			deleteUserByName: deleteUserByName,
		}
	`));

	Deno.mkdirSync(path.join(appletDir, "static"));

	Deno.writeTextFile(path.join(appletDir, "static", "yolk.svg"), dedent(`
		<?xml version="1.0" encoding="UTF-8" standalone="no"?>
		<svg
		xmlns:dc="http://purl.org/dc/elements/1.1/"
		xmlns:cc="http://creativecommons.org/ns#"
		xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
		xmlns:svg="http://www.w3.org/2000/svg"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
		xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
		width="126.50862"
		height="79.261604"
		version="1.1"
		id="svg4"
		sodipodi:docname="yolk.svg"
		inkscape:version="0.92.1 r15371">
		<metadata
			id="metadata10">
			<rdf:RDF>
			<cc:Work
				rdf:about="">
				<dc:format>image/svg+xml</dc:format>
				<dc:type
				rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
				<dc:title></dc:title>
			</cc:Work>
			</rdf:RDF>
		</metadata>
		<defs
			id="defs8" />
		<sodipodi:namedview
			pagecolor="#ffffff"
			bordercolor="#666666"
			borderopacity="1"
			objecttolerance="10"
			gridtolerance="10"
			guidetolerance="10"
			inkscape:pageopacity="0"
			inkscape:pageshadow="2"
			inkscape:window-width="1920"
			inkscape:window-height="1016"
			id="namedview6"
			showgrid="false"
			inkscape:zoom="7.0037243"
			inkscape:cx="72.518021"
			inkscape:cy="36.45111"
			inkscape:window-x="0"
			inkscape:window-y="27"
			inkscape:window-maximized="1"
			inkscape:current-layer="svg4"
			fit-margin-top="0"
			fit-margin-left="0"
			fit-margin-right="0"
			fit-margin-bottom="0" />
		<ellipse
			style="opacity:1;fill:#f2f2f2;fill-opacity:1;stroke:#7d7d7d;stroke-width:0.26458332;stroke-opacity:1"
			id="path10"
			cx="63.254311"
			cy="39.630802"
			rx="63.122021"
			ry="39.498512" />
		<ellipse
			style="fill:#ffd42a;stroke:#d4aa00;stroke-width:0.3328346;stroke-opacity:1"
			id="path12"
			cx="43.221581"
			cy="39.403996"
			rx="22.300596"
			ry="20.977678" />
		</svg>
	`));
	
	Deno.mkdirSync(path.join(appletDir, "templates"));
	
	Deno.writeTextFile(path.join(appletDir, "templates", "_base.html"), dedent(`
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<title>Yolk</title>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<link rel="shortcut icon" type="image/x-icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TS0UqBe2g4pChioMFURFHrUIRKpRaoVUHk0s/hCYNSYqLo+BacPBjserg4qyrg6sgCH6AODk6KbpIif9LCi1iPDjux7t7j7t3gFAvM9XsGANUzTLSibiYza2IwVcE0I8ehDEiMVOfTaWS8Bxf9/Dx9S7Gs7zP/Tm6lbzJAJ9IPMN0wyJeJ57atHTO+8QRVpIU4nPiUYMuSPzIddnlN85FhwWeGTEy6TniCLFYbGO5jVnJUIkniaOKqlG+kHVZ4bzFWS1XWfOe/IWhvLa8xHWag0hgAYtIQYSMKjZQhoUYrRopJtK0H/fwDzj+FLlkcm2AkWMeFaiQHD/4H/zu1ixMjLtJoTgQeLHtjyEguAs0arb9fWzbjRPA/wxcaS1/pQ5Mf5Jea2nRIyC8DVxctzR5D7jcAfqedMmQHMlPUygUgPcz+qYc0HsLdK26vTX3cfoAZKir5A1wcAgMFyl7zePdne29/Xum2d8Pa45ypLzRYJwAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfkBRkSEC9aQTxHAAABRklEQVQ4y91SPUvDUBQ9972XNIXWUlBIBqNI27mIo4OLi4tQcNLRH+Dg6OAPEPQHuHbVzUEXwc1BaLu1+FFMEarQoEJD8pLnYKuNNg5uerbLuedc7rkX+POg0aLVas3kcrl1zvkyERUATA2oR6XUdRRFp71er1oqldoxg3q9nrEsa0/X9U0i4j9NVEqFvu8fdjqd7XK5/Eq1Wi1r2/Y553weoQft+QIsuEGkFxBMLAIsNdYoDMMrx3GWqNvt7huGsQUVIv2wCyHPPpqktoK+uQMQG2vied4BE0JUAID6tzExAIjgBOTdJ64jhKh8WidM+ZLzNzAp5TEAKGMWgbYaIwN9DSo9nSiWUh7FQ4wCiJdLMP8OUWoOMrsAkJYkfg8RABqNRsY0zd+dcZRsNpt2Pp/fYIwNH2lyQD0NH8l13WqxWGzj/+ANJUOKfcKN42YAAAAASUVORK5CYII=">
				<style>
					html, body {
						margin: 0px;
						background-color: #f2f2f2;
						font-family: sans-serif;
						font-size: 1.25em;
					}
		
					ul {
						list-style: none;
					}
					
					li {
						padding-bottom: 32px;
					}
		
					li a {
						font-size: 1.15em;
						color: #d4aa00;
						font-weight: bold;
						text-decoration: none;
					}
				</style>
			</head>
			<body>
				{% block content %}
				
				{% endblock content %}
			</body>
		</html>
	`));
	
	Deno.writeTextFile(path.join(appletDir, "templates", "index.html"), dedent(`
		{% extends "_base.html" %}

		{% block content %}
			<div style="background-color: #ffd42a; border-bottom: 1px solid #d4aa00; display: flex;">
				<div style="font-size: 1.5em; padding-left: 8px; padding-top: 12px; padding-bottom: 12px; font-weight: bold;"><a style="text-decoration: none; color: black" href="https://github.com/denjucks/yolk">Docs</a></div>
			</div>
		
			<div style="display: flex;">
				<div style="margin: auto; display: flex; flex-direction: column; width: 70vw;">
					<h1 style="text-align: center;">Yolk CLI: The Oak Framework with Batteries Included</h1>
					<img src="/main/static/yolk.svg" style="width: 20vw; margin: auto; padding: 32px;">
					<div>
						<div>
							Yolk CLI is a CLI tool that makes it very easy to create and run Oak web 
							applications, with the goal of providing you with all of the technologies
							commonly used when creating web applications, as well as an easy to use,
							scalable, and easy to maintain structure for your web applications. The
							project structure created by the Yolk CLI is very flexible, allowing you
							to add and remove features easily. Projects created by the Yolk CLI are
							batteries-included, providing dynamic links to many useful libraries used in web
							applications that will be downloaded and cached on the first run of each
							command.
						</div>
						<br>
						<div>
							The technology stack included in projects created by the Yolk CLI include:
						</div>
		
						<ul>
							<li><a href="https://deno.land/x/oak/">Oak</a><br>The Koa-based web framework used in Yolk.</li>
							<li><a href="https://deno.land/x/denon/">Denon</a><br>The Deno version of Nodemon.</li>
							<li><a href="https://deno.land/x/denjucks/">Denjucks</a><br>A powerful and easily the use templating engine ported from Mozilla's Nunjucks library.</li>
							<li><a href="https://deno.land/x/denodb/">DenoDB</a><br>An ORM library for Deno with support for many commonly used databases.</li>
							<li><a href="https://deno.land/x/session/">Session</a><br>A session middleware for the Oak framework.</li>
							<li><a href="https://deno.land/x/snelm/">Snelm</a><br>A security middleware for many deno web frameworks ported from the Helmet middleware for ExpressJS.</li>
							<li><a href="https://deno.land/x/organ/">Organ</a><br>A logging middleware with similar syntax as the Morgan middleware for ExpressJS.</li>
							<li><a href="https://deno.land/x/oak-query-parser-async/">Oak-Async-Query-Parser</a><br>A query string parser for Oak.</li>
						</ul>
					</div>
				</div>
			</div>
		{% endblock content %}
	`));
	
	
	Deno.writeTextFile(path.join(appletDir, "router.js"), dedent(`
		import { Router } from "../../deps/oak.js";
		import path from "../../deps/path.js";
		import denjucks from "../../deps/denjucks.js";
		import * as utilities from "../../utilities/util.js"
		import mainController from "./controllers/mainController.js";
		
		const __dirname = utilities.crossPlatformPathConversion(new URL(".", import.meta.url).pathname);
		
		// Setting up the template rendering engine
		const renderingEngine = new denjucks.Environment(new denjucks.FileSystemLoader(path.join(__dirname, "templates")));
		
		// Setting the path prefix for this route
		const pathPrefix = "/main";
		
		const router = new Router({ prefix: pathPrefix });
		
		// Creating the static file route for this router
		router.get("/static/:filePath", async (context) => {
			const filePath = context.params.filePath;
			let buffer;
			try {
				buffer = await Deno.readFile(path.join(__dirname, "static", filePath));
			} catch (error) {}
			
			return context.response.body = buffer;
		});
		
		// Routes
		router.get("/", async (context) => {
			context.response.body = renderingEngine.render("index.html");
		});
		
		export default router;
	`));
	
	Deno.mkdirSync(path.join(appletDir, "models"));

	Deno.writeTextFile(path.join(appletDir, "models", "users.js"), dedent(`
		import { Model, DATA_TYPES } from '../../../deps/denodb.js';

		export default class Users extends Model {
			static table = '${appletName}Users';
			static timestamps = true;
		
			static fields = {
				id: {
					primaryKey: true,
					autoIncrement: true,
				},
				firstname: DATA_TYPES.STRING,
				lastname: DATA_TYPES.STRING,
			};
		}
	`));

	Deno.mkdirSync(path.join(appletDir, "api"));

	Deno.writeTextFile(path.join(appletDir, "api", "router.js"), dedent(`
		import { Router } from "../../../deps/oak.js";
		import mainController from "../controllers/mainController.js";
		
		// Setting the path prefix for this api and creating the router
		const pathPrefix = "/${appletName}/api";
		const router = new Router({ prefix: pathPrefix });
		
		/* Routes */
		router.get("/", async (context) => {
			context.response.body = "Hello World!";
		});

		router.get("/create/:firstname/:lastname", async (context) => {
			context.response.body = await mainController.createUser(context.database, context.params.firstname, context.params.lastname);
		});

		router.get("/select/:firstname", async (context) => {
			context.response.body = await mainController.selectUserByName(context.database, context.params.firstname);
		});

		router.delete("/delete/:firstname", async (context) => {
			context.response.body = await mainController.deleteUserByName(context.database, context.params.firstname);
		});
		
		export default router;
	`));
}