const bagKey = "uky-demo-bag-v1";
const itemPrice = 450;
const deliveryFee = 80;
let bagCount = 1;
let storageAvailable = true;
let checkoutComplete = false;

try {
    const savedBag = localStorage.getItem(bagKey);
    if (savedBag === "0" || savedBag === "1") {
        bagCount = Number(savedBag);
    }
    localStorage.setItem(bagKey, String(bagCount));
} catch (error) {
    storageAvailable = false;
}

function showMessage(id, message) {
    const box = document.getElementById(id);
    if (box) {
        box.textContent = message;
        box.hidden = false;
        box.focus();
    }
}

function updateBag() {
    const subtotal = itemPrice * bagCount;
    const delivery = bagCount > 0 ? deliveryFee : 0;
    const prices = { subtotal: subtotal, delivery: delivery, total: subtotal + delivery };

    document.querySelectorAll("[data-bag-count]").forEach(function (label) {
        label.textContent = bagCount;
    });
    document.querySelectorAll("[data-price]").forEach(function (label) {
        label.textContent = "₱" + prices[label.dataset.price].toFixed(2);
    });
    document.querySelectorAll("[data-storage-note]").forEach(function (note) {
        note.hidden = storageAvailable;
    });

    const filledBag = document.getElementById("bag-filled");
    const emptyBag = document.getElementById("bag-empty");
    if (filledBag && emptyBag) {
        filledBag.hidden = bagCount === 0;
        emptyBag.hidden = bagCount > 0;
    }

    const checkoutForm = document.querySelector('[data-demo-form="checkout"]');
    const emptyCheckout = document.getElementById("checkout-empty");
    if (checkoutForm && emptyCheckout) {
        checkoutForm.hidden = bagCount === 0 || checkoutComplete;
        emptyCheckout.hidden = bagCount > 0 || checkoutComplete;
        checkoutForm.querySelector('button[type="submit"]').disabled = bagCount === 0 || checkoutComplete;
    }
}

function saveBag(count) {
    bagCount = count;
    try {
        localStorage.setItem(bagKey, String(bagCount));
    } catch (error) {
        storageAvailable = false;
    }
    updateBag();
}

const removeButton = document.getElementById("remove-item");
if (removeButton) {
    removeButton.addEventListener("click", function () {
        saveBag(0);
        showMessage("bag-status", "Sample item removed. Your bag is now empty.");
    });
    removeButton.disabled = false;
}

const restoreButton = document.getElementById("restore-item");
if (restoreButton) {
    restoreButton.addEventListener("click", function () {
        saveBag(1);
        showMessage("bag-status", "Sample item restored. Your bag now contains one item.");
    });
    restoreButton.disabled = false;
}

window.addEventListener("storage", function (event) {
    if (event.key === bagKey || event.key === null) {
        bagCount = event.newValue === "0" ? 0 : 1;
        updateBag();
    }
});

window.addEventListener("pageshow", function (event) {
    if (event.persisted && storageAvailable) {
        try {
            bagCount = localStorage.getItem(bagKey) === "0" ? 0 : 1;
        } catch (error) {
            storageAvailable = false;
        }
        updateBag();
    }
});

function validateField(field) {
    let message = "";
    if (field.type === "checkbox") {
        if (!field.checked) message = "Please check this box to continue.";
    } else if (field.value.trim() === "") {
        message = "Please complete this field.";
    } else if (field.validity.typeMismatch) {
        message = "Please enter a valid email address.";
    } else if (field.minLength > 0 && field.value.length < field.minLength) {
        message = "Use at least " + field.minLength + " characters.";
    } else if (field.id === "checkout-postcode" && !/^[0-9]{4}$/.test(field.value)) {
        message = "Enter a 4-digit Philippine postal code.";
    } else if (field.id === "checkout-phone") {
        const phone = field.value.replace(/[\s()-]/g, "");
        if (!/^(09[0-9]{9}|\+639[0-9]{9})$/.test(phone)) {
            message = "Use 09 followed by 9 digits, or +639 followed by 9 digits.";
        }
    }

    const feedback = document.getElementById(field.id + "-error");
    feedback.textContent = message;
    feedback.classList.toggle("d-block", message !== "");
    field.classList.toggle("is-invalid", message !== "");
    field.setAttribute("aria-invalid", message !== "" ? "true" : "false");
    return message === "";
}

document.querySelectorAll("[data-demo-form]").forEach(function (form) {
    const fields = form.querySelectorAll("[required]");
    const kind = form.dataset.demoForm;

    form.addEventListener("submit", function (event) {
        event.preventDefault(); 
        if (kind === "checkout" && (bagCount === 0 || checkoutComplete)) {
            showMessage("checkout-status", "Your bag is empty. Restore the sample item on the bag page first.");
            return;
        }

        let firstInvalid = null;
        fields.forEach(function (field) {
            if (!validateField(field) && firstInvalid === null) firstInvalid = field;
        });
        if (firstInvalid) {
            showMessage(kind + "-status", "Please correct the marked fields and try again.");
            firstInvalid.focus();
            return;
        }

        if (kind === "signup") {
            showMessage("signup-status", "Demo complete! Your form passed validation. No account was created and your details were not saved.");
        } else {
            const demoTotal = itemPrice * bagCount + deliveryFee;
            checkoutComplete = true;
            saveBag(0);
            showMessage("checkout-status", "Demo checkout complete! The sample total was ₱" + demoTotal.toFixed(2) + ". No order was placed or payment taken. Your demo bag is now empty.");
            document.getElementById("checkout-finished-link").hidden = false;
        }
        form.reset();
    });

    fields.forEach(function (field) {
        field.addEventListener("input", function () {
            if (field.getAttribute("aria-invalid") === "true") validateField(field);
        });
        field.addEventListener("change", function () {
            if (field.getAttribute("aria-invalid") === "true") validateField(field);
        });
    });
    form.querySelector('button[type="submit"]').disabled = false;
});

updateBag();