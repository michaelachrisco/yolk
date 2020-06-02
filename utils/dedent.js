/**
 * Dedents each line of a string by the minimum number of whitespace
 * characters on the left of each line. For example, the following
 * string:
 *
 * '  Hello'
 * '    World'
 *
 * will be dedented to:
 *
 * 'Hello'
 * '  World'
 *
 * @param {string} indentedString is the string that will be dedented
 * @returns {string} returns the string in dedented form
 */
export function dedent(indentedString) {
	let minimumDedent = indentedString.split("\n");
	minimumDedent = minimumDedent.filter(stringLine => stringLine.trim() !== "");
	minimumDedent = minimumDedent.map(stringLine => (stringLine.length - stringLine.trimLeft().length));
	minimumDedent = Math.min(...minimumDedent);
	
	let dedentedString = indentedString.split("\n");
	dedentedString = dedentedString.map(stringLine => stringLine.substr(minimumDedent, stringLine.length - minimumDedent));
	dedentedString = dedentedString.join("\n");
	dedentedString = dedentedString.trim();
	
	return dedentedString
}