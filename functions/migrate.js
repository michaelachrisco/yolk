import * as path from "https://deno.land/std@0.56.0/path/mod.ts";
import { crossPlatformPathConversion } from "../utils/crossPlatformPathConversion.js";

export async function migrate(drop) {
    let denodb = await import('https://raw.githubusercontent.com/eveningkid/denodb/afa87202bfde36aeab303a3317fc249c8f92e896/' + 'mod.ts');
    const Database = denodb.Database;
	const path = await import("https://deno.land/std@0.56.0/path/" + "mod.ts")

    const __dirname = crossPlatformPathConversion(Deno.cwd());

    let dbconfig = await import("file://" + path.join(__dirname, "config", "dbconfig.js"));
    dbconfig = dbconfig.dbconfig;

    const db = new Database(dbconfig.client, dbconfig.connection);

    for (let applet of Deno.readDirSync("applets")) {
        let appletModelsFolderPath = path.join("applets", applet.name, "models");
        let appletModelsPaths = Deno.readDirSync(appletModelsFolderPath);
        
        for (let modelPath of appletModelsPaths) {
            let modelImportPath = "file://" + path.join(__dirname, appletModelsFolderPath, modelPath.name);
            
            let modelImport = await import(modelImportPath);
            modelImport = modelImport.default;
            
            db.link([modelImport]);

            await db.sync({ drop: drop });
        }
    }

    await db.close();
}
