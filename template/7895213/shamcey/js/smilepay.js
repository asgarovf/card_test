/** Feature: Set input value when inputFilter is true **/
/** @Param textbox -> Selector **/
/** @Param inputFilter -> Condition **/
function setInputFilter(textbox, inputFilter) {
  [
    "input",
    "keydown",
    "keyup",
    "mousedown",
    "mouseup",
    "select",
    "contextmenu",
    "drop",
  ].forEach(function (event) {
    textbox.addEventListener(event, function () {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}
/* */

/* Detect card type and apply styling */
const format = () => {
  var value = $("#cardnr").val();

  const spaceFree = value.replace(/\s/g, "");

  const newValueArr = spaceFree.match(/.{1,4}/g);

  const newValue = newValueArr?.join(" ");

  $("#cardnr").val(newValue);

  if (value[0] == 4 || value[0] == 5) {
    if (value[0] == 5) {
      $(".__smilepay_card-icon.visa").fadeOut(0);
      $("#__smilepay__default-icon").fadeOut(0);
      $(".__smilepay_card-icon.master").fadeIn();
    } else {
      $(".__smilepay_card-icon.master").fadeOut(0);
      $("#__smilepay__default-icon").fadeOut(0);
      $(".__smilepay_card-icon.visa").fadeIn();
    }
  } else {
    $(".__smilepay_card-icon.master").fadeOut(0);
    $(".__smilepay_card-icon.visa").fadeOut(0);
    $("#__smilepay__default-icon").fadeIn();
  }
};
/* */

$("#cardnr").on("keydown", format).on("keypress", format).on("keyup", format);

/* Detect error */
$("#cardnr").on("change", () => {
  var value = $("#cardnr").val();

  if (LuhnCheck(value)) {
    $("#cardnr").removeClass("__smilepay__error");
    $(".__smilepay__error-message").hide();
  } else {
    $("#cardnr").addClass("__smilepay__error");
    $(".__smilepay__error-message").show();
  }
});
/* */

/* Handle CVV2/CVC2 popup menu */
$("#__smilepay__cvc-info-icon").on("click", () => {
  $("#__smilepay__popup-wrapper").show();
});
$("#__smilepay__popup-close-button").on("click", () => {
  $("#__smilepay__popup-wrapper").hide();
});
/* */

/* Handle dropdown arrows */
$("#__smilepay__monthselect").click(() => {
  if (
    $("#__smilepay__monthselect .chzn-container .chzn-single").hasClass(
      "chzn-single-with-drop"
    )
  ) {
    $("#__smilepay__month-icon").addClass("rotate180");
  } else {
    $("#__smilepay__month-icon").removeClass("rotate180");
  }
  $("#cardnr").blur();
});

$("#__smilepay__yearselect").click(() => {
  if (
    $("#__smilepay__yearselect .chzn-container .chzn-single").hasClass(
      "chzn-single-with-drop"
    )
  ) {
    $("#__smilepay__year-icon").addClass("rotate180");
  } else {
    $("#__smilepay__year-icon").removeClass("rotate180");
  }
  $("#cardnr").blur();
});
/* */

/* Handle outside click */
$(document).mouseup(function (e) {
  var popup = $(".__smilepay__popup");
  var cardnr = $("#cardnr");
  var results = $(".chzn-results");

  if (!popup.is(e.target) && popup.has(e.target).length === 0) {
    if ($("#__smilepay__popup-wrapper").is(":visible")) {
      $("#__smilepay__popup-wrapper").hide();
    }
  }

  if (!cardnr.is(e.target) && cardnr.has(e.target).length === 0) {
    cardnr.focusout();
  }

  if (!results.is(e.target) && results.has(e.target).length === 0) {
    $("#__smilepay__year-icon").removeClass("rotate180");
    $("#__smilepay__month-icon").removeClass("rotate180");
  }
});
/* */

/* Check is card value is valid or not */
var LuhnCheck = (function () {
  var luhnArr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
  return function (str) {
    var counter = 0;
    var incNum;
    var odd = false;
    var temp = String(str).replace(/[^\d]/g, "");
    if (temp.length == 0) return false;
    for (var i = temp.length - 1; i >= 0; --i) {
      incNum = parseInt(temp.charAt(i), 10);
      counter += (odd = !odd) ? incNum : luhnArr[incNum];
    }
    return counter % 10 == 0;
  };
})();
/* */

/**
 * Handle Submit Button's disabled state
 */

function handleDisabled() {
  let nameCheck = $("#cardname").val().length !== 0;
  let nrCheck =
    ($("#cardnr").val().length === 19 && $("#cardnr").val().includes(" ")) ||
    ($("#cardnr").val().length === 16 && !$("#cardnr").val().includes(" "));
  let cvcCheck = $("#cvc2").val().length === 3;
  let yearCheck =
    $("#validYEAR").chosen().val() !== "" &&
    $("#validYEAR").chosen().val().length !== 0;
  let monthCheck =
    $("#validMONTH").chosen().val() !== "" &&
    $("#validMONTH").chosen().val().length !== 0;
  /*   let errorCheck = !$("#cardnr").hasClass("__smilepay__error"); */

  if (
    nameCheck &&
    nrCheck &&
    cvcCheck &&
    yearCheck &&
    monthCheck /* &&
    errorCheck */
  ) {
    $(".__smilepay__confirm-button").removeClass("disabled");
  } else {
    $(".__smilepay__confirm-button").addClass("disabled");
  }
}

$("#cardname,#cardnr,#cvc2")
  .on("keydown", handleDisabled)
  .on("keyup", handleDisabled)
  .on("keypress", handleDisabled);

$("#validYEAR, #validMONTH").on("change", () => {
  handleDisabled();
});

$("#validYEAR, #validMONTH").on("blur", () => {
  handleDisabled();
});
