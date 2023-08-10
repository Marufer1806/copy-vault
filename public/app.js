paypal
  .Buttons({
    createOrder: function (data, actions) {
      return fetch("api/orders", {
        method: "post",
      })
        .then((response) => response.json())
        .then((order) => order.id);
    },

    onApprove: function (data, actions) {
      return fetch(`api/orders/${data.orderID}/capture`, {
        method: "post",
      })
        .then((response) => response.json())
        .then((orderData) => {
          console.log(
            "Captured",
            orderData,
            JSON.stringify(orderData, null, 2)
          );
          const transaction = orderData.purchase_units[0].payments.captures[0];
          alert(`you order is: ${transaction.id} Thank you for your purchase`);
        });
    },
  })
  .render("#paypal-button-container");

if (paypal.HostedFields.isEligible()) {
  let orderId;

  paypal.HostedFields.render({
    createOrder: () => {
      return fetch("/api/orders", {
        method: "post",
      })
        .then((res) => res.json())
        .then((orderData) => {
          console.log("this is the order", orderData, JSON.stringify(orderData, null, 2));

          orderId = orderData.id;
          console.log(orderData.id);
          return orderData.id;
        });
    },
    styles: {
      ".valid": {
        color: "green",
      },
      ".invalid": {
        color: "red",
      },
    },
    fields: {
      number: {
        selector: "#card-number",
        placeholder: "4111 1111 1111 1111",
      },
      cvv: {
        selector: "#cvv",
        placeholder: "123",
      },
      expirationDate: {
        selector: "#expiration-date",
        placeholder: "MM/YY",
      },
    },
  }).then((cardFields) => {
    document.querySelector("#card-form").addEventListener("submit", (event) => {
      event.preventDefault();
      cardFields
        .submit({
          contingencies: ["SCA_ALWAYS"],

          cardholderName: document.getElementById("card-holder-name").value,

          vault: document.querySelector('#vault').checked,

          billingAddress: {
            streetAddress: document.getElementById(
              "card-billing-address-street"
            ).value,
            extendedAddress: document.getElementById(
              "card-billing-address-unit"
            ).value,
            region: document.getElementById("card-billing-address-state").value,
            locality: document.getElementById("card-billing-address-city")
              .value,
            postalCode: document.getElementById("card-billing-address-zip")
              .value,
            countryCodeAlpha2: document.getElementById(
              "card-billing-address-country"
            ).value,
          },
        })

        .then(function () {
          return fetch(`/api/orders/${orderId}`, {
            method: "get",
          })
            .then((res) => res.json())
            .then((checkingData) => {
              console.log(
                "checking data: ",
                checkingData,
                JSON.stringify(checkingData, null, 2)
              );
              // need to test all the scenario, this is just an example of one scenario
              if (
                checkingData.payment_source.card.authentication_result
                  .three_d_secure.enrollment_status === "Y" &&
                checkingData.payment_source.card.authentication_result
                  .three_d_secure.authentication_status === "Y"
              ) {
                return fetch(`/api/orders/${orderId}/capture`, {
                  method: "post",
                })
                  .then((res) => res.json())
                  .then((orderData) => {
                    console.log(
                      "orderData: ",
                      orderData,
                      JSON.stringify(orderData, null, 2)
                    );
                    
                   console.log()
                    var errorDetail =
                      Array.isArray(orderData.details) && orderData.details[0];

                      console.log(errorDetail);
                      console.log(orderData.details)

                      console.log("payer:" + orderData.payer, JSON.stringify(orderData.payer, null, 2))
                   
                      console.log("order details: " + orderData.purchase_units[0], JSON.stringify(orderData.purchase_units[0].payments.captures[0].processor_response.response_code, null, 2))

                   
                    if (errorDetail) {
                      var msg =
                        "Sorry, your transaction could not be processed.";
                        window.location.href="http://localhost:5500/"
                      if (errorDetail.description)
                        msg += "\n\n" + errorDetail.description;
                      if (orderData.debug_id)
                        msg += " (" + orderData.debug_id + ")";
                      return alert(msg);
                    }
                    alert("Transaction completed!");
                    
                  });
              } else {
                console.log("Card not valid, try again");
                window.location.href="http://localhost:5500/"
              }
            });
        })
        .catch((err) => {
          alert("Payment could not be captured! " + JSON.stringify(err));
        });
    });
  });
} else {
  document.querySelector("#card-form").style = "display: none";
}
