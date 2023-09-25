// Function to create html elements
const addElement = (tag, inner, id) => {
  if (tag === "button") {
    return `<${tag} id=${id} class="btn btn-info"> ${inner} </${tag}>`;
  } else {
    return `<${tag} id=${id}> ${inner} </${tag}>`;
  }
}

// Function to populate the dropdown list with the countries in the data.js
const populateSelection = () => {
  const dropdown = document.querySelector(`#all`);
  const placeholder = document.createElement("option");
  placeholder.textContent = "Select a country from the list";
  dropdown.appendChild(placeholder);
  let fragment = document.createDocumentFragment();
  countries.forEach((country) => {
    let options = document.createElement(`option`);
    options.textContent = country.name.common;
    fragment.appendChild(options);
  });
  dropdown.appendChild(fragment);

  const selectForTranslations = document.createElement("select");
  selectForTranslations.setAttribute("hidden", "true");
  document.querySelector("#toolbar").insertAdjacentElement("afterbegin", selectForTranslations);
};

// Create fragment and div where the countries are displayed in the main section 
const displayMainSection = (country, oddElement) => {
  console.log(country);
  // Create elements for the countries: flag image, common name, region, subregion, capital
  let fragment = document.createDocumentFragment();
  let imageElement = document.createElement(`img`);
  imageElement.src = country.flags.png;
  let commonName = document.createElement(`h1`);
  commonName.textContent = country.name.common;
  let regionElement = document.createElement(`h2`);
  regionElement.textContent = country.region;
  let subregionElement = document.createElement(`h3`);
  subregionElement.textContent = country.subregion;
  let capitalElement = document.createElement(`h4`);
  capitalElement.textContent = country.capital;
  fragment.appendChild(imageElement);
  fragment.appendChild(commonName);
  fragment.appendChild(regionElement);
  fragment.appendChild(subregionElement);
  fragment.appendChild(capitalElement);

  // If a country is selected remove it to show the next one
  if (document.querySelector(`#country`).hasChildNodes()) {
    const elementsToDelete = document.querySelectorAll("main > img, h1, h2, h3, h4");
    elementsToDelete.forEach((elem) => {
        elem.remove();
    })
  };
  
  // Show the selected country in the main section 
  document.querySelector(`#country`).appendChild(fragment);
  const lastTranslationKey = document.querySelector("nav > select:first-child").value;
  console.log(country.translations[lastTranslationKey]);
  if (document.querySelectorAll("#toolbar > select:first-child option").length > 0) {
    document.querySelectorAll("#toolbar > select:first-child option").forEach((singleOption) => {
      singleOption.remove();
    })
  };
  if (document.querySelector(`#country`).hasChildNodes()) {
    const selectedName = document.querySelector("main > h1").textContent;
    const countryForTranslations = countries.find((element) => {
      return element.name.common === selectedName
    });
    const defaultOption = document.createElement("option");
    defaultOption.id = "default";
    defaultOption.textContent = "Select a Translation";
    document.querySelector("#toolbar > select:first-child").appendChild(defaultOption);
    for (const key in countryForTranslations.translations) {
      const option = document.createElement("option");
      option.textContent = key;
      const firstSelect = document.querySelector("#toolbar > select:first-child");
      firstSelect.appendChild(option);
    }
    if (Object.keys(country.translations).includes(lastTranslationKey)) {
      document.querySelector("nav > select:first-child").value = lastTranslationKey;
    };
    if (lastTranslationKey !== defaultOption.textContent && lastTranslationKey !== "") {
      document.querySelector("main > h1").textContent = country.translations[lastTranslationKey].common;
    }
  }

  // add style to translations dropdown
  document.querySelector("#toolbar > select:first-child").setAttribute("class", "d-flex flex-column flex-md-row p-4 gap-4 py-md-2 align-items-center justify-content-center");
  document.querySelector("#toolbar > select:first-child").setAttribute("data-bs-theme", "dark");
  
  // Show the largest population and area buttons when a country is selected
  
  document.querySelector(`#population`).removeAttribute("hidden");
  document.querySelector(`#area`).removeAttribute("hidden");
  document.querySelector("#toolbar > select:first-child").removeAttribute("hidden");

  // If country has a neighbour, selected country becomes that neighbour and displays it  
  selectedCountry = country;

  // Call the visisted countries function to populate the vistsed array
  visitedCountries(selectedCountry, oddElement);
  // Call the country from visited array function to get the index number of the country in the visited Array variable
  countryFromVisitedArray();
};

let selectedCountry = countries[0];

