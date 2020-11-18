"use strict";

function DatePicker(id, callback) {
    this.id = id;
    this.callback = callback;

    this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.dayOfWeekNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
}


// Enclose this callback function with fixeDate object
DatePicker.prototype.makeCallBack = function(month, day, year) {
    return () => this.callback(this.id, {"month": month, "day": day, "year": year});
};

// Make the head row which consists of the previous button, current month, current year and next button
DatePicker.prototype.makeHeadRow = function(calendarTable, date) {
    var currMonth = date.getMonth();
    var currYear = date.getFullYear();

    var headRow = calendarTable.insertRow();

    // Build the backward button, must bind the function in addEventListener to "this".
    var prevMonthCell = headRow.insertCell();
    prevMonthCell.innerHTML = "<";
    prevMonthCell.id = "active";
    prevMonthCell.colSpan = 1;
    // OnClick render, its previous month
    prevMonthCell.addEventListener("click", function() {
        if (currMonth === 0) {
            this.render(new Date(currYear - 1, 11, 1));
        } else {
            this.render(new Date(currYear, currMonth - 1, 1));
        }
    }.bind(this));


    var currMonthCell = headRow.insertCell();
    currMonthCell.colSpan = 5;
    var currMonthName = this.monthNames[currMonth];
    currMonthCell.innerHTML = currMonthName + " " + currYear;

    // Build the forward button, must bind the function in addEventListener to "this".
    var nextMonthCell = headRow.insertCell();
    nextMonthCell.innerHTML = ">";
    nextMonthCell.id = "active";
    nextMonthCell.colSpan = 1;
    // OnClick render, its next month
    nextMonthCell.addEventListener("click", function() {
        if (currMonth === 11) {
            this.render(new Date(currYear + 1, 0, 1));
        } else {
            this.render(new Date(currYear, currMonth + 1, 1));
        }
    }.bind(this));
};

// Make the week row which displays the names of days of the week.
DatePicker.prototype.makeDaysOfWeekRow = function(calendarTable) {
    var daysOfWeekRow = calendarTable.insertRow();
    for (var dayOfWeekName of this.dayOfWeekNames) {
        var dayOfWeekCell = daysOfWeekRow.insertCell();
        dayOfWeekCell.colSpan = 1;
        dayOfWeekCell.innerHTML = dayOfWeekName;
    }
};


// Make the body of the calendar table.
DatePicker.prototype.makeTableBody = function(calendarTable, date) {
    var currMonth = date.getMonth();
    var currYear = date.getFullYear();

    // Get the first day and last day of the current month so that we can get their days of week. 
    var firstDayOfCurrMonth = new Date(currYear, currMonth, 1);
    var lastDayOfCurrMonth =  new Date(currYear, currMonth + 1, 0);

    var dayOfWeekOfFirstDayOfCurrMonth = firstDayOfCurrMonth.getDay();
    var dayOfWeekOfLastDayOfCurrMonth = lastDayOfCurrMonth.getDay();


    // Calculate the total number of days that need to be shown in current state of calendar
    var numOfDaysOfPrevMonth = dayOfWeekOfFirstDayOfCurrMonth;
    var numOfDaysOfCurrMonth = lastDayOfCurrMonth.getDate();
    var numOfDaysOfNextMonth = 6 - dayOfWeekOfLastDayOfCurrMonth;
    var totalNumOfDays = numOfDaysOfPrevMonth + numOfDaysOfCurrMonth + numOfDaysOfNextMonth;


    // Start from the first date that need to be shown in current state of the calendar, continue to update it to be the next date
    var calendarDate = new Date(currYear, currMonth, 1 - numOfDaysOfPrevMonth);
    var newWeekRow;
    var newDateCell;
    for (let i = 0; i < totalNumOfDays; i++) {
        if (i % 7 === 0) {
            newWeekRow = calendarTable.insertRow();
        }
        newDateCell = newWeekRow.insertCell();
        newDateCell.colSpan = 1;
        newDateCell.innerHTML = calendarDate.getDate();

        if (calendarDate.getMonth() === currMonth) {
            // the value of month should be calendarDate.getMonth() + 1 according to the encoding rule.
            newDateCell.addEventListener("click", this.makeCallBack(calendarDate.getMonth() + 1, calendarDate.getDate(), calendarDate.getFullYear()));
            newDateCell.id = "active";
        } else {
            newDateCell.id = "inactive";
        }

        calendarDate.setDate(calendarDate.getDate() + 1);
    }
};


DatePicker.prototype.render = function(date) {
    // Add a node to the document to make the calendar table.
    var node = document.createElement("Table");
    node.setAttribute("id", "calendar" + this.id);
    document.getElementById(this.id).appendChild(node);

    var calendarTable = document.getElementById("calendar" + this.id);
    calendarTable.innerHTML = "";
    
    // Draw the head row
    this.makeHeadRow(calendarTable, date);

    // Draw the row of dayOfWeek names for "Su" to "Sa"
    this.makeDaysOfWeekRow(calendarTable);

    // Draw the body of this calendar table
    this.makeTableBody(calendarTable, date);
};