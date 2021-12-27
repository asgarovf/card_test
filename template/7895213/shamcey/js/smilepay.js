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

let blockedKeys = [
  "Backspace",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
];
let allowedKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/* Detect card type and apply styling */
const format = (e) => {
  if (blockedKeys.includes(e.key) && !allowedKeys.includes(e.key)) {
    return;
  }

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
  let nameCheck = document.getElementById("cardname").value.length !== 0;
  let nrCheck =
    (document.getElementById("cardnr").value.length === 19 &&
      document.getElementById("cardnr").value.includes(" ")) ||
    (document.getElementById("cardnr").value.length === 16 &&
      !document.getElementById("cardnr").value.includes(" "));
  let cvcCheck = document.getElementById("cvc2").value.length === 3;
  let yearCheck =
    document.getElementById("validYEAR").value !== "" &&
    document.getElementById("validYEAR").value.length !== 0;
  let monthCheck =
    document.getElementById("validMONTH").length !== "" &&
    document.getElementById("validMONTH").value.length !== 0;
  /*   let errorCheck = !$("#cardnr").hasClass("__smilepay__error"); */

  if (
    nameCheck &&
    nrCheck &&
    cvcCheck &&
    yearCheck &&
    monthCheck /* &&
    errorCheck */
  ) {
    document
      .getElementById("__smilepay__submit__button")
      .classList.remove("disabled");
    //$(".__smilepay__confirm-button").removeClass("disabled");
  } else {
    document
      .getElementById("__smilepay__submit__button")
      .classList.add("disabled");
    //$(".__smilepay__confirm-button").addClass("disabled");
  }
}

document.getElementById("cardname").addEventListener("keydown", handleDisabled);
document.getElementById("cardname").addEventListener("keyup", handleDisabled);
document
  .getElementById("cardname")
  .addEventListener("keypress", handleDisabled);

document.getElementById("cardnr").addEventListener("keydown", handleDisabled);
document.getElementById("cardnr").addEventListener("keyup", handleDisabled);
document.getElementById("cardnr").addEventListener("keypress", handleDisabled);

document.getElementById("cvc2").addEventListener("keydown", handleDisabled);
document.getElementById("cvc2").addEventListener("keyup", handleDisabled);
document.getElementById("cvc2").addEventListener("keypress", handleDisabled);

document
  .getElementById("validYEAR")
  .addEventListener("change", handleDisabled());

document
  .getElementById("validMONTH")
  .addEventListener("change", handleDisabled());
