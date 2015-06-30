/**
 * Created by tome on 6/29/15.
 */
var tBody = document.querySelector('tbody');
//var fragment = document.createDocumentFragment();
var headers = document.querySelectorAll('th');
var headersOrder = [];
var itemsPerPage = 5; //TODO: Move to input for user selection
var itemCount = ITEMS.length;
var pagesCount = Math.ceil(itemCount / itemsPerPage);

function createSelectElement(arrayLength, index) {
    var selectElement = document.createElement('select');
    selectElement.setAttribute('onchange', 'handleChangeRow(this)');
    fillOptions(selectElement, arrayLength, index);
    return selectElement;
}

function fillOptions(selectElement, arrayLength, index) {
    for (var row = 1; row <= arrayLength; row++) {
        var optionElement = document.createElement('option');
        optionElement.setAttribute('value', row.toString());
        optionElement.textContent = row;
        selectElement.appendChild(optionElement);
    }
    selectElement.selectedIndex = index;

}

(function getHeadersOrder() {
    for (var i = 0; i < headers.length; i++) {
        headersOrder.push(headers[i].dataset.field);
    }
})();

function updateSelected() {
    var allSelects = tBody.querySelectorAll('select');
    for (var i = 0; i < allSelects.length; i++) {
        allSelects[i].selectedIndex = allSelects[i].parentElement.parentElement.sectionRowIndex;
    }
}

function handleChangeRow(select) {
    var selected = select.value;
    var tr = tBody.removeChild(select.parentElement.parentElement);
    var newRow = document.querySelector('tbody > tr:nth-child(' + selected + ')');
    if (newRow) {
        tBody.insertBefore(tr, newRow);
    } else {
        tBody.appendChild(tr);
    }
    updateSelected();
}

function createPaginationDiv() {
    var tFoot = document.querySelector('tFoot');
    var paginationFragment = document.createDocumentFragment();
    var div = document.createElement('div');
    div.setAttribute('class', 'pagesButtons');
    for (var i = 0; i < pagesCount; i++) {
        var pageNum = i + 1;
        var button = document.createElement('button');
        button.setAttribute('onclick', 'goToPage(' + pageNum + ')');
        button.textContent = pageNum;
        div.appendChild(button);
    }
    paginationFragment.appendChild(div);
    tFoot.appendChild(paginationFragment);
};

function createPageFragment(pageNumber) {
    var pageFragment = document.createDocumentFragment();
    var start = pageNumber * itemsPerPage - itemsPerPage;
    var end = (start + itemsPerPage) < itemCount ? start + itemsPerPage : itemCount;
    for (var i = start; i < end; i++) {
        var item = ITEMS[i];
        var tr = document.createElement('tr');
        for (var j = 0; j < headersOrder.length; j++) {
            var td = document.createElement('td');
            if (headersOrder[j] === 'select-row') {
                td.appendChild(createSelectElement(end - start, i));
            } else {
                td.textContent = item[headersOrder[j]];
            }
            tr.appendChild(td);
        }

        pageFragment.appendChild(tr);
    }
    return pageFragment;
}

function updatePageButtonClasses(pageNumber) {
    var allButtons = document.querySelectorAll('.pagesButtons > button');
    var pageIndex = pageNumber - 1;
    for (var i = 0; i < allButtons.length; i++) {
        if (i === pageIndex) {
            allButtons[i].setAttribute('class', 'currentPage');
        } else {
            allButtons[i].removeAttribute('class');
        }
    }
}

function goToPage(pageNumber) {
    var pageFragment = createPageFragment(pageNumber);
    tBody.innerHTML = ""; // reset tBody
    tBody.appendChild(pageFragment);
    updatePageButtonClasses(pageNumber);
    updateSelected();
}

(function init() {
    createPaginationDiv();
    goToPage(1);
})();