const Order = require("./Order");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    SIZE:   Symbol("size"),
    TOPPINGS:   Symbol("toppings"),
    TACOS: Symbol("tacos"),
    CHIPS:Symbol("chips"),
    DRINKS:  Symbol("drinks"),
    PAYMENT: Symbol("payment")
});

module.exports = class BurritoOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sSize = "";
        this.sToppings = "";
        this.sTacos = "",
        this.sChips = "",
        this.sDrinks = "";
        this.sItem = "burrito";
        this.sItem2 = "tacos";
        this.nOrder = 0;
    }
  
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.SIZE;
                aReturn.push("Welcome to Jaimin's Burrito.");
                aReturn.push("What size would you like?");
                break;
            case OrderState.SIZE:
                if((sInput.toLowerCase() == "large") || (sInput.toLowerCase() == "small")){
                  this.sSize = sInput;
                  if(sInput.toLowerCase() == "large"){
                    this.nOrder = this.nOrder + 10;
                  }else{
                    this.nOrder = this.nOrder + 7;

                  }
                  this.stateCur = OrderState.TOPPINGS
                  aReturn.push("What rice would you like in toppings?");
                }else{
                  aReturn.push(`${sInput} is not valid, please  choose large or small`);
                }
                break;
            case OrderState.TOPPINGS:
              if((sInput.toLowerCase() == "white") || (sInput.toLowerCase() == "brown")){
                this.sToppings = sInput;
                if(sInput.toLowerCase() == "brown"){
                  this.nOrder = this.nOrder + 5;
                }else{
                  this.nOrder = this.nOrder + 2.5;

                }
                this.stateCur = OrderState.TACOS
                aReturn.push("What tacos would you like ? Regular or Cheesy");
              }else{
                aReturn.push(`${sInput} is not valid, please  choose white or brown`);
              }
                break;
            case OrderState.TACOS:
              if((sInput.toLowerCase() == "regular") || (sInput.toLowerCase() == "cheesy")){
                this.sTacos = sInput;
                if(sInput.toLowerCase() == "cheesy"){
                  this.nOrder = this.nOrder + 5;
                }else{
                  this.nOrder = this.nOrder + 2;

                }
                this.stateCur = OrderState.CHIPS;
                
                aReturn.push("What chips would you like with that?");
              }else{
                aReturn.push(`${sInput} is not valid, please  choose regular or cheesy`);
              }
                break;

              case OrderState.CHIPS:
                  if((sInput.toLowerCase() == "lays") || (sInput.toLowerCase() == "doritos")){
                    this.sChips = sInput;
                    if(sInput.toLowerCase() == "doritos"){
                      this.nOrder = this.nOrder + 4;
                    }else{
                      this.nOrder = this.nOrder + 2;
    
                    }
                    this.stateCur = OrderState.DRINKS;
                    
                    aReturn.push("Would you like drinks with that?");
                  }else{
                    aReturn.push(`${sInput} is not valid, please  choose doritos or lays`);
                  }
                    break;
            case OrderState.DRINKS:
              if((sInput.toLowerCase() != "dr.pepper") &&
                (sInput.toLowerCase() != "cocacola") &&
                (sInput.toLowerCase() != "pepsi") &&
                (sInput.toLowerCase() != "no")) {
                  aReturn.push(`${sInput} is not valid, please choose dr.pepper,cocacola, pepsi or no`);
                } else {
                  this.stateCur = OrderState.PAYMENT;
                  this.nOrder = this.nOrder + 2;
                  if(sInput.toLowerCase() != "no"){
                    this.sDrinks = sInput;
                }
                aReturn.push("Thank-you for your order of");
                aReturn.push(`${this.sSize} ${this.sItem} with ${this.sToppings}, ${this.sTacos} ${this.sItem2} and ${this.sChips} `);
                if(this.sDrinks){
                    aReturn.push(this.sDrinks);
                }
                aReturn.push(`Estimated cost is $ ${this.nOrder} including taxes`);
                aReturn.push(`Please pay for your order here`);
                aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
              }
                break;
            case OrderState.PAYMENT:
                console.log(sInput);
                console.log(sInput.purchase_units[0].shipping.address);
                this.isDone(true);
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Your order will be delivered 
                
                at  ${d.toTimeString()} on ${sInput.purchase_units[0].shipping.address.address_line_1}`);
                break;
        }
        return aReturn;
    }
    renderForm(sTitle = "-1", sAmount = "-1"){
      // your client id should be kept private
      if(sTitle != "-1"){
        this.sItem = sTitle;
      }
      if(sAmount != "-1"){
        this.nOrder = sAmount;
      }
      const sClientID = 'AQ7Tia9-k4gp1iIjYvyNh91hW8zsHu0BxhjM-Ev8FeJ7dJlHZSaRPYEbVcpTnQqlih6o-DLcJmTodFmx'  || 'put your client id here for testing ... Make sure that you delete it before committing'
      return(`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.sItem} order of $${this.nOrder}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);
  
    }
}