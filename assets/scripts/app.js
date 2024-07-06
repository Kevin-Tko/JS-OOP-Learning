//-----------------------//
//Classes and Objects
//-----------------------//
//===> Classess create a blue print which is used to create an oject thereafter. They define the properties and methods
//===> Objects is what we work with directly in our code. They are instances of our classes

//--------------------------------------------------------------------------------------------------------//
//Defining classes
//--------------------------------------------------------------------------------------------------------//
class Product {
    // title = "DEFAULT"; //properties end with a semicolon
    // imageUrl;
    // price;
    // description;

    //using constructor method to initialize properties on the fly
    constructor(title, img, price, desc) {
        this.title = title;
        this.imageUrl = img;
        this.price = price;
        this.description = desc;
    } //this does not end with a semicolon
}

//---------------------------//
//concept of inheritance
//--------------------------//
class ElementAttributes {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

class Component {
    constructor(renderHookId, shouldRender = true) {
        this.hookId = renderHookId;

        if (shouldRender) {
            this.render();
        }
    }

    render() {}

    createRootElement(tag, cssClass, attributes) {
        const rootElement = document.createElement(tag);
        if (cssClass) {
            rootElement.className = cssClass;
        }
        if (attributes && attributes.length > 0) {
            for (const attr of attributes) {
                rootElement.setAttribute(attr.name, attr.value);
            }
        }
        document.getElementById(this.hookId).appendChild(rootElement);
        console.log(rootElement);
        return rootElement;
    }
}

//--------------------------------------------------------------------------------------------------------//
//cretes single item
//--------------------------------------------------------------------------------------------------------//
class ProductItem extends Component {
    constructor(product, renderHookId) {
        super(renderHookId, false);
        this.product = product;
        this.render();
    }

    addToCart() {
        App.addProductToCart(this.product);
    }

    render() {
        const prodEl = this.createRootElement("li", "product-item");
        prodEl.innerHTML = `
                <div>
                    <img src='${this.product.imageUrl}' alt='${this.product.title}'/>
                    <div class='product-item__content'>
                        <h2>${this.product.title}</h2>
                        <h3>$\ ${this.product.price}</h3>
                        <p>${this.product.description}</p>
                        <button>Add to Cart</button>
                    </div>
                </div>
            `;
        const addCartBtn = prodEl.querySelector("button");
        addCartBtn.addEventListener("click", this.addToCart.bind(this));
    }
}

//--------------------------------------------------------------------------------------------------------//
//class for cart
//--------------------------------------------------------------------------------------------------------//
class ShoppingCart extends Component {
    items = [];

    //setter
    set cartItems(value) {
        this.items = value;
        this.totalOutput.innerHTML = `<h2>Total: $\ ${this.totalAmount.toFixed(
            2
        )}</h2>`;
    }

    //getter
    get totalAmount() {
        const sum = this.items.reduce((previousNum, currNum) => {
            return previousNum + currNum.price;
        }, 0);
        return sum;
    }

    constructor(renderHookId) {
        super(renderHookId);
    }

    addProduct(product) {
        const updatedItems = [...this.items];
        updatedItems.push(product);
        this.cartItems = updatedItems;
    }

    orderItem() {
        console.log("ordering...");
        console.log(this.items);
    }

    render() {
        const cartEl = this.createRootElement("section", "cart");
        cartEl.innerHTML = `
            <h2>Total: $\ ${0}</h2>
            <button>Place Order</button>
        `;
        const orderBtn = document.querySelector("button");
        orderBtn.addEventListener("click", this.orderItem.bind(this));
        this.totalOutput = cartEl.querySelector("h2");
    }
}

//class for all products
class ProductList extends Component {
    products = [];

    constructor(renderHookId) {
        super(renderHookId);
        this.fetchProductData();
    }

    fetchProductData() {
        this.products = [
            new Product(
                "pillow",
                "https://media.istockphoto.com/id/1212158838/photo/woman-sleeping-in-bed-hugging-soft-white-pillow.webp?b=1&s=170667a&w=0&k=20&c=zSKXj1g1UMZE6m2LCytZ5AgVDH827swVWkxX3KiE0PE=",
                19.99,
                "A soft Pillow"
            ),
            new Product(
                "carpet",
                "https://media.istockphoto.com/id/2008542850/photo/gray-round-carpet-with-a-detailed-texture-perfect-for-modern-home-interiors-isolated-on-a.webp?b=1&s=170667a&w=0&k=20&c=vrLUCU21gpLHHekjFt-2nxwqIxi8TZfHQ_bbYur7LN8=",
                12.99,
                "A turkish carpet"
            ),
        ];
        this.renderProducts();
    }

    renderProducts() {
        //looping through all items of our product list
        for (const prod of this.products) {
            new ProductItem(prod, "items-list");
        }
    }
    //create a method to handle rendering logic
    render() {
        this.createRootElement("ul", "product-list", [
            new ElementAttributes("id", "items-list"),
        ]);
        if (this.products && this.products.length > 0) {
            this.renderProducts();
        }
    }
}

//--------------------------------------------------------------------------------------------------------//
//Handling the rendering of various components
//--------------------------------------------------------------------------------------------------------//
class Shop {
    constructor() {
        this.render();
    }
    render() {
        this.cart = new ShoppingCart("app"); // this will forward to the constructor that has super
        new ProductList("app");
    }
}

//--------------------------------------------------------------------------------------------------------//
//Static class to run all our application
//--------------------------------------------------------------------------------------------------------//
//a static class does not need instantiation - below can be called as App.init()
class App {
    static init() {
        const shop = new Shop();
        this.cart = shop.cart;
    }

    static addProductToCart(product) {
        this.cart.addProduct(product);
    }
}
App.init();
