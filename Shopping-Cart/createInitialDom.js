/**
 * Created by tome on 7/1/15.
 */

function createItemsTableContent(pageNumber) {
    var itemsTableFragment = createFragment(),
        start = pageNumber * itemsPerPage - itemsPerPage,
        end = (start + itemsPerPage) < itemCount ? start + itemsPerPage : itemCount;
    for (var i = start; i < end; i++) {
        var item = ITEMS[i],
            tr = document.createElement('tr');
        for (var j = 0; j < itemsHeadersOrder.length; j++) {
            if (item[itemsHeadersOrder[j]]) {
                var td = document.createElement('td');
                td.textContent = item[itemsHeadersOrder[j]];
                tr.appendChild(td);
            }
        }
        tr.dataset.id = item['id'];// add the id of the item to data-id of the tr
        itemsTableFragment.appendChild(tr);
    }
    return itemsTableFragment;
}

function createPaginationDiv() {
    var body = document.querySelector('body');
    var firstScriptElement = document.querySelector('script');
    var table = document.querySelector('table');
    var paginationFragment = createFragment();
    var div = document.createElement('div');

    // if pagination div already exists, remove it
    if (body.querySelector('div.pagesButtons')) {
        body.querySelector('div.pagesButtons').remove();
    }

    div.setAttribute('class', 'pagesButtons');
    var pagesCount = getPagesCount();
    for (var i = 0; i < pagesCount; i++) {
        var pageNum = i + 1;
        var button = document.createElement('button');
        button.setAttribute('onclick', 'goToPage(' + pageNum + ')');
        button.textContent = pageNum;
        div.appendChild(button);
    }
    paginationFragment.appendChild(div);
    body.insertBefore(paginationFragment, firstScriptElement);
}

function drawItemsPerPageInput() {
    var div = document.createElement('div');
    var inputElement = createItemsPerPageInput();
    var itemsTable = document.querySelector('table.items-list');
    div.appendChild(inputElement);
    document.body.insertBefore(div, itemsTable.nextSibling);


}

function createItemsPerPageInput() {
    var fragment = createFragment(),
        form = document.createElement('form'),
        numberInput = document.createElement('input');

    form.innerHTML = 'Items Per Page:';
    numberInput.type = 'number';
    numberInput.max = ITEMS.length;
    numberInput.onchange = function () {setItemsPerPage(this.value);};
    form.appendChild(numberInput);
    fragment.appendChild(form);
    return fragment;


}

function setItemsPerPage(number) {
    itemsPerPage = parseInt(number);
    createPaginationDiv();
    goToPage(currentPage);

}