document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Menu Tab Switching Logic (with Fade effect)
    const tabs = document.querySelectorAll(".tab-btn");
    const categories = document.querySelectorAll(".menu-category");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(btn => btn.classList.remove("active"));
            tab.classList.add("active");

            categories.forEach(category => {
                category.classList.remove("active");
            });
            
            const target = tab.getAttribute("data-target");
            const targetCategory = document.getElementById(target);
            
            // Trigger a quick fade-in effect
            targetCategory.classList.add("active");
        });
    });

    // 2. Cost Estimator Logic
    const guestSlider = document.getElementById("guestSlider");
    const guestDisplay = document.getElementById("guestCountDisplay");
    const estimatedTotal = document.getElementById("estimatedTotal");
    const ratePerPlate = document.getElementById("ratePerPlate");
    
    const liveCounterCheck = document.getElementById("addLiveCounter");
    const mocktailBarCheck = document.getElementById("addMocktailBar");
    const premiumDecorCheck = document.getElementById("addPremiumDecor");

    function calculateEstimate() {
        const guests = parseInt(guestSlider.value);
        guestDisplay.textContent = guests;

        // Base rate based on menu preference (Veg vs Mixed)
        const selectedMenuPref = document.querySelector('input[name="menuPref"]:checked').value;
        let baseRate = (selectedMenuPref === 'veg') ? 600 : 800;

        // Per-plate add-ons
        let perPlateAddons = 0;
        if (liveCounterCheck.checked) perPlateAddons += parseInt(liveCounterCheck.value);
        if (mocktailBarCheck.checked) perPlateAddons += parseInt(mocktailBarCheck.value);

        // Flat add-ons
        let flatAddons = 0;
        if (premiumDecorCheck.checked) flatAddons += parseInt(premiumDecorCheck.value);

        // Total calculation
        const totalPlateRate = baseRate + perPlateAddons;
        const totalCost = (totalPlateRate * guests) + flatAddons;

        // Display results with formatting
        ratePerPlate.textContent = totalPlateRate;
        estimatedTotal.textContent = totalCost.toLocaleString('en-IN');
    }

    // Attach listeners to estimator inputs
    if (guestSlider) {
        guestSlider.addEventListener("input", calculateEstimate);
        
        const menuRadioButtons = document.querySelectorAll('input[name="menuPref"]');
        menuRadioButtons.forEach(radio => radio.addEventListener("change", calculateEstimate));
        
        liveCounterCheck.addEventListener("change", calculateEstimate);
        mocktailBarCheck.addEventListener("change", calculateEstimate);
        premiumDecorCheck.addEventListener("change", calculateEstimate);

        // Initial calculation
        calculateEstimate();
    }

    // Link estimator selections to Inquiry form on "Lock This Quote" button click
    const lockQuoteBtn = document.querySelector('.result-box .btn');
    if (lockQuoteBtn) {
        lockQuoteBtn.addEventListener("click", () => {
            // Pre-fill preferences in the contact form
            const selectedPref = document.querySelector('input[name="menuPref"]:checked').value;
            const guestCount = guestSlider.value;

            document.getElementById("formMenuPref").value = selectedPref;
            document.getElementById("guests").value = guestCount;
        });
    }

    // 3. Contact Form Interception & Validation
    const form = document.getElementById("cateringForm");
    const feedback = document.getElementById("formFeedback");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Stop page refresh

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const eventTypeSelect = document.getElementById("eventType");
            const eventTypeName = eventTypeSelect.options[eventTypeSelect.selectedIndex].text;
            const date = document.getElementById("date").value;
            const menuPrefSelect = document.getElementById("formMenuPref");
            const menuPrefName = menuPrefSelect.options[menuPrefSelect.selectedIndex].text;
            const guests = document.getElementById("guests").value;

            if (name && email && date && eventTypeSelect.value && menuPrefSelect.value && guests) {
                feedback.textContent = `Pranam ${name}! We have received your royal inquiry for the ${eventTypeName} (${menuPrefName}, approx. ${guests} guests) on ${date}. Our banquet specialists will email you at ${email} shortly.`;
                feedback.className = "feedback-msg success";
                
                // Reset the form fields
                form.reset();
                
                // Scroll feedback into view
                feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                feedback.textContent = "Please fill out all the fields in the inquiry form correctly.";
                feedback.className = "feedback-msg error";
            }
        });
    }

    // 4. Scroll Reveal Animation Observer
    const scrollElements = document.querySelectorAll(".service-card, .menu-item-card, .estimator-card, .contact-form");

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add("scrolled");
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.15)) {
                displayScrollElement(el);
            }
        });
    };

    // Add scroll class setup
    scrollElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    });

    // Inject class styles for animation in document head
    const style = document.createElement('style');
    style.innerHTML = `
        .scrolled {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    window.addEventListener("scroll", () => { 
        handleScrollAnimation();
    });
    
    // Initial check on load
    handleScrollAnimation();
});