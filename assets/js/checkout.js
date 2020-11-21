jQuery(document).ready(function ($) {

    let checkoutData;
    try {
        checkoutData = JSON.parse(localStorage.checkoutData);
    } catch (e) {
        checkoutData = null;
    }
    console.log(checkoutData);
    // not secure
    if (checkoutData == null) {
        alert('check out data empty');
        window.location.replace('/index.html');
        return;
    }


    let totalQuantity = $('#total_quantity');
    let totalPrice =$('#total_price');

    totalPrice.text('GHS '+checkoutData.totalPrice);
    totalQuantity.text(checkoutData.totalQuantity);

});

