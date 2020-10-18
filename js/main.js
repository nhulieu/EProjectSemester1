(function(){
  // Add to Cart Interaction
  var cart = document.getElementsByClassName('js-cd-cart');  
  document.getElementsByClassName("cd-cart__checkout")[0].href = "../../checkout.html"		  
  if(cart.length > 0) {
  	var cartAddBtns = document.getElementsByClassName('js-cd-add-to-cart'),
  		cartBody = cart[0].getElementsByClassName('cd-cart__body')[0],
  		cartList = cartBody.getElementsByTagName('ul')[0],
  		cartListItems = cartList.getElementsByClassName('cd-cart__product'),
  		cartTotal = cart[0].getElementsByClassName('cd-cart__checkout')[0].getElementsByTagName('span')[0],
  		cartCount = cart[0].getElementsByClassName('cd-cart__count')[0],
  		cartCountItems = cartCount.getElementsByTagName('li'),
  		cartUndo = cart[0].getElementsByClassName('cd-cart__undo')[0],
  		productId = 0, //this is a placeholder -> use your real product ids instead
  		cartTimeoutId = false,
  		animatingQuantity = false;
		initCartEvents();

		function isParentFolderPage(){
			var currentPage = window.location.href;
			return currentPage.includes("about.html") 
			|| currentPage.includes("Agate.html")
			|| currentPage.includes("Aquamarine.html")
			|| currentPage.includes("black-tourmaline _pHU.html")
			|| currentPage.includes("BloodStone.html")
			|| currentPage.includes("diamond.html")
			|| currentPage.includes("Emerald.html")
			|| currentPage.includes("index.html")
			|| currentPage.includes("jade.html")
			|| currentPage.includes("Labradorite.html")
			|| currentPage.includes("Moldavite.html")
			|| currentPage.includes("Obsidian.html")
			|| currentPage.includes("Onyx.html")
			|| currentPage.includes("product-slide.html")
			|| currentPage.includes("Rose-Quarzt.html")
			|| currentPage.includes("specialOffer.html")
			|| currentPage.includes("TigersEye.html")
			|| currentPage.includes("topaz.html");
			
		}
		function initCartEvents() {	
			Util.removeClass(cart[0], 'cd-cart--empty');
			var storageCart = JSON.parse(localStorage.getItem('shoppingcartProducts'));
			var storageCartCount = localStorage.getItem('shoppingcartCount');
			var storageCartTotal = localStorage.getItem('shoppingcartPrice');
			if(storageCart != null && storageCart.count != 0){
				storageCart.forEach(product => {
					fillProductToCart(product);	
				});
								
				// var cartIsEmpty = Util.hasClass(cart[0], 'cd-cart--empty');				
				//update number of items 
				updateCartCount(true, parseInt(storageCartCount));
				//update total price
				updateCartTotal(storageCartTotal, true);
			}
			
			// add products to cart
			for(var i = 0; i < cartAddBtns.length; i++) {(function(i){
				cartAddBtns[i].addEventListener('click', addToCart);
			})(i);}

			// open/close cart
			cart[0].getElementsByClassName('cd-cart__trigger')[0].addEventListener('click', function(event){
				event.preventDefault();
				toggleCart();
			});
			
			cart[0].addEventListener('click', function(event) {
				if(event.target == cart[0]) { // close cart when clicking on bg layer
					toggleCart(true);
				} else if (event.target.closest('.cd-cart__delete-item')) { // remove product from cart
					event.preventDefault();
					removeProduct(event.target.closest('.cd-cart__product'));
					Util.removeClass(cart[0], 'cd-cart--empty');
				}
			});

			// update product quantity inside cart
			cart[0].addEventListener('change', function(event) {

				if(event.target.tagName.toLowerCase() == 'input'){
					editProductId = event.target.getAttribute("product-id");
					newQuantity = event.target.value;
					if(newQuantity < 0){
						event.target.value = 0;
						removePreviousProduct();
					}else{ 
						$.shoppingcart('edit',{
							'id': editProductId,
							'count': newQuantity
						});
						quickUpdateCart();
						// if($.shoppingcart('getCount') == 0){
						// 	$.shoppingcart('clear');
							
						// }
					}
					Util.removeClass(cart[0], 'cd-cart--empty');
				} 
			});

			//reinsert product deleted from the cart
			cartUndo.addEventListener('click', function(event) {
				if(event.target.tagName.toLowerCase() == 'a') {
					event.preventDefault();
					if(cartTimeoutId) clearInterval(cartTimeoutId);
					// reinsert deleted product
					var deletedProduct = cartList.getElementsByClassName('cd-cart__product--deleted')[0];
					Util.addClass(deletedProduct, 'cd-cart__product--undo');
					deletedProduct.addEventListener('animationend', function cb(){
						deletedProduct.removeEventListener('animationend', cb);
						Util.removeClass(deletedProduct, 'cd-cart__product--deleted cd-cart__product--undo');
						deletedProduct.removeAttribute('style');
						quickUpdateCart();
					});
					Util.removeClass(cartUndo, 'cd-cart__undo--visible');
				}
			});
		};

		function addToCart(event) {
			event.preventDefault();
			if(animatingQuantity) return;
			var cartIsEmpty = Util.hasClass(cart[0], 'cd-cart--empty');
			//update cart product list			
			addProduct(this);
			//update number of items 
			updateCartCount(cartIsEmpty);
			//update total price
			updateCartTotal(this.getAttribute('data-price'), true);
			//show cart
			Util.removeClass(cart[0], 'cd-cart--empty');
		};

		function toggleCart(bool) { // toggle cart visibility
			var cartIsOpen = ( typeof bool === 'undefined' ) ? Util.hasClass(cart[0], 'cd-cart--open') : bool;
		
			if( cartIsOpen ) {
				Util.removeClass(cart[0], 'cd-cart--open');
				//reset undo
				if(cartTimeoutId) clearInterval(cartTimeoutId);
				Util.removeClass(cartUndo, 'cd-cart__undo--visible');
				removePreviousProduct(); // if a product was deleted, remove it definitively from the cart

				setTimeout(function(){
					cartBody.scrollTop = 0;
					//check if cart empty to hide it
					if( Number(cartCountItems[0].innerText) == 0) Util.addClass(cart[0], 'cd-cart--empty');
				}, 500);
			} else {
				Util.addClass(cart[0], 'cd-cart--open');
			}
		};

		function fillProductToCart(target) {			
			productId = target["id"];
			alert(window.location.hostname);
			if(window.location.hostname.length > 0 && !window.location.hostname.includes("github.io")){
				document.getElementsByClassName("cd-cart__checkout")[0].href = "../../checkout.html"
				productImg = "../../"+target["url"];
			}
			else{
				if(isParentFolderPage()){
					document.getElementsByClassName("cd-cart__checkout")[0].href = "checkout.html"
					productImg = target["url"];
				}
			}

			productPrice = target["price"];
			productName = target["name"];	
			productQuantity = target["count"];
					
			var productAdded = '<li product-id='+ productId +' class="cd-cart__product"><div class="cd-cart__image"><a href="#0"><img src="'+ productImg +'" alt="placeholder"></a></div><div class="cd-cart__details"><h3 class="truncate"><a href="#0" title="'+ productName +'">'+ productName +'</a></h3><span class="cd-cart__price">$'+ productPrice+'</span><div class="cd-cart__actions"><a href="#0"  class="cd-cart__delete-item">Delete</a><div class="cd-cart__quantity"><label for="cd-product-'+ productId +'">Qty</label><span class="cd-cart__select"><input product-id='+ productId +' value="'+productQuantity+'" type="number" class="qty" id="cd-product-'+ productId +'" name="quantity"></span></div></div></div></li>';
			cartList.insertAdjacentHTML('beforeend', productAdded);
		};

		function addProduct(target) {
			// this is just a product placeholder
			// you should insert an item with the selected product info
			// replace productId, productName, price and url with your real product info
			// you should also check if the product was already in the cart -> if it is, just update the quantity
			productId = target.getAttribute('data-id');		
			productImg = target.getAttribute('data-src');
			productPrice = target.getAttribute('data-price');
			productName = target.getAttribute('data-name');	
			var existedProduct = document.getElementById("cd-product-"+ productId);
			if(existedProduct == null){				
				var productAdded = '<li product-id='+ productId +' class="cd-cart__product"><div class="cd-cart__image"><a href="#0"><img src="'+ productImg +'" alt="placeholder"></a></div><div class="cd-cart__details"><h3 class="truncate"><a href="#0">'+ productName +'</a></h3><span class="cd-cart__price">$'+ productPrice+'</span><div class="cd-cart__actions"><a href="#0"  class="cd-cart__delete-item">Delete</a><div class="cd-cart__quantity"><label for="cd-product-'+ productId +'">Qty</label><span class="cd-cart__select"><input product-id='+ productId +' value="1" type="number" class="qty" id="cd-product-'+ productId +'" name="quantity"></span></div></div></div></li>';
				cartList.insertAdjacentHTML('beforeend', productAdded);
				$.shoppingcart('add',{
					'id': productId,
					'count': 1,
					'name': productName,
					'url': productImg,				
					'price': productPrice
				});
			}else{
				newQty = parseInt(existedProduct.value) + 1;	
				existedProduct.value = newQty;
				$.shoppingcart('edit',{
					'id': productId,
					'count': newQty
				});
			}	
		};

		function removeProduct(product) {
			if(cartTimeoutId) clearInterval(cartTimeoutId);
			removePreviousProduct(); // prduct previously deleted -> definitively remove it from the cart		
			var topPosition = product.offsetTop,
				productQuantity = Number(product.getElementsByTagName('input')[0].value),
				productTotPrice = Number((product.getElementsByClassName('cd-cart__price')[0].innerText).replace('$', '')) * productQuantity;

			product.style.top = topPosition+'px';
			Util.addClass(product, 'cd-cart__product--deleted');

			//update items count + total price
			updateCartTotal(productTotPrice, false);
			updateCartCount(true, -productQuantity);
			Util.addClass(cartUndo, 'cd-cart__undo--visible');

			//wait 8sec before completely remove the item
			cartTimeoutId = setTimeout(function(){
				Util.removeClass(cartUndo, 'cd-cart__undo--visible');
				removePreviousProduct();
			}, 8000);
		};

		function removePreviousProduct() { // definitively removed a product from the cart (undo not possible anymore)
			var deletedProduct = cartList.getElementsByClassName('cd-cart__product--deleted');
			
			if(deletedProduct.length > 0 ) {
				productId = deletedProduct[0].getAttribute("product-id");				
				$.shoppingcart("remove", {"id": productId});
				if($.shoppingcart('getCount') == 0){
					$.shoppingcart('clear');
				}
				deletedProduct[0].remove();
			}
		};

		document.getElementsByClassName('cd-cart__checkout')[0].addEventListener('click', function(event){
			Util.removeClass(cartUndo, 'cd-cart__undo--visible');
			removePreviousProduct();
		});

		function updateCartCount(emptyCart, quantity) {
			if( typeof quantity === 'undefined' ) {
				var actual = Number(cartCountItems[0].innerText) + 1;
				var next = actual + 1;
				
				if( emptyCart ) {
					cartCountItems[0].innerText = actual;
					cartCountItems[1].innerText = next;
					animatingQuantity = false;
				} else {
					Util.addClass(cartCount, 'cd-cart__count--update');

					setTimeout(function() {
						cartCountItems[0].innerText = actual;
					}, 150);

					setTimeout(function() {
						Util.removeClass(cartCount, 'cd-cart__count--update');
					}, 200);

					setTimeout(function() {
						cartCountItems[1].innerText = next;
						animatingQuantity = false;
					}, 230);
				}
			} else {
				var actual = Number(cartCountItems[0].innerText) + quantity;
				var next = actual + 1;
				
				cartCountItems[0].innerText = actual;
				cartCountItems[1].innerText = next;
				animatingQuantity = false;
			}
		};

		function updateCartTotal(price, bool) {
			cartTotal.innerText = bool ? (Number(cartTotal.innerText) + Number(price)).toFixed(2) : (Number(cartTotal.innerText) - Number(price)).toFixed(2);
		};

		function quickUpdateCart() {
			var quantity = 0;
			var price = 0;

			for(var i = 0; i < cartListItems.length; i++) {
				if( !Util.hasClass(cartListItems[i], 'cd-cart__product--deleted') ) {
					var singleQuantity = Number(cartListItems[i].getElementsByTagName('input')[0].value);
					quantity = quantity + singleQuantity;
					price = price + singleQuantity*Number((cartListItems[i].getElementsByClassName('cd-cart__price')[0].innerText).replace('$', ''));
				}
			}

			cartTotal.innerText = price.toFixed(2);
			cartCountItems[0].innerText = quantity;
			cartCountItems[1].innerText = quantity+1;
		};
  }
})();