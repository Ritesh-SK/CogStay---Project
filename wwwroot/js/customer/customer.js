/* ==========================================
   CogStay Customer Portal Javascript Logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initRoomFilters();
    initPriceCalculator();
    initStarRatings();
});

// 1. Filter Rooms in AvailableRooms.cshtml
function initRoomFilters() {
    const roomTypeFilter = document.getElementById('filter-room-type');
    const priceFilter = document.getElementById('filter-price');
    const cards = document.querySelectorAll('.customer-rooms-grid .cogstay-room-card');
    
    if (roomTypeFilter && cards.length) {
        const applyFilters = () => {
            const selectedType = roomTypeFilter.value;
            const selectedPrice = priceFilter.value; // e.g. "low", "high"
            
            cards.forEach(card => {
                const type = card.getAttribute('data-room-type');
                const price = parseFloat(card.getAttribute('data-room-price'));
                let matchesType = selectedType === 'all' || type === selectedType;
                
                if (matchesType) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            // Sorting by price
            if (selectedPrice !== 'default') {
                const parent = cards[0].parentNode;
                const sortedCards = Array.from(cards).sort((a, b) => {
                    const priceA = parseFloat(a.getAttribute('data-room-price'));
                    const priceB = parseFloat(b.getAttribute('data-room-price'));
                    return selectedPrice === 'low' ? priceA - priceB : priceB - priceA;
                });
                sortedCards.forEach(c => parent.appendChild(c));
            }
        };

        roomTypeFilter.addEventListener('change', applyFilters);
        priceFilter.addEventListener('change', applyFilters);
    }
}

// 2. Booking checkout price calculation in BookRoom.cshtml
function initPriceCalculator() {
    const checkinInput = document.getElementById('checkin-date');
    const checkoutInput = document.getElementById('checkout-date');
    const roomTypeSelect = document.getElementById('checkout-room-type');
    
    // Summary elements
    const summaryNights = document.getElementById('summary-nights');
    const summaryRoomRate = document.getElementById('summary-room-rate');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTax = document.getElementById('summary-tax');
    const summaryTotal = document.getElementById('summary-total');

    if (checkinInput && checkoutInput && roomTypeSelect) {
        const rates = {
            'standard': 140,
            'deluxe': 180,
            'suite': 350
        };

        const calculateTotals = () => {
            const checkin = new Date(checkinInput.value);
            const checkout = new Date(checkoutInput.value);
            const selectedType = roomTypeSelect.value;
            
            if (checkinInput.value && checkoutInput.value && checkout > checkin) {
                const diffTime = Math.abs(checkout - checkin);
                const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const rate = rates[selectedType] || 140;
                
                const subtotal = rate * nights;
                const tax = Math.round(subtotal * 0.12 * 100) / 100; // 12% tax
                const total = subtotal + tax;
                
                if (summaryNights) summaryNights.innerText = nights + ' nights';
                if (summaryRoomRate) summaryRoomRate.innerText = '$' + rate;
                if (summarySubtotal) summarySubtotal.innerText = '$' + subtotal;
                if (summaryTax) summaryTax.innerText = '$' + tax;
                if (summaryTotal) summaryTotal.innerText = '$' + total;
            } else {
                // Reset to default
                if (summaryNights) summaryNights.innerText = '0 nights';
                if (summaryRoomRate) summaryRoomRate.innerText = '$' + (rates[selectedType] || 140);
                if (summarySubtotal) summarySubtotal.innerText = '$0';
                if (summaryTax) summaryTax.innerText = '$0';
                if (summaryTotal) summaryTotal.innerText = '$0';
            }
        };

        checkinInput.addEventListener('change', calculateTotals);
        checkoutInput.addEventListener('change', calculateTotals);
        roomTypeSelect.addEventListener('change', calculateTotals);
    }
}

// 3. Dynamic star selections in Feedback.cshtml
function initStarRatings() {
    const starContainer = document.querySelector('.rating-stars');
    const ratingInput = document.getElementById('guest-rating-val');
    
    if (starContainer && ratingInput) {
        const stars = starContainer.querySelectorAll('i');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const score = parseInt(star.getAttribute('data-value'));
                ratingInput.value = score;
                
                stars.forEach(s => {
                    const val = parseInt(s.getAttribute('data-value'));
                    if (val <= score) {
                        s.classList.add('active');
                        s.classList.replace('fa-regular', 'fa-solid');
                    } else {
                        s.classList.remove('active');
                        s.classList.replace('fa-solid', 'fa-regular');
                    }
                });
                showToast('Rating updated', `You selected ${score} stars.`, 'info');
            });
        });
    }
}
