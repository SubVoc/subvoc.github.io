var learningList = [];
var newList = [];
var knowList = [];
var removeWordList = [];
var dictionary = JSON.parse(localStorage.getItem("Dictionary")) || {};
var saveButton;
var previousLearningList = [...learningList];
var previousNewList = [...newList];
var previousKnowList = [...knowList];
var tooltip;

{

  window.onload = function () {
    
    initLocalStorage();
    saveButton = document.getElementById('saveButton');
    knowList = localStorage.getItem('KnowWords').split(',').filter(function (element) {
      return element.trim() !== '';
    });
    newList = localStorage.getItem('NewWords').split(',').filter(function (element) {
      return element.trim() !== '';
    });
    learningList = localStorage.getItem('LearningWords').split(',').filter(function (element) {
      return element.trim() !== '';
    });
    removeWordList = JSON.parse(localStorage.getItem('RemoveWords') || '[]');


    //===============================================================================
    const columns = document.querySelectorAll('.column');
    columns.forEach((column, index) => {
      switch (index) {
        case 0:
          learningList.forEach(card => {
            createChip(card, column, '1');
          });
          break;
        case 1:
          newList.forEach(card => {
            createChip(card, column, '2');
          });
          break;
        case 2:
          knowList.forEach(card => {
            createChip(card, column, '3');
          });
          break;
      }

      column.addEventListener('dragover', dragOver);
      column.addEventListener('drop', drop);
    });
    //========================================================//

    //========================================================//
    const closeDialogButton = document.getElementById('close-dialog-button');
    const dialogContainer = document.getElementById('dialog-container');
    const dialogOverlay = document.getElementById('dialog-overlay');
    const dialogInput = document.getElementById('dialog-input');
    const dialogSubmit = document.getElementById('dialog-submit-button');

    closeDialogButton.addEventListener('click', () => {
      dialogContainer.style.display = 'none';
      dialogOverlay.style.display = 'none';
    });

    dialogOverlay.addEventListener('click', () => {
      dialogContainer.style.display = 'none';
      dialogOverlay.style.display = 'none';
    });

    dialogInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        submitDialog();
      }
    });

    dialogSubmit.addEventListener('click', (event) => {
      submitDialog();
    });

    function submitDialog() {
      dictionary = JSON.parse(localStorage.getItem("Dictionary")) || {};
      const dialogInput = document.getElementById('dialog-input');
      const dialogContainer = document.getElementById('dialog-container');
      const dialogOverlay = document.getElementById('dialog-overlay');
      const key = document.getElementById('dialog-title').innerHTML;
      dictionary[key] = dialogInput.value;
      const dictString = JSON.stringify(dictionary);
      localStorage.setItem("Dictionary", dictString);
      console.log('Dialog submitted:', dialogInput.value);
      dialogContainer.style.display = 'none';
      dialogOverlay.style.display = 'none';
    }

  }
  removeChip = function (event) {
    removeWordList.push(event.target.parentElement.innerHTML.split('<')[0]);
    switch (event.target.parentElement.id.slice(-1)) {
      case '1':
        learningList = learningList.filter(e => e !== event.target.parentElement.innerHTML.split('<')[0]);
        break;

      case '2':
        newList = newList.filter(e => e !== event.target.parentElement.innerHTML.split('<')[0]);
        break;

      case '3':
        knowList = knowList.filter(e => e !== event.target.parentElement.innerHTML.split('<')[0]);
        break;

      default:
        break;
    }
    saveButton.classList.remove('btn-warning');
    saveButton.classList.add('btn-danger2');
    tooltip.style.display = 'none';
    event.target.parentElement.remove();
    event.stopPropagation();
  }
  openDialog = function (card) {
    const dialogTitle = document.getElementById('dialog-title');
    const dialogInput = document.getElementById('dialog-input');
    const dialogContainer = document.getElementById('dialog-container');
    const dialogOverlay = document.getElementById('dialog-overlay');
    dialogTitle.innerText = card;
    dialogInput.value = dictionary[card] || '';
    dialogContainer.style.display = 'block';
    dialogOverlay.style.display = 'block';

  }
  function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.textContent);
    e.dataTransfer.setData('ColumnName', e.currentTarget.id);
  }
  var fromColumnNo = null;

  function dragOver(e) {

    localStorage.setItem("SourceColumn", e.currentTarget.id);
    e.preventDefault();
  }

  function drop(e) {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain');
    const colName = e.dataTransfer.getData('ColumnName');
    const sourceColDetails = colName.split("-");
    const sourceColName = sourceColDetails[0];
    const sourceColNo = sourceColDetails[1];

    var target = e.target;
    while (!target.classList.contains('column')) {
      target = target.parentNode;
    }

    const targetColNo = target.id.slice(-1);
    var chip = document.getElementById(colName);
    chip.setAttribute('id', sourceColName.concat('-', targetColNo));
    target.appendChild(chip);
    updateArrays(word, sourceColName, sourceColNo, targetColNo);
    checkDifference();
  }

  function updateArrays(word, sourceColName, sourceColNo, targetColNo) {

    const cardArray = [learningList, newList, knowList];
    targetColId = parseInt(targetColNo);
    sourceColNo = parseInt(sourceColNo);

    let oldArray, newArray;
    oldArray = cardArray[sourceColNo - 1];
    newArray = cardArray[targetColId - 1];
    const index = oldArray.indexOf(word);
    oldArray = oldArray.splice(index, 1);
    newArray.push(word);
  }

  function initLocalStorage() {
    let check = localStorage.getItem('RemoveWords');

    if (check) {
      console.log('Remove Words exists');
    } else {
      console.log('Remove Words Dont is not found');
      localStorage.setItem('RemoveWords', '[]')
    }

    check = localStorage.getItem('NewWords');

    if (check) {
      console.log('Remove Words exists');
    } else {
      console.log('New Words Dont is not found');
      localStorage.setItem('NewWords', '')
    }

    check = localStorage.getItem('KnowWords');

    if (check) {
      console.log('Remove Words exists');
    } else {
      console.log('Know words Dont is not found');
      localStorage.setItem('KnowWords', '')
    }

    check = localStorage.getItem('LearningWords');

    if (check) {
      console.log('Learning Words exists');
    } else {
      console.log('New Words Dont is not found');
      localStorage.setItem('LearningWords', '')
    }
  }

}
function createChip(card, column, colNo) {
  tooltip = document.getElementById('tooltip');
  tooltip.style.display = 'none';
  const chip = document.createElement('div');
  chip.addEventListener('click', () => openDialog(card));
  chip.setAttribute('id', card.concat('-', colNo));
  chip.classList.add('card');
  chip.addEventListener('mouseover', () => showTooltip(chip));
  chip.addEventListener('mouseout', () => hideTooltip());
  chip.setAttribute('draggable', true);
  chip.textContent = card;
  const close = document.createElement('span');
  close.classList.add('close');
  close.addEventListener('click', (event) => removeChip(event));
  chip.appendChild(close);
  chip.addEventListener('dragstart', dragStart);
  column.appendChild(chip);
}
//=====================================//
function showTooltip(chip) {
  // Get the button position and dimensions
  var buttonRect = chip.getBoundingClientRect();
  tooltip.textContent = dictionary[chip.innerText.split('>')[0]] || '';
  var buttonRect2 = chip.parentElement.getBoundingClientRect();
  tooltip.style.top = `${visualViewport.pageTop + buttonRect.top - tooltip.offsetHeight}px`;
  tooltip.style.left = `${buttonRect.left - tooltip.offsetWidth / 2 + buttonRect.width}px`;
  tooltip.style.display = 'block';
}

