document.addEventListener("DOMContentLoaded", () => {
  const taxToggle = document.getElementById("taxToggle");
  const prices = Array.from(document.querySelectorAll(".price"));
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const clearBtn = document.getElementById("clearSearchBtn");
  const listingCards = Array.from(document.querySelectorAll(".listing-card"));

  const formatINR = (v) => {
    if (isNaN(v)) return v;
    return new Intl.NumberFormat('en-IN').format(Math.round(v));
  };

  // APPLY or REMOVE TAX
  function applyTax(showTax) {
    prices.forEach(p => {
      const base = parseFloat(p.dataset.basePrice) || 0;
      if (showTax) {
        const taxed = base * 1.18;
        p.textContent = "₹" + formatINR(taxed);
      } else {
        p.textContent = "₹" + formatINR(base);
      }
    });
  }

  // Toggle event
  taxToggle.addEventListener("change", () => {
    applyTax(taxToggle.checked);
  });

  // Initialize (no tax)
  applyTax(false);

  // SEARCH: filter by title or location
  function runSearch() {
    const q = (searchInput.value || "").trim().toLowerCase();
    listingCards.forEach(card => {
      const title = (card.querySelector(".card-title")?.textContent || "").toLowerCase();
      const loc = (card.querySelector(".card-location")?.textContent || "").toLowerCase();
      if (!q || title.includes(q) || loc.includes(q)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    runSearch();
  });

  clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = "";
    runSearch();
  });

  // live search on Enter
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearch();
    }
  });

});
