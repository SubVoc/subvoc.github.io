function handleFileSelect() {
    var input = document.getElementById("fileInput");
    input.click();

}
function handleInputChange(event) {
    var obj = $('#draganddrophandler');
    var path = event.target.value;
    handleFileUpload(event.target.files, obj);

    //selectedFile = event.target.files[0];
}

function handleFileSelect() {
    var input = document.getElementById("fileInput");
    input.click();

}
function handleInputChange(event) {
    var obj = $('#draganddrophandler');
    var path = event.target.value;
    handleFileUpload(event.target.files, obj);

    //selectedFile = event.target.files[0];
}
var rowCount = 0;
var added = false;
function createStatusbar(obj) {
    if (!added) {
        added = true;
        rowCount++;
        var row = "odd";
        if (rowCount % 2 == 0) row = "even";
        this.statusbar = $("<div id='statusBar'  class='statusbar " + row + "'></div>");
        this.filename = $("<div id='fileName' class='filename'></div>").appendTo(this.statusbar);
        //this.size = $("<div class='filesize'></div>").appendTo(this.statusbar);
        //this.progressBar = $("<div class='progressBar'><div></div></div>").appendTo(this.statusbar);
        this.abort = $("<div id=deleteFileBt class='abort'>X</div>").appendTo(this.statusbar);
        this.process = $("<div class='proceed' onclick='findWords(subFile)'>Find Words</div>").appendTo(this.statusbar);
        obj.after(this.statusbar);
        const abortBt = document.getElementById("deleteFileBt");
        const element = document.getElementById("statusBar");

        abortBt.addEventListener("click", function () {
            element.parentNode.removeChild(element);
            added = false
            document.getElementById("browsBt").classList.remove("gray-out");
            var fInput = document.getElementById("fileInput");
            fInput.value = ""

        });
        this.setFileNameSize = function (name, size) {
            var sizeStr = "";
            var sizeKB = size / 1024;
            if (parseInt(sizeKB) > 1024) {
                var sizeMB = sizeKB / 1024;
                sizeStr = sizeMB.toFixed(2) + " MB";
            }
            else {
                sizeStr = sizeKB.toFixed(2) + " KB";
            }

            this.filename.html(name);

        }
        this.setProgress = function (progress) {
            var progressBarWidth = progress * this.progressBar.width() / 100;
            this.progressBar.find('div').animate({ width: progressBarWidth }, 10).html(progress + "% ");
            if (parseInt(progress) >= 100) {
                this.abort.hide();
            }
        }
        this.setAbort = function (jqxhr) {
            var sb = this.statusbar;
            this.abort.click(function () {
                //jqxhr.abort();
                //sb.hide();
            });
        }

    } else {
        alert("Let's take baby steps. One watch at a time. Please remove the current file to add a different one.")
    }
    //document.getElementById("browsBt").classList.toggle("gray-out");


}
var subFile=null;
function handleFileUpload(files, obj) {
    for (var i = 0; i < files.length; i++) {
        var fd = new FormData();
        fd.append('file', files[i]);
        var status = new createStatusbar(obj);
        subFile=files[i];
        status.setFileNameSize(files[i].name, files[i].size);
    }
}



window.addEventListener('load', function() {
    var obj = document.getElementById('draganddrophandler');
    obj.addEventListener('dragenter', function(e) {
        e.stopPropagation();
        e.preventDefault();
        obj.classList.add('dragover');
    });
    obj.addEventListener('drop', function(e) {
        obj.classList.remove('dragover');
        e.preventDefault();
        var files = e.dataTransfer.files;
        handleFileUpload(files, obj);
    });

    document.addEventListener('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
        obj.classList.add('dragover');
    });
    document.addEventListener('dragleave', function(e) {
        e.stopPropagation();
        e.preventDefault();
        obj.classList.remove('dragover');
    });
});


let images = ['assets/images/23-4-30/4.jpg',
'assets/images/23-4-30/1.jpg',
'assets/images/23-4-30/1.jpeg',
'assets/images/23-4-30/2.jpg', 
'assets/images/23-4-30/3.jpg', 
'assets/images/23-4-30/5.jpg',
'assets/images/23-4-30/6.jpg',
'assets/images/23-4-30/7.jpg',
'assets/images/23-4-30/8.jpg',
'assets/images/23-4-30/15.jpg',
'assets/images/23-4-30/12.jpg'];

let index = 0;
const imgElement = document.querySelector('#mainPhoto');

function change() {
    const backbackElement = document.getElementById('backback');
    backbackElement.style.transition = 'background-image 1s ease-in-out';
    backbackElement.style.backgroundImage = 'url("' + images[index] + '")';
    index < images.length-1 ? index++:index = 0 ;
}


window.onload = function () {
    setInterval(change, 5000);
};

//===========================================================================//
var storedWordsArray = [];
var newWordsArray = [];
var newAndOldWordsArray = [];
var words = '';
var wordArray = [];
var removeWordList = [];
var newWordList = [];
var newWordsInThisList = [];
var fr = new FileReader();

function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    section.scrollIntoView({behavior: 'smooth'});
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
}
fr.onload = function () {
    //console.log(fr.result);
    words = fr.result.replace(/\n/g, ' ');
    words = words.replace(/[0-9]/g, '');
    words = words.replace(/[^\w\s]/gi, '')
    words = words.replace(/\s\s+/g, ' ');

    // Removing Douplicate words
    words = words
        .split(' ')
        .filter((currentItem, i, allItems) => {
            return i === allItems.indexOf(currentItem);
        })
        .join(' ');
    words = words.toUpperCase();
    wordArray = words
        .split(' ')
        .filter((currentItem, i, allItems) => {
            return i === allItems.indexOf(currentItem);
        });
    //console.log(wordArray);
    removeWordList = removeWordList.map(function (x) {
        return x.toUpperCase();
    });
    wordArray = wordArray.filter(function (word) {
        return removeWordList.indexOf(word) < 0;
    });
    newWordsInThisList = wordArray.filter(function (word) {
        return newWordList.indexOf(word)
            < 0;
    });
    console.log("Setting Remove words: \n" + wordArray);
    words = wordArray.join(' ');
    //setting values to local storage 
    localStorage.setItem('RemoveWords', JSON.stringify(removeWordList));
    newWordList = newWordList.concat(newWordsInThisList).sort();
    //setting values to local storage 
    localStorage.setItem('NewWords', newWordList);

    //setting value to inerface 
    //document.getElementById('output').textContent = words;
}
function findWords(file) {
    if (file!=null) {
        initLocalStorage();


    // Rtreiveing remove words from local storage
    removeWordList = JSON.parse(localStorage.getItem('RemoveWords').toUpperCase());
    newWordList = localStorage.getItem('NewWords').toUpperCase().split(',');


    console.log("Remove Word List: \n" + removeWordList);
    
    fr.readAsText(file); 
    console.log(wordArray);
    window.location.href = './page1.html';
    } else {
        alert("Subtitle file is empty");
    }
    
}