$(document).ready(function() {
    
    /// Declearing variables and giving value 
    var dateDWMDT = moment().format('dddd, MMMM Do');
    var timedClass;
    var whatTimeIsIt = ["9", "10", "11","12","13","14","15","16","17","18"];
    var theTimeIS = moment().format('HH');
    var pmOrAM = ["AM","PM"];
    // this variable will take the minutes at the moment we open the aplication substract them from 60  
    var refresh = 60 - parseInt(moment().format('mm'));
    // Converting the value of local storgae oldToDo from string to an array and pasing it to oldToDo  
    // Or if oldToDo doesnt exist in local storage pass an empty array
    var oldToDo = JSON.parse(localStorage.getItem("oldToDo")) || [];

    // rendering the date stored on 
    $("#currentDay").text(dateDWMDT);

    function renderCalendar () {
        /// we are going to create five times the same elements with diferent classes, ids, and/or values
        for ( i = 0; i < whatTimeIsIt.length; i++) {
            //if the value of the array oldToDo at position i isnt empty pass its value to pastValue otherwise pass an empty string
            if (oldToDo[i] != null){
                pastValue = oldToDo[i] ;
            } else {
                pastValue = "";
            }
            // if is before noon is AM if not is PM
            if ( whatTimeIsIt[i] < 12)   {
                pmOrAM = "AM" ;                          
            } else {
                pmOrAM = "PM";
            } 
            // Assigning past, present, or future class to the text area to modify its background from css
            if (whatTimeIsIt[i] < parseInt(theTimeIS)) {
                timedClass = "past";
            }
            if (whatTimeIsIt[i] == parseInt(theTimeIS)) {
                timedClass = "present";
            } 
            if (whatTimeIsIt[i] >  parseInt(theTimeIS)) {
                timedClass = "future";
            }
            // assigning the hour to display a regular time format ecause we have been ussing mmilitary time 
            if (whatTimeIsIt[i] > 12) {
                whatTimeIsIt[i] -= 12;   
            }
            
            ///create a row append it to the main container, and append a label, a text area, and button to the row
            /// also append and Icon to the button 
            $("#timeblocks").append(`<div  class="row" id="row${i}"></div>`);
                    $(`#row${i}`).append(`<label id ="time${i}" class = "hour"> ${whatTimeIsIt[i]} ${pmOrAM}</label>`);
                    $(`#row${i}`).append(`<textarea class = " textarea description ${timedClass}" type="text" id="${i}" name="text${i}"> ${pastValue} </textarea>`);
                    $(`#row${i}`).append(`<button type="button"class = "saveBtn">  </button><br>`);
                    $('.saveBtn').html('<i class="fas fa-save"><br> Save</i>');
        }
    }

    //Run render calendar function
    renderCalendar();
    //record everything that is on each textarea, so that at the top of the hour when refreshing if the user is working on something they don't loose it
    function recordToDo () {
        for (var i = 0; i < whatTimeIsIt.length; i++) {
            oldToDo[i] = $(`#${i}`).val().trim()
         }
        localStorage.setItem("oldToDo", JSON.stringify(oldToDo));
    }
    
    // When you click on a button with class saveBtn (any of them) take the value and id of the previous sibling(textarea) 
    // use the id to identify the rigth possiton of the array oldToDo, which you want to render the value of the textarea
    // stringify this new array into local storage.
    $(`.saveBtn`).click(function() {
        var textVal = $(this).prev().val(); 
        var IdVal = $(this).prev().attr('id');
        oldToDo[IdVal] = textVal;
        console.log(oldToDo);
        localStorage.setItem("oldToDo", JSON.stringify(oldToDo));
        
    });

    // every hour call on function recordToDo and refresh the page. 
    //refresh is the minutes left to the top of th hour so multiply it for 1 minute (60000 milliseconds)
    setInterval (function () {
        recordToDo();
        window.location.reload();
    }, refresh * 60000)
     
})