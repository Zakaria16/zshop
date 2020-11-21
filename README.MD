# SALESFORCE COMMERCE CLOUD DEVELOPER ASSESSMENT
## JavaScript/jQuery-based Ecommerce Application

## Overview
 * The project should be developed by using JavaScript/AJAX/jQuery only
 * The Left side have the product image.
 * The Right side have the Product Name, Size, Color, Description and Add to Cart buttons.
 * Users can select size and color. 
 * Users can add to cart and then click on the view cart to land on cart page.
 * on the cart page users can update quantity, delete products and add coupon code which can give a 50% discount. 

 
 user clicks on ADD to cart button to add items to cart
 when a given item with the same size and color is selected the cart just update it quatity
 however if the different color or size is selected and add to cart pressed the new item is added
 
 
 ### on Cart page modal 
 
 user can make changes to the items in the cart. the amount and quantity are automatically updated when
 a change is made instantly
 
 On landing on the cart page users can update quantity, delete products and add coupon code which can give a 50% discount.

 A coupon can be added to give discount to the user, this can be done by typing the coupon code (5 characters) in 
 the coupon field and then clicking on the apply button
 
 
 the cart shows empty cart if no item is added
 
 ## Description
 The project mainly consist of these file
 ### html files
 * `index.html`  Product Details Page (PDP) and a cart modal page
 * `checkout.html` check out page which display billing infomation, total price and total quantity 
 ### css files
 * user.css
 * checkout.css
 ### javascript files 
 * `zshop.js`
 * `zshop.mycart.js`
 * `checkout.js`
 
 The remaining files are standard unmodified bootstraps files, jquery files, font-awesome files and images which is not mine