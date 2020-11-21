/*
 * Z Shop myCart - v1
 * Author: Zakaria Mohammed
 * redesign and improvement of jquery mycart;
 */

(function ($) {

    "use strict";

    let OptionManager = (function () {
        let objToReturn = {};

        let _options = null;
        let DEFAULT_OPTIONS = {
            currencySymbol: 'GHS ',
            classCartIcon: 'my-cart-icon',
            classCartBadge: 'my-cart-badge',
            classProductQuantity: 'my-product-quantity',
            classProductRemove: 'my-product-remove',
            classCheckoutCart: 'my-cart-checkout',
            affixCartIcon: true,
            showCheckoutModal: true,
            numberOfDecimals: 2,
            cartItems: null,
            clickOnAddToCart: function ($addTocart) {
            },
            afterAddOnCart: function (products, totalPrice, totalQuantity) {
            },
            clickOnCartIcon: function ($cartIcon, products, totalPrice, totalQuantity) {
            },
            checkoutCart: function (products, totalPrice, totalQuantity) {
                return false;
            },
            getDiscountPrice: function (discount = 1.0, products, totalPrice, totalQuantity) {
                return null;
            },
            clickDiscountPrice: function ( products, totalDiscountPrice, totalQuantity) {
                return null;
            }
        };


        let loadOptions = function (customOptions) {
            _options = $.extend({}, DEFAULT_OPTIONS);
            if (typeof customOptions === 'object') {
                $.extend(_options, customOptions);
            }
        };
        let getOptions = function () {
            return _options;
        };

        objToReturn.loadOptions = loadOptions;
        objToReturn.getOptions = getOptions;
        return objToReturn;
    }());

    let MathHelper = (function () {
        let objToReturn = {};
        let getRoundedNumber = function (number) {
            if (isNaN(number)) {
                throw new Error('Parameter is not a Number');
            }
            number = number * 1;
            let options = OptionManager.getOptions();
            return number.toFixed(options.numberOfDecimals);
        };
        objToReturn.getRoundedNumber = getRoundedNumber;
        return objToReturn;
    }());

    let ProductManager = (function () {
        let objToReturn = {};

        /*
        PRIVATE
        */
        localStorage.products = localStorage.products ? localStorage.products : "";
        /**
         * retrieve the index of a given product id
         * @param id the product id
         * @returns {number} the product array index
         */
        let getIndexOfProduct = function (id) {
            let productIndex = -1;
            let products = getAllProducts();
            $.each(products, function (index, value) {
                if (value.id === id) {
                    productIndex = index;
                    // return;
                }
            });
            return productIndex;
        };
        let setAllProducts = function (products) {
            localStorage.products = JSON.stringify(products);
        };
        let addProduct = function (id, name, size, color, summary, price, quantity, image) {
            let products = getAllProducts();
            products.push({
                id: id,
                name: name,
                size: size,
                color: color,
                summary: summary,
                price: price,
                quantity: quantity,
                image: image
            });
            setAllProducts(products);
        };

        /*
        PUBLIC
        */
        let getAllProducts = function () {
            try {
                return JSON.parse(localStorage.products);
            } catch (e) {
                return [];
            }
        };
        /**
         * just for compatibility
         * @param id
         * @param quantity
         * @returns {boolean}
         */
        let updatePoduct = function updateProduct(id, quantity) {
            return updateProduct(id, quantity);
        };
        /**
         * update a product in a cart
         * @param id
         * @param quantity
         * @returns {boolean}
         */
        let updateProduct = function (id, quantity) {
            let productIndex = getIndexOfProduct(id);
            //fixed so ids can be string as well
            if (productIndex === null || productIndex === '') {
                return false;
            }
            console.log('id:', id);
            let products = getAllProducts();
            console.log('products', products);
            if (products === null || products.length <= 0) {
                return false;
            }
            let currentProduct = products[productIndex];
            if (currentProduct == null || typeof currentProduct === "undefined") {
                return false;
            }
            currentProduct.quantity = typeof quantity === "undefined" ? products[productIndex].quantity + 1 : quantity;
            setAllProducts(products);
            return true;
        };
        let setProduct = function (id, name, size, color, summary, price, quantity, image) {
            if (typeof id === "undefined") {
                console.error("id required");
                return false;
            }
            if (typeof name === "undefined") {
                console.error("name required");
                return false;
            }

            if (typeof size === "undefined") {
                console.error("size required");
                return false;
            }

            if (typeof color === "undefined") {
                console.error("color required");
                return false;
            }

            if (typeof image === "undefined") {
                console.error("image required");
                return false;
            }
            if (!$.isNumeric(price)) {
                console.error("price is not a number");
                return false;
            }
            if (!$.isNumeric(quantity)) {
                console.error("quantity is not a number");
                return false;
            }
            summary = typeof summary === "undefined" ? "" : summary;

            if (!updateProduct(id)) {
                addProduct(id, name, size, color, summary, price, quantity, image);
            }
        };
        let clearProduct = function () {
            setAllProducts([]);
        };
        let removeProduct = function (id) {
            let products = getAllProducts();
            products = $.grep(products, function (value, index) {
                return value.id !== id;
            });
            setAllProducts(products);
        };
        let getTotalQuantity = function () {
            let total = 0;
            let products = getAllProducts();
            $.each(products, function (index, value) {
                total += value.quantity*1;
            });
            return total;
        };
        let getTotalPrice = function () {
            let products = getAllProducts();
            let total = 0;
            $.each(products, function (index, value) {
                total += value.quantity * value.price;
                total = MathHelper.getRoundedNumber(total) * 1;
            });
            return total;
        };

        objToReturn.getAllProducts = getAllProducts;
        objToReturn.updatePoduct = updateProduct;
        objToReturn.setProduct = setProduct;
        objToReturn.clearProduct = clearProduct;
        objToReturn.removeProduct = removeProduct;
        objToReturn.getTotalQuantity = getTotalQuantity;
        objToReturn.getTotalPrice = getTotalPrice;
        return objToReturn;
    }());


    let loadMyCartEvent = function (targetSelector) {

        let options = OptionManager.getOptions();
        let $cartIcon = $("." + options.classCartIcon);
        let $cartBadge = $("." + options.classCartBadge);
        let classProductQuantity = options.classProductQuantity;
        let classProductRemove = options.classProductRemove;
        let classCheckoutCart = options.classCheckoutCart;

        let idCartModal = 'my-cart-modal';
        let idCartTable = 'my-cart-table';
        let idGrandTotal = 'my-cart-grand-total';
        let idEmptyCartMessage = 'my-cart-empty-message';
        let idDiscountPrice = 'my-cart-discount-price';
        let classProductTotal = 'my-product-total';
        let classAffixMyCartIcon = 'my-cart-icon-affix';


        if (options.cartItems && options.cartItems.constructor === Array) {
            ProductManager.clearProduct();
            $.each(options.cartItems, function () {
                ProductManager.setProduct(this.id, this.name, this.size, this.color, this.summary, this.price, this.quantity, this.image);
            });
        }

        $cartBadge.text(ProductManager.getTotalQuantity());

        if (!$("#" + idCartModal).length) {
            $('body').append(
                '<div class="modal fade" id="' + idCartModal + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
                '<div class="modal-dialog" role="document">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                '<h4 class="modal-title" id="myModalLabel"><span class="glyphicon glyphicon-shopping-cart"></span> My Cart</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<table class="table table-hover table-responsive" id="' + idCartTable + '"></table>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                '<button type="button" class="btn btn-primary ' + classCheckoutCart + '">Checkout</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
            );
        }

        const drawTable = function () {
            let $cartTable = $("#" + idCartTable);
            $cartTable.empty();
            let products = ProductManager.getAllProducts();
            $.each(products, function () {
                let total = this.quantity * this.price;
                $cartTable.append(
                    '<tr title="' + this.summary + '" data-id="' + this.id + '" data-price="' + this.price + '">' +
                    '<td class="text-center" style="width: 30px;"><img width="30px" height="30px" src="' + this.image + '"/></td>' +
                    '<td><a href="#" data-dismiss="modal">' + this.name + '</a></td>' +
                    '<td>' + this.size + '</td>' +
                    '<td>' + this.color + '</td>' +
                    '<td title="Unit Price" class="text-right">' + options.currencySymbol + MathHelper.getRoundedNumber(this.price) + '</td>' +
                    '<td title="Quantity"><input type="number" min="1" style="width: 70px;" class="' + classProductQuantity + '" value="' + this.quantity + '"/></td>' +
                    '<td title="Total" class="text-right ' + classProductTotal + '">' + options.currencySymbol + MathHelper.getRoundedNumber(total) + '</td>' +
                    '<td title="Remove from Cart" class="text-center" style="width: 30px;"><a href="javascript:void(0);" class="btn btn-xs btn-danger ' + classProductRemove + '">X</a></td>' +
                    '</tr>'
                );
            });

            $cartTable.append(products.length ?
                '<tr>' +
                '<td></td>' +
                '<td><strong>Total</strong></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td class="text-right"><strong id="' + idGrandTotal + '"></strong></td>' +
                '<td></td>' +
                '</tr>' +

                '<tr>' +
                '<td></td>' +
                '<td><strong>Coupon</strong></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td></td>' +
                '<td><input type="text"  maxlength="5" size="6" id="coupon" name="coupon" placeholder="Coupon" ></td>' +
                '<td class="text-right"><button class="btn btn-xs btn-success" id="coupon_btn"  name="coupon_btn">Apply<i class="fa fa-check"></i></button> </td>' +
                '<td></td>' +
                '</tr>'
                :
                '<div class="alert alert-danger" role="alert" id="' + idEmptyCartMessage + '">Your cart is empty</div>'
            );

            let discountPrice = options.getDiscountPrice(1.0,products, ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
            if (products.length && discountPrice !== null) {
                $cartTable.append(
                    '<tr style="background-color: #f1efef;color: #eb6864">' +
                    '<td></td>' +
                    '<td><strong>Total (incl. discount)</strong></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td></td>' +
                    '<td class="text-right"><strong id="' + idDiscountPrice + '"></strong></td>' +
                    '<td></td>' +
                    '</tr>'
                );
            }

            showGrandTotal();
            showDiscountPrice();

        };
        let showModal = function () {
            drawTable();
            $("#" + idCartModal).modal('show');
        };
        let updateCart = function () {
            $.each($("." + classProductQuantity), function () {
                let id = $(this).closest("tr").data("id");
                ProductManager.updatePoduct(id, $(this).val());
            });
        };
        let showGrandTotal = function () {
            $("#" + idGrandTotal).text(options.currencySymbol + MathHelper.getRoundedNumber(ProductManager.getTotalPrice()));
        };
        let showDiscountPrice = function (discount=1.0) {
            let totalDiscountPrice = MathHelper.getRoundedNumber(options.getDiscountPrice(discount, ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity()));
            $("#" + idDiscountPrice).text(options.currencySymbol + totalDiscountPrice);
            options.clickDiscountPrice( ProductManager.getAllProducts(),totalDiscountPrice,ProductManager.getTotalQuantity());
        };

        /**
         EVENTS SECTION
         */
        if (options.affixCartIcon) {
            let cartIconBottom = $cartIcon.offset().top * 1 + $cartIcon.css("height").match(/\d+/) * 1;
            let cartIconPosition = $cartIcon.css('position');
            $(window).scroll(function () {
                $(window).scrollTop() >= cartIconBottom ? $cartIcon.addClass(classAffixMyCartIcon) : $cartIcon.removeClass(classAffixMyCartIcon);
            });
        }

        $cartIcon.click(function () {
            options.showCheckoutModal ? showModal() : options.clickOnCartIcon($cartIcon, ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
        });

        /**
         * Event fires when any quantity field get update
         * recompute total price and discount
         */
        $(document).on("input", "." + classProductQuantity, function () {
            let price = $(this).closest("tr").data("price");
            let id = $(this).closest("tr").data("id");
            let quantity = $(this).val();

            $(this).parent("td").next("." + classProductTotal).text(options.currencySymbol + MathHelper.getRoundedNumber(price * quantity));
            ProductManager.updatePoduct(id, quantity);

            $cartBadge.text('');
            $cartBadge.text(ProductManager.getTotalQuantity());
            showGrandTotal();
            //showDiscountPrice();
            $("#coupon_btn").click();
        });

        /**
         * retrieve coupon code and create discount
         */
        $(document).on("click", "#coupon_btn", function () {
            let coupon = $('#coupon').val();
            console.log('coupon code', coupon);
            if (coupon != null && coupon.length >= 5) {
                showDiscountPrice(0.5);
            } else {
                showDiscountPrice();
            }

        });

        $(document).on('keypress', "." + classProductQuantity, function (evt) {
            if (evt.keyCode === 38 || evt.keyCode === 40) {
                return;
            }
            evt.preventDefault();
        });

        $(document).on('click', "." + classProductRemove, function () {
            let $tr = $(this).closest("tr");
            let id = $tr.data("id");
            $tr.hide(500, function () {
                ProductManager.removeProduct(id);
                drawTable();
                $cartBadge.text(ProductManager.getTotalQuantity());
            });
        });

        $(document).on('click', "." + classCheckoutCart, function () {
            let products = ProductManager.getAllProducts();
            if (!products.length) {
                $("#" + idEmptyCartMessage).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
                return;
            }
            updateCart();
            let isCheckedOut = options.checkoutCart(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());
            if (isCheckedOut !== false) {
                ProductManager.clearProduct();
                $cartBadge.text(ProductManager.getTotalQuantity());
                $("#" + idCartModal).modal("hide");
            }
        });

        $(document).on('click', targetSelector, function () {

            let $target = $(this);
            console.log($target);

            options.clickOnAddToCart($target);

            let id = $target.data('id');
            let name = $target.data('name');
            let summary = $target.data('summary');
            let price = $target.data('price');
            let quantity = $target.data('quantity');
            let image = $target.data('image');
            let size = $target.data('size');
            let color = $target.data('color');

            ProductManager.setProduct(id, name, size, color, summary, price, quantity, image);
            $cartBadge.text(ProductManager.getTotalQuantity());

            options.afterAddOnCart(ProductManager.getAllProducts(), ProductManager.getTotalPrice(), ProductManager.getTotalQuantity());

        });

    };


    $.fn.myCart = function (userOptions) {
        OptionManager.loadOptions(userOptions);
        loadMyCartEvent(this.selector);
        return this;
    };


})(jQuery);