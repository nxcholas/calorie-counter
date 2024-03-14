const calorieCounter = document.getElementById('calorie-counter'); //returns element object
const budgetNumberInput = document.getElementById('budget'); //returns element object
const entryDropdown = document.getElementById('entry-dropdown'); //returns element object
const addEntryButton = document.getElementById('add-entry'); //returns element object
const clearButton = document.getElementById('clear'); //returns element object
const output = document.getElementById('output'); //returns element object
let isError = false;

function cleanInputString(str) { //replaces regex values with empty string to iterate individually
  const regex = /[+-\s]/g; //regex values
  return str.replace(regex, ''); 
}

function isInvalidInput(str) { //matches str values to regex values
  const regex = /\d+e\d+/i; //regex values
  return str.match(regex);
}

function addEntry() { //adds additional HTML element to form to add more entries
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`); //var string targets drop-down menu value and input container class
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1; //var num targets # of input containers in array (returns input container order 1,2,3)
  const HTMLString =  //var adds HTML elements to exisiting empty input-container
  `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />`;
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString); //targets inputcontainer div to not replace exisiting and to add additional
}

function calculateCalories(e) { //takes calorie budget and subtracts breakfast, lunch, dinner, snacks, exercise
  e.preventDefault(); //prevents buttom from submitting form
  isError = false; 

  const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]'); //var num that targets calories entered into entry portion
  const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]'); //var num that targets calories entered into entry portion
  const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]'); //var num that targets calories entered into entry portion
  const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]'); //var num that targets calories entered into entry portion
  const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]'); //var num that targets calories entered into entry portion

  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs); //stores calories var inputted from designated input section
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs); //stores calories var inputted from designated input section
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs); //stores calories var inputted from designated input section
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs); //stores calories var inputted from designated input section
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs); //stores calories var inputted from designated input section
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]); //stores calories var inputted from designated input section

  if (isError) { //if there's an error, error function will run and code block ends
    return;
  }

  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit'; //compares remaining calories to dictate wheter user is surplus or deficit
  output.innerHTML = //HTML elements added once calculation completes
  `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;

  output.classList.remove('hide'); //makes output HTML elements visible
}

function getCaloriesFromInputs(list) { //gathers user inputs from calories section and stores it into calories var (list is an empty array)
  let calories = 0; //var to reset calorie count to 0 before adding

  for (const item of list) { //defines items var and list array to run function
    const currVal = cleanInputString(item.value); //runs clean input string function to convert item iterated within list array to store in currVal
    const invalidInputMatch = isInvalidInput(currVal); //tests currVal to see if it is a valid input or not

    if (invalidInputMatch) { //if currVal is invalid, this function runs to alert user 
      alert(`Invalid Input: ${invalidInputMatch[0]}`); //alert message
      isError = true; //sets global error var to true
      return null; 
    }
    calories += Number(currVal); //adds user inputed calories to stored calories var
  }
  return calories; //returns calories var to be used elsewhere
}

function clearForm() { //clears all inputs to empty strings
  const inputContainers = Array.from(document.querySelectorAll('.input-container')); //stores all input containers into inputContainers array

  for (const container of inputContainers) {
    container.innerHTML = ''; //sets containers to empty string
  }

  budgetNumberInput.value = ''; //sets budget value to empty string
  output.innerText = ''; //sets output HTML element text to empty string
  output.classList.add('hide'); //resets output HTML element to hide once again
}

addEntryButton.addEventListener("click", addEntry); //sets add entry button to call addEntry function
calorieCounter.addEventListener("submit", calculateCalories); //sets submit button to calculateCalories function
clearButton.addEventListener("click", clearForm); //sets clearform button to clearForm function