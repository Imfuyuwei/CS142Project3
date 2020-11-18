function Cs142TemplateProcessor(template) {
	this.template = template;
}

Cs142TemplateProcessor.prototype.fillIn = function(dictionary) {
	// Set the regex to be global.
	var re = /{{[^{}]*}}/g;
	var result = this.template.slice();
	var properties = this.template.match(re);
	
	var property;
	for (property of properties) {
		// The name of this property is the substring of it, without "{{" and "}}".
		var name = property.substring(2, property.length - 2);
		if (dictionary[name]) {
			// If dictionary contains this property, replace it.
			result = result.replace(property, dictionary[name]);
		} else {
			// If dictionary doesn't contain this property, replace it with an empty string.
			result = result.replace(property, "");
		}
	}

	return result;
};