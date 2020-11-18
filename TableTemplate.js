"use strict";

class TableTemplate {
	static fillIn(id, dict, columnName) {
		let table = document.getElementById(id);
		let headRow = table.rows[0];	

		// Iterate through the headrow and update every property's name.
		for (let i = 0; i < headRow.cells.length; i++) {
			let cell = headRow.cells[i];
			let templateProcessor = new Cs142TemplateProcessor(cell.innerHTML);
			cell.innerHTML = templateProcessor.fillIn(dict);

			// If columnName is not specified or columnName matches, go into this column and update every cell's value.
			if (typeof columnName !== "string" || cell.innerHTML === columnName) {
			 	for (let j = 1; j < table.rows.length; j++) {
			 		let row = table.rows[j];
			 		let subCell = row.cells[i];
			 		let subtTemplateProcessor = new Cs142TemplateProcessor(subCell.innerHTML);
			 		subCell.innerHTML = subtTemplateProcessor.fillIn(dict);
			 	}
			}
		}
	}
}