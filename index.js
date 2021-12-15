var number = 6;

var table = document.getElementById('table');

let cellArray;

let timeout = 500;

let Max = 4;

let condition = conditionConway;

conwaysGame();

let interval = setInterval(nextGenerationAndEditHTML, timeout);

function conwaysGame() {

    createCellArray(number);
    for (i = 0; i < number; i++) {
        let tr = document.createElement('tr');
        table.appendChild(tr);
        for (j = 0; j < number; j++) {
            let td = document.createElement('td');
            tr.appendChild(td);

        }
    }
    updateHTML();
}

function startAgain() {
    createCellArray(number);
    updateHTML();
}

function liklyhood(event) {
    switch (event.target.value) {
        case 'low':
            Max = 8;
            break;
        case 'medium':
            Max = 4; break;
        case 'larg':
            Max = 2;
            break;
    }
}

function delay(event) {
    switch (event.target.value) {
        case 'very_slow':
            timeout = 2000;
            break;
        case 'slow':
            timeout = 1000;
            break;
        case 'normal':
            timeout = 500;
            break;
        case 'fast':
            timeout = 200;
            break;
        case 'very_fast':
            timeout = 0;
            break;
    };

    if (interval) {
        clearInterval(interval);
        interval = setInterval(nextGenerationAndEditHTML, timeout);
    }
}

function updateNumber(event) {
    clearInterval(interval);
    interval = null;

    switch (event.target.value) {
        case '6':
            number = 6;
            break;
        case '8':
            number = 8;
            break;
        case '10':
            number = 10;
            break;
        case '15':
            number = 15;
            break;
        case '20':
            number = 20;
            break;
        case '30':
            number = 30;
            break;
        case '50':
            number = 50;
            break;
        case '75':
            number = 75;
            break;
        case '100':
            number = 100;
            break;
    };
    table.innerHTML = '';
    console.log('remove: ' + table);
    conwaysGame();
    interval = setInterval(nextGenerationAndEditHTML, timeout);
}

function stopOrContinue(event) {
    let button = event.target;
    if (interval) {
        clearInterval(interval);
        interval = null;
        button.innerHTML = 'continue';
    }
    else {
        interval = setInterval(nextGenerationAndEditHTML, timeout);
        button.innerHTML = 'stop';

    }
}

function changeFromLiveOrDead(event) {

    let target = event.target;
    let parent = target.parentNode;
    let grandFather = parent.parentNode;
    let j = Array.from(parent.children).indexOf(target);
    let i = Array.from(grandFather.children).indexOf(parent);
    cellArray[i][j].alive = !cellArray[i][j].alive;
    if (cellArray[i][j].alive)
        target.style.backgroundColor = 'crimson';
    else
        target.style.backgroundColor = 'white';
}


//setInterval(nextGenerationAndEditHTML,200);

function nextGenerationAndEditHTML() {
    nextGneration();
    updateHTML();
}

function updateHTML() {
    for (i = 0; i < table.children.length; i++) {
        let tr = table.children.item(i);
        for (j = 0; j < tr.children.length; j++) {
            let td = tr.children.item(j);
            if (cellArray[i][j].alive) {
                td.style.backgroundColor = 'crimson';
            } else {
                td.style.backgroundColor = 'white';
            }
        }
    }
}


function createCellArray(number) {
    cellArray = []
    for (let i = 0; i < number; i++) {
        cellArray.push([]);

        for (let j = 0; j < number; j++) {
            rand = getRandomInt(Max);
            if (rand === 0) {
                cellArray[i].push({ alive: true, neighbors: 0 });
            } else {
                cellArray[i].push({ alive: false, neighbors: 0 });
            }
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}



function nextGneration() {
    let flag = true;

    //update neighbors field of each cell
    for (let x = 0; x < number; x++) {
        for (let y = 0; y < number; y++) {
            cellArray[x][y].neighbors = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    let oneNeighbor_x = x + i;
                    let oneNeighbor_y = y + j;
                    if (!(i === 0 && j === 0)) {
                        if (oneNeighbor_x < number && oneNeighbor_x > -1 && oneNeighbor_y < number && oneNeighbor_y > -1) {
                            if (cellArray[oneNeighbor_x][oneNeighbor_y].alive) {
                                cellArray[x][y].neighbors++;
                            }
                        }
                    }
                }
            }
        }
    }
    //update alive field of each cell
    for (let x = 0; x < number; x++) {
        for (let y = 0; y < number; y++) {
            let cellAkiveTemp = cellArray[x][y].alive;
            cellArray[x][y].alive = condition(cellArray[x][y].neighbors, cellArray[x][y].alive);
            if (cellAkiveTemp !== cellArray[x][y].alive) {
                flag = false;
            }
        }
    }
    if (flag) {    //that is a stable state
        console.log('start again');
        createCellArray(number);
    }
}

function selectCondition(event) {
    switch (event.target.value) {
        case 'conwy':
            condition = conditionConway;
            break;
        case 'hyperActive':
            condition = conditionHyperActive;
            break;
        case 'highLife':
            condition = conditionHighLife;
            break;
        case 'spontaneus':
            condition = conditionSpontaneus;
            break;
    }
}

function conditionConway(neighbors, alive) {
    if (neighbors > 3 || neighbors < 2)
        return false;
    else if (neighbors === 3)
        return true;
    else
        return alive;
}
// Some details seem to be missing, what happens when the number of neighbors of a living cell is 4 or 5? 
function conditionHyperActive(neighbors, alive) {
    if (neighbors > 5 || neighbors < 2)
        return false;
    else if (neighbors === 3)
        return true;
    else
        return alive;
}
//To the best of my knowledge it is the same as the original Canwey
function conditionHighLife(neighbors, alive) {
    if (neighbors > 3 || neighbors < 2)
        return false;
    else if (neighbors === 3)
        return true;
    else
        return alive;
}
function conditionSpontaneus(neighbors, alive) {
    return (conditionConway(neighbors, alive) || getRandomInt(2));
}