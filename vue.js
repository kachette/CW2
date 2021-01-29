var webstore = new Vue ({
    el:"#app",
    data: {
        products: [],
        showProduct: true,
        sitename: "Classes & Activities",
        cart:[],
        cartItems:[],
        hideCart: false,
        states: {
            HX: 'Hackney',
            KS: 'Kensington',
            CH: 'Chelsea'
        },
        titleFilterAscending: false,
        titleFilterDescending: false,
        locationFilterAscending: false,
        locationFilterDescending: false,
        priceFilterAscending: false,
        priceFilterDescending: false
        ,
        
        order:{
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            city: '',
            zip: '',
            state: '',
            method: 'Home'
        }
    },

    created: function() {
        fetch('https://cw2app.herokuapp.com/').then(
            function (response) {
                response.json().then(
                    function (json) {
                        webstore.products = json;
                    });
            }
        )
    },

    computed: {
        syncBasket () {
            for(let i=0;i<this.cart.length;i++){
                order.items = cart._id;
            }
            return order.items;
        },

        /// does not work
        sortedProduct(){
            function compare(a, b) {
                if (a.title > b.title) return 1;
                if (a.title < b.title) return -1;
                return 0;
            }
            return this.products.sort(compare)
        },

        ///works but treats phone as a main component
        isDisable() {
            return this.nameValid , this.phoneValid;
            
        },

        ///works fine
        nameValid() {
            return /^[A-Za-z]+$/.test(this.order.firstName);
        },

        ///works fine
        phoneValid() {
            return /^[0-1-2-3-4-5-6-7-8-9-+]+$/.test(this.order.phone);
        },
        isHideCart () {
                return this.cart.length >0;
        },

        titleAscending() {
            function compare(a, b) {
                if (a.title > b.title) return 1;
                if (a.title < b.title) return -1;
                return 0;
            }
            return this.products.sort(compare);
        },

        titleDescending() {
            function compare(a, b) {
                if (a.title > b.title) return -1;
                if (a.title < b.title) return 1;
                return 0;
            }
            return this.products.sort(compare);
        },

        locationAscending() {
            function compare(a, b) {
                if (a.location > b.location) return 1;
                if (a.location < b.location) return -1;
                return 0;
            }
            return this.products.sort(compare);
        },

        locationeDescending() {
            function compare(a, b) {
                if (a.location > b.location) return -1;
                if (a.location < b.location) return 1;
                return 0;
            }
            return this.products.sort(compare);
        },

        priceAscending() {
            return this.products.sort((a, b) => a.price - b.price );
        },
        priceDescending() {
            return this.products.sort((b, a) => a.price - b.price );
        },


        sortedProducts(){
            if(this.titleFilterDescending)
                return this.titleDescending;

            else if(this.titleFilterAscending)
                return this.titleAscending;

            else if(this.locationFilterAscending)
                return this.locationAscending;
            
            else if(this.locationFilterDescending)
                return this.locationeDescending;

            else if(this.priceFilterAscending)
                return this.priceAscending;

            else if(this.priceFilterDescending)
                return this.priceDescending;
            else
                return this.titleAscending;
        }
    },
        

    methods: {

        ///add to cart 
        addToCart(product) {
            this.cartItems.push(product._id);
            if(product.qty > 0){
                product.qty +=1
            } else if (product._id == this.cart._id) {
                product.qty +=1
            } else {
                product.qty +=1
                return this.cart.push(product);
            }
        },
        ///delete item from the cart
        removeFromCart(product) {
            product -=1; 
            this.cart.splice(this.cart.indexOf(product), 1);
            this.cartItems - product
        },

        ///check if can add to the cart
        canAddToCart(product) {
            return product.availableInventory > this.cartCount(product._id);
        },

        ///count number of items in the cart
        cartCount(_id) {
            let count = 0;
            for(let i = 0; i < this.cartItems.length; i++) {
                if(this.cartItems[i] === _id) count++;
            }
            return count;
        },

        ///show or hide checkout
        showCheckout() {
            this.showProduct = this.showProduct ? false : true;
        },


        saveOrder (order) {
            alert('Order Submitted !')
            fetch('https://cw2app.herokuapp.com/orders', {
                method: 'POST', // set the HTTP method as 'POST'
                headers: {
                    'Content-Type': 'application/json', // set the data type as JSON  
                },
                body: JSON.stringify(order), // need to stringify the JSON object
            })
            .then(response => response.json())
            .then(responseJSON => {
                console.log('Success:', responseJSON);
            });
        }
    }
})