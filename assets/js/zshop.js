jQuery(document).ready(function ($) {

    const goToCartIcon = function ($addTocartBtn) {
        const $cartIcon = $(".my-cart-icon");
        const $image = $('<img width="30px" height="30px" src="' + $addTocartBtn.data("image") + '"/>').css({
            "position": "fixed",
            "z-index": "999"
        });
        $addTocartBtn.prepend($image);
        let position = $cartIcon.position();
        $image.animate({
            top: position.top,
            left: position.left
        }, 500, "linear", function () {
            $image.remove();
        });
    };

    $('.my-cart-btn').myCart({
        currencySymbol: 'GHS',
        classCartIcon: 'my-cart-icon',
        classCartBadge: 'my-cart-badge',
        classProductQuantity: 'my-product-quantity',
        classProductRemove: 'my-product-remove',
        classCheckoutCart: 'my-cart-checkout',
        affixCartIcon: true,
        showCheckoutModal: true,
        numberOfDecimals: 2,
        // cartItems: [
        //     {id: '1_red_xxl', name: 'product 1',size:'xxl',color:'red', summary: 'summary 1', price: 10, quantity: 1, image: 'images/img_1.png'},
        //     {id: '2_blue_sm', name: 'product 2',size:'sm',color:'blue', summary: 'summary 2', price: 20, quantity: 2, image: 'images/img_2.png'},
        //     {id: '3_red_xl', name: 'product 3',size:'xl',color:'red', summary: 'summary 3', price: 30, quantity: 1, image: 'images/img_3.png'}
        // ],
        clickOnAddToCart: function ($addTocart) {
            $('#cart-btn').show();
            goToCartIcon($addTocart);
        },
        afterAddOnCart: function (products, totalPrice, totalQuantity) {
            localStorage.checkoutData = JSON.stringify({products:products, totalPrice:totalPrice, totalQuantity:totalQuantity});
            console.log("afterAddOnCart", products, totalPrice, totalQuantity);
        },
        clickOnCartIcon: function ($cartIcon, products, totalPrice, totalQuantity) {
            console.log("cart icon clicked", $cartIcon, products, totalPrice, totalQuantity);

        },
        checkoutCart: function (products, totalPrice, totalQuantity) {
            window.location.href="checkout.html";
        },
        getDiscountPrice: function (discount, products, totalPrice, totalQuantity) {
            console.log("calculating discount", products, totalPrice, totalQuantity);
            return totalPrice * discount;
        },
        clickDiscountPrice: function (products,totalDiscountPrice,totalQuantity) {
            localStorage.checkoutData = JSON.stringify({products:products, totalPrice:totalDiscountPrice, totalQuantity:totalQuantity});
        }
    });

    $('.color-indicator').on('click', function (evt) {
        let $this = $(this);
        let color = $this.data('color');
        console.log(color);
        $('#color-label').text(color);
        let cart_btn = $('.my-cart-btn');
        //cart_btn=cart_btn[0];
        let prod_id = cart_btn.data('id');

        //change id so same prod with different color will be show differently
        let sid = prod_id.split('_');
        sid[1] = color;
        prod_id = sid.join('_');

        cart_btn.data('color', color);
        cart_btn.data('id', prod_id);
    });

    $('.size-btn').on('click', function (evt) {
        let $this = $(this);
        let size = $this.text();
        console.log(size);
        $('#size-label').text(size);
        let cart_btn = $('.my-cart-btn');
        //cart_btn=cart_btn[0];
        let prod_id = cart_btn.data('id');

        //change id so same prod with different size will be show differently
        let sid = prod_id.split('_');
        sid[2] = size;
        prod_id = sid.join('_');

        cart_btn.data('size', size);
        cart_btn.data('id', prod_id);
    });


    //shop gallery

    $(".tb").hover(function () {

        $(".tb").removeClass("tb-active");
        $(this).addClass("tb-active");

        current_fs = $(".active");

        next_fs = $(this).attr('id');
        next_fs = "#" + next_fs + "1";

        $("fieldset").removeClass("active");
        $(next_fs).addClass("active");

        current_fs.animate({}, {
            step: function () {
                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                next_fs.css({
                    'display': 'block'
                });
            }
        });
    });

});


// function colorChooser(color){
//     let cart_btn = document.getElementsByClassName('my-cart-btn');
//     cart_btn=cart_btn[0];
//     let prod_id = cart_btn.getAttribute('data-id');
//
//     //change id so same prod with different color will be show differently
//     let sid =prod_id.split('_');
//     sid[1]=color;
//     prod_id = sid.join('_');
//
//
//     cart_btn.setAttribute('data-color',color);
//     cart_btn.setAttribute('data-id',prod_id);
//
//
// }
//
// function sizeChooser(size){
//     let cart_btn = document.getElementsByClassName('my-cart-btn');
//     cart_btn=cart_btn[0];
//     let prod_id = cart_btn.getAttribute('data-id');
//
//     //change id so same prod with different color will be show differently
//     let sid =prod_id.split('_');
//     sid[2]=size;
//     prod_id = sid.join('_');
//
//      cart_btn.setAttribute('data-size',size);
//       cart_btn.setAttribute('data-id',prod_id);
// }
//
