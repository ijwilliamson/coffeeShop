//--------------------------------------------------
//----------- Coffee Shop Class Example ------------
//--------------------------------------------------

// Functions required by the classes

const wizard = (id)=>{
// Call back function which is passed to the item buttons
// This must sit above the class for which it acts as a callback
// due to the lack of hoisting
    console.log('wizard' + id);
    order.addOrderItem(
        menuItems.find((item)=> item.id === id)
    )
    totals.innerHTML = order.totalHtml();

}

// Classes

class ShopItem  {
    constructor(id, name, price,myCallBack){
        this.id = id;
        this.name = name;
        this.price = price;
        this.myCallBack = myCallBack;
        this.qty = 1;
        this.totalAmount = price;
    }  

    htmlMenuRow() {
        let newRow = document.createElement('tr');
        newRow.id = this.id;

        let nameTd = document.createElement('td');
        nameTd.innerText = this.name;
        nameTd.classList.add('name');

        let priceTd = document.createElement('td');
        priceTd.innerText = this.price.toFixed(2);
        priceTd.classList.add('price')

        let buttonTd = document.createElement('td');
        buttonTd.classList.add('btnTd');

        let button = document.createElement('button');

        button.id = this.id;
        button.innerHTML = "order";
        button.addEventListener('click',()=> this.callback(this.id));
        buttonTd.appendChild(button);

        newRow.appendChild(nameTd);
        newRow.appendChild(priceTd);
        newRow.appendChild(buttonTd);
        
        return newRow;
    }

    htmlBillRow() {
        let newRow = document.createElement('tr');
        newRow.id = this.id;

        let nameTd = document.createElement('td');
        nameTd.innerText = this.name;
        nameTd.classList.add('name');

        let priceTd = document.createElement('td');
        priceTd.innerText = this.price.toFixed(2);
        priceTd.classList.add('price')

        let qtyTd = document.createElement('td');
        qtyTd.innerText = this.qty;
        qtyTd.classList.add('qty');

        let totalPriceTd = document.createElement('td');
        totalPriceTd.innerText = this.totalAmount.toFixed(2);
        totalPriceTd.classList.add('totalPrice')
   

        newRow.appendChild(nameTd);
        newRow.appendChild(priceTd);
        newRow.appendChild(qtyTd);
        newRow.appendChild(totalPriceTd);
        return newRow;
    }


    callback(args) {
      
        this.myCallBack(this.id);
    }
}

class ShopOrder {
    constructor (){
        this._orderItems = [];
    }

    get orderItems() {return this._orderItems;}
    set orderItems(value) {this._orderItems = value;}

    addOrderItem(value) {
        let updated = false;
        this._orderItems.forEach((item) => {
            if (item.id === value.id){
                item.qty += 1;
                item.totalAmount = ((item.totalAmount*10)+(value.price*10))/10;
                console.log('increased qty');
                updated = !updated;
                
            }
        });
        if (!updated) {
            this._orderItems.push(value);
        console.log(value);
        }
        
    }

    removeOrderItem(value) {
        let i = value.indexOf(value);
        this._orderItems.splice(i,1);
    }

    orderItemsQty (){
        return this._orderItems.length;
        
    }

    orderTotal() {
        let total = 0;
        this._orderItems.forEach((item) => total =((total*10)+(item.totalAmount*10))/10);
        // this._orderItems.forEach((item) => total +=item.price);
        // javascript number limitation issue requires fix above
        return total;
    }

    billItemsQty (){
        let qty = 0;
        this._orderItems.forEach((item)=>{
            qty += item.qty;
        })
        return qty;
    }

    billTotal() {
        let total = 0;
        this._orderItems.forEach((item)=>{
            total = ((total*10)+(item.totalAmount*10))/10;
        })
        return total;
    }

    totalHtml() {
        return `<td><li>Items: ${this.billItemsQty()}</li><li>Total: £${this.orderTotal().toFixed(2)}</li></td>`
    }

    totalBillHtml() {
        
        let html =  `<td><li>Items: ${this.billItemsQty()}</li><li>Total: £${this.billTotal().toFixed(2)}</li></td>`
        return html;
    }

}

class Customer {
    constructor(name, balance){
        this._name = name;
        this._balance = balance;
    };

    get name() {return this._name};
    set name(value) {this._name = value};

    get balance() {return this._balance};
    set balance(value) {this._balance = value};

}

class Customers{
    constructor(customers){
        this._customers = customers;   
    }

    get all() {return this._customers};
    set all(value) {this._customers = value};
}

// HTML elements

const payPage = document.getElementsByTagName('payPage')[0];
const orderPage = document.getElementsByTagName('orderPage')[0];
const bill = document.getElementById('bill');
const billTotal = document.getElementById('billTotal');
const table = document.getElementById('menu');
const totals = document.getElementById('total');
const backButton = document.getElementById('back');
const customerSelect = document.getElementById('customers');
const balanceMsg = document.getElementById('available');

// Application variables

const order = new ShopOrder;

const menuItems = [
    new ShopItem(0,'Espresso', 2.75,wizard),
    new ShopItem(1,'Cappuccino', 3.50,wizard),
    new ShopItem(2,'Latte', 4.25,wizard),
    new ShopItem(3,'Mocha', 4.50,wizard),
    new ShopItem(4,'Americano', 2.50,wizard),
    new ShopItem(5,'Flat White', 2.50,wizard),
    new ShopItem(6, 'Cafe Breve', 2.50,wizard),
    new ShopItem(7, 'Con Panna', 3.25,wizard),
    new ShopItem(8, 'Macchiato', 1.50,wizard),
    new ShopItem(9, 'Cuban', 3.50,wizard),
    new ShopItem(10,'Affogato', 4.20,wizard)
];

const customerList = [
    new Customer('Frank Binns',33.23),
    new Customer('Mark Swindle', 98.34),
    new Customer('Grace Fairtree', 12.19),
    new Customer('George Wobbler', 2.23)
];

const customers = new Customers(customerList);

let page = 0;

// Functions

    // page management
const switchPage = ()=>{
    page = !page;
    if (page==0){
        orderPage.classList.remove('hide');
        payPage.classList.add('hide');
    }
    else
    {
        orderPage.classList.add('hide');
        payPage.classList.remove('hide');
    }
}

    // Menu page funcation

menuItems.forEach((item) =>{
    table.appendChild(item.htmlMenuRow());
});

    // Pay page functions

const handlePay = ()=>{
    switchPage();
    let billHeader = "<thead><td class='name'>Drinks</td><td class='price'>Price</td><td class='qty'>Qty</td><td class='totalPrice'>Total</td></thead>";
    bill.innerHTML=billHeader;
   
    order.orderItems.forEach((item)=>{
        bill.appendChild(item.htmlBillRow())
    });
    billTotal.innerHTML = order.totalBillHtml();
    populateCustomerSelect();
}

const populateCustomerSelect=()=> {
   while (customerSelect.options.length >0) {customerSelect.remove(0)}
    customers.all.forEach((cust) => {
        customerSelect.add(
            new Option(cust.name,cust.balance)
        )
    })
    updateBalance();
}

const updateBalance=()=> {
   
    balanceMsg.textContent = `${customerSelect.selectedOptions[0].label} has a balance of £${customerSelect.value}`;
}

//Events

document.getElementById('payButton').
    addEventListener('click',handlePay);

backButton.addEventListener('click',()=>switchPage())

customerSelect.addEventListener('change', (event)=>updateBalance(event))
