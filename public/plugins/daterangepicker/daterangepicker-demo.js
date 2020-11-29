/* Daterangepicker bootstrap */

$(function() {
    "use strict";

    $('#duration').daterangepicker({
        timePicker: true,
        timePickerIncrement: 30,
        format: 'DD/MM/YYYY hh:mm A',
        locale: {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Appliquer",
            "cancelLabel": "Annuler",
            "fromLabel": "De",
            "toLabel": "À",
            "customRangeLabel": "Personnalisé",
            "daysOfWeek": [
                "Di",
                "Lu",
                "Ma",
                "Me",
                "Je",
                "Ve",
                "Sa"
            ],
            "monthNames": [
                "Janvier",
                "Février",
                "Mars",
                "Avril",
                "Mai",
                "Juin",
                "Juillet",
                "Aout",
                "Septembre",
                "Octobre",
                "Novembre",
                "Decembre"
            ],
            "firstDay": 1
        }
    });

});
