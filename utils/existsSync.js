/**
 * Checks if a file exists
 *
 * @param {string} filePath is the file path that will be checked
 * @returns {boolean} returns true if the file exists, and false if it doesn't
 */
export function existsSync(filePath) {
	try {
		Deno.statSync(filePath);
		return true;
	} catch (err) {
		return false;
	}
}