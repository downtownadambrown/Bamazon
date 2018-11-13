const clearTable = function () {
    $('.admin-table-row').remove();
};

const clearTableHeader = function () {
    $('#admin-table-header-row').remove();
};

const clearComponents = function () {
    clearTable();
    clearTableHeader();

    //hide submit button
    $('#submitButton').fadeOut();
};

const renderProduct = function () {

    $.ajax({
        url: '/api/product',
        type: 'GET'
    }).then(function (rows) {
        
        // Reset the components before painting the div
        clearComponents();

        // **Receiving an array of objects **
        //   Schema of object:
        //   - id: integer (primary key)
        //   - product_name: String
        //   - department_name:  String
        //   - price: Real
        //   - stock_quantity:  Integer

        $('#submitButton').fadeIn().on('click', submitOrder);

        let newHeader = $(`<tr id="admin-table-header-row">
                                <th scope="col">PID#</th>
                                <th scope="col">Product Name</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Unit Price</th>
                                <th scope="col" class="text-center">Add to your order</th>
                                <th scope="col">Subtotal</th>
                            </tr>`);
        $('#admin-table-header').append(newHeader);

        for (let i = 0; i < rows.length; i++) {
            let newRow = $(`<tr class="admin-table-row">
                                <td scope="row">${rows[i].id}</th>
                                <td id="${rows[i].id}" class="rowID">${rows[i].product_name}</td>
                                <td id="quantity${i}">${rows[i].stock_quantity}</td>
                                <td id="price${i}">$${rows[i].price}</td>
                                <td class="text-center d-flex justify-content-center align-middle">
                                    <div id="miniwrapper" class="align-middle d-flex flex-row align-items-center justify-content-between">
                                        <div class="minButton"><i id="minus${i}" class="fas fa-minus-circle p-1"></i></div>
                                        <div class="addQty" id="addQty${i}">0</div>
                                        <div class="addButton"><i id="plus${i}" class="fas fa-plus-circle p-1"></i></div>                                      
                                    </div>
                                </td>
                                <td id="subtotal${i}">$0.00</td>
                            </tr>`);
            $('#admin-table-body').append(newRow);

            // Set the event listeners on this i-th row

            $(`#minus${i}`).on('click', function () {

                // Making sure they aren't trying to go below zero first
                // If they are -- warn them w/ red blinky blinky text
                let addQuantity = parseInt($(`#addQty${i}`).text());
                if (addQuantity === 0) {
                    $(`#addQty${i}`).css('color', 'red').fadeOut('normal', function () {
                        $(this).fadeIn('normal', function () {
                            $(this).css('color', 'black');
                        });
                    });
                    return;
                }

                // Grabbing the Quantity for modification
                let qty = parseInt($(`#addQty${i}`).text());
                qty--;
                $(`#addQty${i}`).text(qty);

                // Grabbing HTML data to modify SubTotal per unit price
                let price = $(`#price${i}`).text().slice(1);
                const currentSubtotal = $(`#subtotal${i}`).text().slice(1);
                const newprice = Number(price);
                let newSubtotal = parseFloat(currentSubtotal) - newprice;
                newSubtotal = newSubtotal.toFixed(2);

                // Set the new subtotal for this product in the page
                $(`#subtotal${i}`).text(`$${newSubtotal}`);

            });
            $(`#plus${i}`).on('click', function () {
                // Making sure they aren't trying to go above the stock qty
                // If they are -- warn them w/ red blinky blinky text
                let addQuantity = parseInt($(`#addQty${i}`).text());
                let stockQuantity = parseInt($(`#quantity${i}`).text());

                if (addQuantity === stockQuantity) {
                    $(`#addQty${i}`).css('color', 'red').fadeOut('normal', function () {
                        $(this).fadeIn('normal', function () {
                            $(this).css('color', 'black');
                        });
                    });
                    return;
                }

                // Grabbing the Quantity for modification
                let qty = parseInt($(`#addQty${i}`).text());
                qty++;
                $(`#addQty${i}`).text(qty);

                // Grabbing HTML data to modify SubTotal per unit price
                let price = $(`#price${i}`).text().slice(1);
                const currentSubtotal = $(`#subtotal${i}`).text().slice(1);
                const newprice = Number(price);
                let newSubtotal = parseFloat(currentSubtotal) + newprice;
                newSubtotal = newSubtotal.toFixed(2);

                // Set the new subtotal for this product in the page
                $(`#subtotal${i}`).text(`$${newSubtotal}`);

            });
        }
    });
};

const submitOrder = function () {
    let putData = { data: [] };
    let activeRows = document.querySelectorAll('.rowID');
    

    for (let i = 0; i < activeRows.length; i++) {
        const idKey = activeRows[i].id;
        const qtyToBuy = parseInt($(`#addQty${idKey - 1}`).text());
        const currentQty = parseInt($(`#quantity${idKey - 1}`).text());

        if (qtyToBuy > 0) {
            putData.data.push({
                id: idKey,
                qty: currentQty - qtyToBuy
            });
        }
    }

    $.ajax({
        url: '/api/product',
        type: 'PUT',
        data: putData
    }).then(function (rows) {
        renderProduct();
    });
}

$(document).ready(() => {
    //Event listener for View Products Button
    $("#view-product-button").on("click", renderProduct);

});
