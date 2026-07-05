(function () {
  "use strict";

  const BOOKINGS_KEY = "temple-bookings-v1";
  const DONATIONS_KEY = "temple-donations-v1";

  const bookingForm = document.getElementById("booking-form");
  const bookingList = document.getElementById("booking-list");
  const donationForm = document.getElementById("donation-form");
  const donationList = document.getElementById("donation-list");

  function load(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Could not read saved data:", err);
      return [];
    }
  }

  function save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error("Could not save data:", err);
    }
  }

  function makeToken(prefix) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${rand}`;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------- Bookings ----------
  let bookings = load(BOOKINGS_KEY);

  function renderBookings() {
    bookingList.innerHTML = bookings
      .map(
        (b) => `
        <div class="entry-card">
          <strong>${escapeHtml(b.name)}</strong> — ${escapeHtml(b.count)} devotee(s)<br />
          ${escapeHtml(b.date)} · ${escapeHtml(b.slot)}<br />
          <span class="token">Token: ${b.token}</span>
        </div>`
      )
      .join("");
  }

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("bk-name").value.trim();
    const phone = document.getElementById("bk-phone").value.trim();
    const date = document.getElementById("bk-date").value;
    const slot = document.getElementById("bk-slot").value;
    const count = document.getElementById("bk-count").value;

    if (!name || !phone || !date || !slot) return;

    const entry = {
      name,
      phone,
      date,
      slot,
      count,
      token: makeToken("DAR"),
    };

    bookings.unshift(entry);
    save(BOOKINGS_KEY, bookings);
    renderBookings();
    bookingForm.reset();
    document.getElementById("bk-count").value = 1;
  });

  // ---------- Donations ----------
  let donations = load(DONATIONS_KEY);

  function renderDonations() {
    donationList.innerHTML = donations
      .map(
        (d) => `
        <div class="entry-card">
          <strong>${escapeHtml(d.name)}</strong> offered ₹${escapeHtml(d.amount)}<br />
          Purpose: ${escapeHtml(d.purpose)}<br />
          <span class="token">Receipt: ${d.token}</span>
        </div>`
      )
      .join("");
  }

  donationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("dn-name").value.trim();
    const email = document.getElementById("dn-email").value.trim();
    const purpose = document.getElementById("dn-purpose").value;
    const amount = document.getElementById("dn-amount").value;

    if (!name || !email || !purpose || !amount) return;

    const entry = {
      name,
      email,
      purpose,
      amount,
      token: makeToken("SEV"),
    };

    donations.unshift(entry);
    save(DONATIONS_KEY, donations);
    renderDonations();
    donationForm.reset();
  });

  renderBookings();
  renderDonations();
})();