function hideTooltip() {
  tooltip.style.display = 'none';
}
//=====================================//
function saveState() {
  previousLearningList = [...learningList];
  previousNewList = [...newList];
  previousKnowList = [...knowList];
  //removeWordList = knowList + learningList + removeWordList;
  removeWordList = removeWordList.concat(knowList).concat(learningList);
  removeWordList = removeWordList.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
  localStorage.setItem('RemoveWords', JSON.stringify(removeWordList));
  localStorage.setItem('NewWords', newList);
  localStorage.setItem('KnowWords', knowList);
  localStorage.setItem('LearningWords', learningList);
  checkDifference();
}

function checkDifference() {
  if (JSON.stringify(learningList) !== JSON.stringify(previousLearningList) ||
    JSON.stringify(newList) !== JSON.stringify(previousNewList) ||
    JSON.stringify(knowList) !== JSON.stringify(previousKnowList)) {
    saveButton.classList.remove('btn-warning');
    saveButton.classList.add('btn-danger2');
  } else {
    saveButton.classList.remove('btn-danger2');
    saveButton.classList.add('btn-warning');
  }
}

function goScrolling() {
  let section2 = document.getElementById('lableHedings');
  var screenHeight = window.innerHeight; // get the height of the viewport
  var offsetPercentage = 0.17; // set the offset percentage
  var offset = screenHeight * offsetPercentage; // calculate the offset value
  window.scrollTo({
    top: section2.offsetTop + offset, // add the offset to the section's offsetTop
    behavior: "smooth"
  });

}

