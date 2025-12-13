let addButtons = document.querySelectorAll(".add-to-cart-btn");
let cartList = document.getElementById("cart-items-list");
let totalAmount = document.getElementById("total-amount");
let successMessage = document.getElementById("success-message");
let bookingForm = document.getElementById("booking-form");

let currentTotal = 0;

function showEmptyMessage() {
    cartList.innerHTML = "";
    let emptyRow = document.createElement("tr");
    emptyRow.className = "empty-row";
    emptyRow.innerHTML = `<td colspan="3" style="text-align:center; color:#888;">No items added</td>`;
    cartList.appendChild(emptyRow);
}

function renumberRows() {
    let rows = cartList.querySelectorAll("tr");
    let count = 1;
    rows.forEach(function (r) {
        if (r.classList.contains("empty-row")) return;
        let snCell = r.querySelector("td");
        if (snCell) {
            snCell.innerText = count;
            count = count + 1;
        }
    });
}

function updateTotalDisplay() {
    totalAmount.innerText = "₹" + currentTotal.toFixed(2);
}

showEmptyMessage();
updateTotalDisplay();

addButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        let parent = button.parentElement;
        let name = parent.getAttribute("data-name");
        let priceText = parent.getAttribute("data-price");
        let price = Number(priceText);

        let existingRow = cartList.querySelector(`tr[data-service="${name}"]`);

        if (existingRow) {

            existingRow.remove();
            button.classList.remove("remove-btn-style");
            button.classList.add("add-btn-style");
            button.innerText = "Add Item ⊕";

            currentTotal = currentTotal - price;
            if (currentTotal < 0) currentTotal = 0;

            if (cartList.querySelectorAll("tr").length === 0) {
                showEmptyMessage();
            }

            renumberRows();
            updateTotalDisplay();
        } else {
            let empty = cartList.querySelector(".empty-row");
            if (empty) {
                empty.remove();
            }

            let newRow = document.createElement("tr");
            newRow.setAttribute("data-service", name);

            newRow.innerHTML = `
                <td></td>
                <td>${name}</td>
                <td>₹${price.toFixed(2)}</td>
            `;

            cartList.appendChild(newRow);
            button.classList.remove("add-btn-style");
            button.classList.add("remove-btn-style");
            button.innerText = "Remove Item ⊖";

            currentTotal = currentTotal + price;
            updateTotalDisplay();

            renumberRows();
        }
    });
});

function clearCart() {

    cartList.innerHTML = "";
    currentTotal = 0;
    updateTotalDisplay();
    showEmptyMessage();

    addButtons.forEach(function (btn) {
        btn.classList.remove("remove-btn-style");
        btn.classList.add("add-btn-style");
        btn.innerText = "Add Item ⊕";
    });
}


bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let hasItems = cartList.querySelectorAll("tr").length > 0 && 
                   !cartList.querySelector(".empty-row");

    if (!hasItems) {
        alert("Please add at least one service before booking.");
        return;
    }

    let fullName = document.getElementById("full-name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone-number").value;

    let services = [];
    let rows = cartList.querySelectorAll("tr");

    rows.forEach(function (row) {
        if (!row.classList.contains("empty-row")) {
            let serviceName = row.children[1].innerText;
            let price = row.children[2].innerText;
            services.push(serviceName + " - " + price);
        }
    });

    let serviceListText = services.join("\n");

    let emailParams = {
        from_name: fullName,
        from_email: email,
        phone_number: phone,
        services_booked: serviceListText,
        total_amount: "₹" + currentTotal.toFixed(2)
    };

    // EmailJS credentials
    const EMAIL_SERVICE_ID = "service_tcmn13p";
    const EMAIL_TEMPLATE_ID = "template_i2j4h36";

    emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, emailParams)
    .then(function () {

        successMessage.style.display = "block";

        bookingForm.reset();
        clearCart();
    })
    .catch(function (error) {
        console.log("EmailJS Error:", error);
        alert("Something went wrong while sending email.");
    });
});