// Get the neighbour with the largest population
const largestPopulation = () =>{
  let largestPopulationCountry; 


  if(!selectedCountry.hasOwnProperty("borders")){
    console.error("eroare frate");
    const err = document.querySelector("#toolbar");
    err.insertAdjacentHTML("beforeend",addElement("p","The country has no neighbours.", "error"));
    const deletePara = document.querySelectorAll("p");
    setTimeout( function ( ) {
      deletePara.forEach(para => {
        para.remove()
      })}, 1500 );
  }


  // Iterate through the borders key of selected country
  for (const border of selectedCountry.borders) {
    // Search and return the country object if it is a neighbour
    const neightbourCountry = countries.find((elem) => {
      return elem.cca3 === border;
    });



    if(!largestPopulationCountry){
      largestPopulationCountry = neightbourCountry;

    }else if(neightbourCountry.population > largestPopulationCountry.population){
      largestPopulationCountry = neightbourCountry;
    }
  }
  console.log("largestPop",largestPopulationCountry);
  return largestPopulationCountry;
}


const largestArea = () => {
  let largestAreaCountry; 

  if(!selectedCountry.hasOwnProperty("borders")){
    console.error("eroare frate");
    const err = document.querySelector("#toolbar");
    err.insertAdjacentHTML("beforeend",addElement("p","The country has no neighbours.", "error"));
    const deletePara = document.querySelectorAll("p");
    setTimeout( function ( ) {
      deletePara.forEach(para => {
        para.remove()
      })}, 1500 );
  }
  
  for (const border of selectedCountry.borders) {
    const neightbourCountry = countries.find((elem) => {
      return elem.cca3 === border;
    });
    console.log("neightbour",neightbourCountry);
    console.log("largestArea",neightbourCountry.area);
    if(!largestAreaCountry){
      largestAreaCountry = neightbourCountry;
    }else if(neightbourCountry.area > largestAreaCountry.area){
      largestAreaCountry = neightbourCountry;
    }
  }
  console.log("largestArea",largestAreaCountry);
  
  return largestAreaCountry;
}


let visitedArray = [];
let index = -1;

// Check the countries that have been selected and store them in an array
const visitedCountries = (elem, boolean) => {

  // Add the countries to the selected array only if selected or largest. Prev and next do not add new entries
  if(boolean){
    visitedArray.push(elem);
    index++;
  };

  // If selected array has at least 2 elements show the prev button
  if (index >= 1){
    document.querySelector(`#prev`).removeAttribute("hidden");
    document.querySelector("#prev").disabled = false;
  } else if (index === 0){
    document.querySelector("#prev").disabled = true;
  }

    // If index reached the last element deactivate the next button
  if (index < visitedArray.length - 1){
    document.querySelector(`#next`).removeAttribute("hidden");
    document.querySelector("#next").disabled = false;
  } else if (index === visitedArray.length - 1){
    document.querySelector("#next").disabled = true;
  }

  console.log("Index", index);
 
 return visitedArray;
};

// Get the index of the element in visited array 
const countryFromVisitedArray = () => {
  return visitedArray[index];
};

// Create the previous and next buttons
const showNextCountry = () => {

  let navigation = document.querySelector("#toolbar");
  // set to hidden by default 
  navigation.insertAdjacentHTML("beforeend", addElement("button", "Previous country", "prev"));
  navigation.insertAdjacentHTML("beforeend", addElement("button", "Next country", "next"));
  document.querySelector("#prev").setAttribute("hidden", "true");
  document.querySelector("#next").setAttribute("hidden", "true");
};


const loadEvent = () => {
  populateSelection();
  showNextCountry();

  const dropdown = document.querySelector(`#all`);
  dropdown.addEventListener("change", (event) => {
    selectedCountry = countries.find(
      (country) => country.name.common === event.target.value
    );
    displayMainSection(selectedCountry, true);
  });

  const largestPopButton = document.querySelector(`#population`);
  largestPopButton.addEventListener("click", (event) => {
    displayMainSection(largestPopulation(), true);
  })

  const largestAreaButton = document.querySelector(`#area`);
  largestAreaButton.addEventListener("click", (event) => {
    displayMainSection(largestArea(), true);
  });

  const prevButton = document.querySelector(`#prev`);
  prevButton.addEventListener("click", (event) => {
    if(index > 0){
      index--;
    }

    displayMainSection(countryFromVisitedArray(), false); 
  });

  const nextButton = document.querySelector(`#next`);
  nextButton.addEventListener("click", (event) => {

    if(index < visitedArray.length){
      index++;
    };

    displayMainSection(countryFromVisitedArray(), false); 
  });

  const firstSelect = document.querySelector("#toolbar > select:first-child");
  firstSelect.addEventListener("change", (event) => {
    document.querySelector("main > h1").textContent = selectedCountry.translations[event.target.value].common;
    console.log(selectedCountry.translations[event.target.value].common);
  });
};




// Previous and next buttons


//2nd Task
//Add eventlistener to the selec html element (onchange event => rule function wich returns the correct contry object. (data.find(elemen) => element.name.common === event.target.value)))
//List the properties of the country described by the task

window.addEventListener("load", loadEvent);