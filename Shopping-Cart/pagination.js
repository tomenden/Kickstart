/**
 * Created by tome on 7/1/15.
 */

function goToPage(pageNumber) {
    var ce = new CustomEvent('goToPage', {'detail': pageNumber});
    document.dispatchEvent(ce);
}

document.addEventListener('goToPage', goToPage2);

var currentPage = 1;

function goToPage2(event) {
    var pageNumber = event.detail;
    currentPage = pageNumber;
    var itemsTableContent = createItemsTableContent(pageNumber);
    itemsTableBody.innerHTML = ""; // reset itemsTableBody
    itemsTableBody.appendChild(itemsTableContent);
    updatePageButtonClasses(pageNumber);
    drawAddToCart(pageNumber);
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

