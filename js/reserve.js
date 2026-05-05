(function () {
  const form      = document.getElementById('reserveForm');
  const errorMsg  = document.getElementById('errorMsg');
  const submitBtn = document.getElementById('submitBtn');

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    errorMsg.textContent = '';

    const nameVal  = document.getElementById('fullName').value.trim();
    const emailVal = document.getElementById('email').value.trim();

    if (!nameVal) {
      errorMsg.textContent = 'Please enter your full name.';
      document.getElementById('fullName').focus();
      return;
    }
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      errorMsg.textContent = 'Please enter a valid email address.';
      document.getElementById('email').focus();
      return;
    }

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Redirecting to checkout…';

    try {
      const res = await fetch('/create-checkout-session', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:    nameVal,
          email:   emailVal,
          phone:   document.getElementById('phone').value.trim(),
          message: document.getElementById('message').value.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');

      window.location.href = data.url;
    } catch (err) {
      errorMsg.textContent  = err.message;
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Purchase My Jong — $2,500';
    }
  });
})();
