var EMAILJS_SERVICE = 'service_tcmn13p';
var EMAILJS_TEMPLATE = 'template_i2j4h36';
var EMAILJS_USER = 'S6jXezHzV9UpRSgiY';

document.addEventListener('DOMContentLoaded', function () {

  (function initEmail() {
    try {
      emailjs.init(EMAILJS_USER);
    } catch (err) {
      console.warn('EmailJS init warn', err);
    }
  })();


  var servicesPanel = document.querySelector('.services-col') || document.querySelector('.services-side'); 
  var cartBody = document.getElementById('cart-body');
  var totalEl = document.getElementById('total-amt');
  var bookingForm = document.getElementById('booking-form');
  var successNote = document.getElementById('success-note');
  var scrollBtn = document.querySelector('.scroll-to-booking');


  var cart = []; 


  function refreshCartView() {

    if (!cartBody) { return; }
    cartBody.innerHTML = '';

    var total = 0;

    if (cart.length === 0) {
      cartBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No items added.</td></tr>';
    } else {
      for (var i = 0; i < cart.length; i++) {
        total += cart[i].price;
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + (i + 1) + '</td>' +
                       '<td>' + cart[i].name + '</td>' +
                       '<td>₹' + cart[i].price.toFixed(2) + '</td>';
        cartBody.appendChild(tr);
      }
    }

    totalEl.textContent = '₹' + total.toFixed(2);
  }

  function isItemInCart(name) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].name === name) return true;
    }
    return false;
  }


  function addItemToCart(name, price, btn) {

    cart.push({ name: name, price: price });

    if (btn) {
      btn.textContent = 'Remove Item';
      btn.style.background = '#fee2e2';
      btn.style.color = '#dc2626';
    }
    refreshCartView();
  }


  function removeItemFromCart(name, btn) {
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].name !== name) {
        newCart.push(cart[i]);
      }
    }
    cart = newCart;
    if (btn) {
      btn.textContent = 'Add Item';
      btn.style.background = '#e5e7eb';
      btn.style.color = '#1f2937';
    }
    refreshCartView();
  }

  function resetAll() {
    cart = [];
    refreshCartView();

    var btns = document.querySelectorAll('.service-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].textContent = 'Add Item';
      btns[i].style.background = '#e5e7eb';
      btns[i].style.color = '#1f2937';
    }
  }

  function handleBookingSubmit(e) {
    e.preventDefault();

    var name = (document.getElementById('full-name') || {}).value || '';
    var email = (document.getElementById('email') || {}).value || '';
    var phone = (document.getElementById('phone') || {}).value || '';

    if (cart.length === 0) {
      alert('Please add at least one service to your cart before booking.');
      return;
    }

    var servicesText = cart.map(function(it){ return it.name + ' (₹' + it.price.toFixed(2) + ')'; }).join('\n');

    var templateParams = {
      from_name: name,
      from_email: email,
      phone_number: phone,
      services_booked: servicesText,
      total_amount: totalEl.textContent,
      email: email
    };

    emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams)
      .then(function (resp) {
        console.log('Email send ok', resp.status, resp.text);
        if (successNote) successNote.style.display = 'block';
        try { bookingForm.reset(); } catch (err) {}
        resetAll();
      })
      .catch(function (err) {
        console.error('Email failed', err);
        alert('Failed to send booking. Please try again.');
      });
  }

  if (scrollBtn) {
    scrollBtn.addEventListener('click', function (ev) {
      ev.preventDefault();
      var target = document.getElementById('booking');
      if (target) {
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      }
    });
  }


  if (servicesPanel) {
    servicesPanel.addEventListener('click', function (ev) {
      var t = ev.target;
      var btn = t.closest ? t.closest('button') : (t.tagName === 'BUTTON' ? t : null);
      if (!btn) return;

      var row = btn.closest('.service-row');
      if (!row) return;

      var name = row.getAttribute('data-name');
      var price = parseFloat(row.getAttribute('data-price')) || 0;

      if (!isItemInCart(name)) {
        addItemToCart(name, price, btn);
      } else {
        removeItemFromCart(name, btn);
      }

    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }

  var newsForm = document.querySelector('.newsletter-form');
  if (newsForm) {
    newsForm.addEventListener('submit', function (ev) {
      ev.preventDefault();
      alert('Thank you for subscribing to our newsletter!');
      newsForm.reset();
    });
  }

  refreshCartView();

});
