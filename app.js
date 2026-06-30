/* ==========================================================================
   ALI RESTAURANT - MULTI-PAGE INTERACTION LOGIC, CUSTOM CURSOR & TRANSITIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // A1. Page Loader Transition Overlay Injection & Logic
    // ==========================================================================
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition-overlay';
    transitionOverlay.innerHTML = `
        <div class="loader-content">
            <div class="loader-logo">ALI</div>
            <div class="loader-sub">RESTAURANT</div>
            <div class="loader-spinner"></div>
            <div class="loader-progress-bar">
                <div class="loader-progress-fill"></div>
            </div>
        </div>
    `;
    document.body.appendChild(transitionOverlay);

    const progressFill = transitionOverlay.querySelector('.loader-progress-fill');

    // On initial page load, animate the progress bar filling quickly, then fade out
    setTimeout(() => {
        if (progressFill) progressFill.style.width = '100%';
        setTimeout(() => {
            transitionOverlay.classList.add('fade-out');
        }, 500); // Allow time for the progress bar to glide fully
    }, 50);

    window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    setTimeout(() => {
        loader.classList.add("hide");
    }, 1200);
});

    // Intercept clicks on local links for transition redirects
    const attachPageTransitionLinks = () => {
        document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Match local HTML page links (index.html, about.html, specialties.html, etc.)
            const isLocalHTML = href.endsWith('.html') || (!href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#'));
            
            if (isLocalHTML && href !== '#') {
                // Remove existing click events to prevent duplicates by rebuilding node
                link.outerHTML = link.outerHTML; 
            }
        });

        // Re-query and bind click listeners to local pages
        document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            const isLocalHTML = href.endsWith('.html') || (!href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#'));
            
            if (isLocalHTML && href !== '#') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Reset progress bar to 0% and display overlay
                    if (progressFill) progressFill.style.transition = 'none';
                    if (progressFill) progressFill.style.width = '0%';
                    
                    // Force DOM reflow to apply the 0% style immediately without transition
                    void transitionOverlay.offsetWidth;
                    
                    if (progressFill) progressFill.style.transition = 'width 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
                    
                    // Fade in overlay swiper
                    transitionOverlay.classList.remove('fade-out');
                    
                    // Start progress bar glide
                    setTimeout(() => {
                        if (progressFill) progressFill.style.width = '100%';
                    }, 50);
                    
                    // Redirect after transition completes (800ms gives bar time to fill smoothly)
                    setTimeout(() => {
                        window.location.href = href;
                    }, 800);
                });
            }
        });
    };

    attachPageTransitionLinks();

    // ==========================================================================
    // A2. Custom Glowing Lag-Follow Cursor System (Desktop only)
    // ==========================================================================
    let cursorOuter = null;
    let cursorInner = null;

    if (window.innerWidth >= 1024) {
        cursorOuter = document.createElement('div');
        cursorInner = document.createElement('div');
        cursorOuter.className = 'custom-cursor-outer';
        cursorInner.className = 'custom-cursor-inner';
        document.body.appendChild(cursorOuter);
        document.body.appendChild(cursorInner);

        let mouseX = 0, mouseY = 0; 
        let outerX = 0, outerY = 0; 
        let innerX = 0, innerY = 0; 

        // Update real cursor coordinates
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Position interpolation loop (lerp)
        const tick = () => {
            innerX += (mouseX - innerX) * 0.95;
            innerY += (mouseY - innerY) * 0.95;
            
            outerX += (mouseX - outerX) * 0.15; // smooth lag drag (lerp 0.15)
            outerY += (mouseY - outerY) * 0.15;

            if (cursorInner && cursorOuter) {
                cursorInner.style.transform = `translate(-50%, -50%) translate3d(${innerX}px, ${innerY}px, 0)`;
                cursorOuter.style.transform = `translate(-50%, -50%) translate3d(${outerX}px, ${outerY}px, 0)`;
            }
            requestAnimationFrame(tick);
        };
        tick();

        // Mouse click triggers visual scale shrinks
        window.addEventListener('mousedown', () => {
            cursorOuter.classList.add('clicking');
            cursorInner.classList.add('clicking');
        });
        window.addEventListener('mouseup', () => {
            cursorOuter.classList.remove('clicking');
            cursorInner.classList.remove('clicking');
        });

        // Bind hover class triggers
        const bindCursorHovers = () => {
            const hoverables = 'a, button, select, input, textarea, .table-node, .menu-tab-btn, .mobile-menu-toggle, .qty-btn, .close-modal-btn, .cart-toggle-btn, .cart-close-btn';
            document.querySelectorAll(hoverables).forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorOuter.classList.add('hovering');
                    cursorInner.classList.add('hovering');
                });
                el.addEventListener('mouseleave', () => {
                    cursorOuter.classList.remove('hovering');
                    cursorInner.classList.remove('hovering');
                });
            });
        };
        
        bindCursorHovers();
        // Expose function globally so dynamic menu re-renders re-bind hover states
        window.rebindCursorHovers = bindCursorHovers;
    }

    // ==========================================
    // 1. Database - Menu Items Catalog
    // ==========================================
    const MENU_DATA = [
        {
            id: 'menu-1',
            name: 'Truffle Heirloom Bruschetta',
            category: 'appetizers',
            price: 22.00,
            description: 'Sourdough crisp, wild summer truffles, heirloom cherry tomatoes, aged balsamic reduction.',
            rating: '★★★★★',
            img: 'assets/dish_bruschetta.png'
        },
        {
            id: 'menu-2',
            name: 'Charcoal Grilled Octopus',
            category: 'appetizers',
            price: 28.00,
            description: 'Tender fire-charred octopus, squid ink emulsion, lemon foam, dark green parsley oil infusion.',
            rating: '★★★★★',
            img: 'assets/dish_bruschetta.png'
        },
        {
            id: 'menu-3',
            name: 'Emerald Avocado Tartare',
            category: 'appetizers',
            price: 18.00,
            description: 'Creamy Haas avocado, compressed cucumber pearls, fresh lime zest, wasabi dust, sesame crisps.',
            rating: '★★★★☆',
            img: 'assets/dish_cocktail.png'
        },
        {
            id: 'menu-4',
            name: 'Imperial Wagyu Ribeye',
            category: 'mains',
            price: 120.00,
            description: 'A5 Wagyu seared over organic charcoal, smoked rosemary wood infusions, emerald chimichurri.',
            rating: '★★★★★',
            img: 'assets/dish_steak.png'
        },
        {
            id: 'menu-5',
            name: 'Forest Herb Crusted Salmon',
            category: 'mains',
            price: 42.00,
            description: 'Herb-crusted Scottish salmon, wild sea asparagus, seaweed broth, steamed green legumes.',
            rating: '★★★★★',
            img: 'assets/dish_steak.png'
        },
        {
            id: 'menu-6',
            name: 'Pesto Burrata Risotto',
            category: 'mains',
            price: 36.00,
            description: 'Acquerello rice infused with organic sweet basil, baby spinach cream, burrata, and roasted pistachios.',
            rating: '★★★★☆',
            img: 'assets/dish_souffle.png'
        },
        {
            id: 'menu-7',
            name: 'Gold Dust Matcha Souffle',
            category: 'desserts',
            price: 18.00,
            description: 'Liquid gold-infused matcha lava souffle, molten chocolate core, vanilla bean gelato.',
            rating: '★★★★★',
            img: 'assets/dish_souffle.png'
        },
        {
            id: 'menu-8',
            name: 'Obsidian Lava Sphere',
            category: 'desserts',
            price: 16.00,
            description: '72% dark chocolate shell, gold leaf accents, hot salted caramel injection pouring.',
            rating: '★★★★★',
            img: 'assets/dish_souffle.png'
        },
        {
            id: 'menu-9',
            name: 'Signature Emerald Elixir',
            category: 'beverages',
            price: 14.00,
            description: 'Mint extract, fresh key lime juice, botanical cucumber tonic, raw gold crystal sugar rim.',
            rating: '★★★★★',
            img: 'assets/dish_cocktail.png'
        },
        {
            id: 'menu-10',
            name: 'Midnight Jade Cocktail',
            category: 'beverages',
            price: 16.00,
            description: 'Japanese matcha tea hand-whisked with botanical gin, elderflower essence, fresh rosemary mist.',
            rating: '★★★★☆',
            img: 'assets/dish_cocktail.png'
        }
    ];

    // ==========================================
    // 2. Global State Variables
    // ==========================================
    let cart = [];
    let selectedTable = null;

    // ==========================================
    // 3. Elements Cache
    // ==========================================
    const header = document.querySelector('.header');
    const scrollProgressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');
    const menuContainer = document.getElementById('menu-container');
    const menuTabButtons = document.querySelectorAll('.menu-tab-btn');
    
    // Cart Elements
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCountBadge = document.querySelector('.cart-count');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartTaxEl = document.getElementById('cart-tax');
    const cartTotalEl = document.getElementById('cart-total');
    const cartProgressText = document.getElementById('cart-progress-text');
    const cartProgressFill = document.getElementById('cart-progress-fill');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Seating Reservation Elements
    const tableNodes = document.querySelectorAll('.table-node');
    const selectedTableText = document.getElementById('selected-table-text');
    const bookingForm = document.getElementById('booking-form');
    const bookingGuestsSelect = document.getElementById('booking-guests');
    const bookingModal = document.getElementById('booking-modal');
    const bookingReceipt = document.getElementById('booking-receipt');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const bookingDateInput = document.getElementById('booking-date');

    // Navigation and Mobile Overlay
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta-btn');

    // Testimonial Elements
    const testimonialTrack = document.getElementById('testimonial-track');
    const testimonialDots = document.querySelectorAll('.slider-dots .dot');
    let currentTestimonialIndex = 0;
    let testimonialInterval = null;

    // Set minimum booking date to today if form exists
    const today = new Date().toISOString().split('T')[0];
    if (bookingDateInput) {
        bookingDateInput.min = today;
        bookingDateInput.value = today;
    }

    // ==========================================
    // 4. Dynamic Active Link Highlighting
    // ==========================================
    const path = window.location.pathname;
    let pageName = path.substring(path.lastIndexOf('/') + 1);
    
    if (pageName === '') {
        pageName = 'index.html';
    }

    const highlightActiveNav = () => {
        document.querySelectorAll('.nav-links .nav-link, .mobile-links .mobile-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === pageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };
    
    highlightActiveNav();

    // ==========================================
    // 5. Scroll Effects (Header, Progress Bar, Back to Top)
    // ==========================================
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            if (pageName !== 'index.html') {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0 && scrollProgressBar) {
            const scrollPercent = (window.scrollY / totalHeight) * 100;
            scrollProgressBar.style.width = scrollPercent + '%';
        }

        if (window.scrollY > 400 && backToTopBtn) {
            backToTopBtn.classList.add('show');
        } else if (backToTopBtn) {
            backToTopBtn.classList.remove('show');
        }
    });

    if (pageName !== 'index.html') {
        header.classList.add('scrolled');
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    if (mobileToggle && mobileOverlay) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            mobileOverlay.classList.toggle('open');
            document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : 'auto';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                mobileOverlay.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Scroll Reveal Intersection Observer
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                if (entry.target.id === 'about' || entry.target.classList.contains('about-section')) {
                    animateAboutStats();
                }
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal-item, section').forEach(element => {
        revealObserver.observe(element);
    });

    let statsAnimated = false;
    function animateAboutStats() {
        if (statsAnimated) return;
        
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length === 0) return;
        
        statsAnimated = true;
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let current = 0;
            const duration = 2000;
            const stepTime = Math.max(Math.floor(duration / target), 15);
            
            const counter = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(counter);
                } else {
                    stat.textContent = current;
                }
            }, stepTime);
        });
    }

    // ==========================================
    // 6. Menu Filter & Render Logic (menu.html only)
    // ==========================================
    function renderMenu(categoryFilter = 'all') {
        if (!menuContainer) return;
        menuContainer.innerHTML = '';

        const filteredItems = categoryFilter === 'all' 
            ? MENU_DATA 
            : MENU_DATA.filter(item => item.category === categoryFilter);

        filteredItems.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'menu-item-card reveal-item';
            card.style.transitionDelay = `${index * 0.05}s`;
            
            card.innerHTML = `
                <div class="menu-item-img-wrapper">
                    <img src="${item.img}" alt="${item.name}" class="menu-item-img" loading="lazy">
                </div>
                <div class="menu-item-content">
                    <div class="menu-item-header">
                        <h3 class="menu-item-title">${item.name}</h3>
                        <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <p class="menu-item-desc">${item.description}</p>
                    <div class="menu-item-footer">
                        <span class="menu-item-rating">${item.rating}</span>
                        <button class="add-to-cart-btn btn-small" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-img="${item.img}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
            menuContainer.appendChild(card);
            
            setTimeout(() => {
                card.classList.add('reveal-active');
            }, 10);
        });

        attachCartButtonListeners();
        
        // Re-bind custom cursor hovers for newly added grid buttons
        if (window.rebindCursorHovers) {
            window.rebindCursorHovers();
        }
    }

    if (menuContainer) {
        menuTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                menuTabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                menuContainer.style.opacity = '0';
                menuContainer.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    renderMenu(filterValue);
                    menuContainer.style.opacity = '1';
                    menuContainer.style.transform = 'translateY(0)';
                }, 250);
            });
        });

        renderMenu('all');
    }

    // ==========================================
    // 7. Shopping Cart Management (Shared on all pages)
    // ==========================================
    function attachCartButtonListeners() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            // Remove previous event listener clones to prevent duplicate bindings
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', () => {
                const id = newBtn.getAttribute('data-id');
                const name = newBtn.getAttribute('data-name');
                const price = parseFloat(newBtn.getAttribute('data-price'));
                const img = newBtn.getAttribute('data-img');
                
                const originalText = newBtn.textContent;
                newBtn.textContent = 'Added ✓';
                newBtn.style.borderColor = '#D4AF37';
                newBtn.style.color = '#D4AF37';
                setTimeout(() => {
                    newBtn.textContent = originalText;
                    newBtn.style.borderColor = '';
                    newBtn.style.color = '';
                }, 1000);

                addToCart(id, name, price, img);
            });
        });
    }

    function addToCart(id, name, price, img) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, img, quantity: 1 });
        }
        updateCart();
        animateCartBadge();
    }

    function updateCart() {
        localStorage.setItem('ali_restaurant_cart', JSON.stringify(cart));
        const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        if (cartCountBadge) cartCountBadge.textContent = totalItemsCount;
        
        if (cart.length === 0) {
            if (cartItemsContainer) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart-message">
                        <p>Your culinary tray is empty.</p>
                        <p class="sub">Explore our menu to add exquisite selections.</p>
                    </div>
                `;
            }
            if (cartSubtotalEl) cartSubtotalEl.textContent = '$0.00';
            if (cartTaxEl) cartTaxEl.textContent = '$0.00';
            if (cartTotalEl) cartTotalEl.textContent = '$0.00';
            if (cartProgressFill) cartProgressFill.style.width = '0%';
            if (cartProgressText) cartProgressText.textContent = 'Add $100.00 more for Complimentary Dessert!';
            return;
        }

        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            let subtotal = 0;

            cart.forEach(item => {
                subtotal += item.price * item.quantity;
                const cartItemDiv = document.createElement('div');
                cartItemDiv.className = 'cart-item';
                cartItemDiv.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div class="cart-item-qty-control">
                        <button class="qty-btn qty-minus" data-id="${item.id}">-</button>
                        <span class="qty-num">${item.quantity}</span>
                        <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });

            const tax = subtotal * 0.08;
            const total = subtotal + tax;

            if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
            if (cartTaxEl) cartTaxEl.textContent = `$${tax.toFixed(2)}`;
            if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;

            const targetGoal = 100.00;
            const remaining = targetGoal - subtotal;
            const percent = Math.min((subtotal / targetGoal) * 100, 100);
            
            if (cartProgressFill) cartProgressFill.style.width = `${percent}%`;
            if (remaining > 0) {
                if (cartProgressText) cartProgressText.textContent = `Add $${remaining.toFixed(2)} more for Complimentary Dessert!`;
            } else {
                if (cartProgressText) cartProgressText.textContent = 'Congratulations! You unlocked a Complimentary Gold Matcha Souffle! 🎉';
                if (cartProgressFill) cartProgressFill.style.background = 'linear-gradient(90deg, #D4AF37, #10B981)';
            }
        }

        attachCartDrawerControls();
        
        // Ensure new cart controls hover styles are loaded
        if (window.rebindCursorHovers) {
            window.rebindCursorHovers();
        }
    }

    function updateCartUIOnly() {
        const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        if (cartCountBadge) cartCountBadge.textContent = totalItemsCount;
    }

    function attachCartDrawerControls() {
        document.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity -= 1;
                    if (item.quantity <= 0) {
                        cart = cart.filter(i => i.id !== id);
                    }
                    updateCart();
                }
            });
        });

        document.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity += 1;
                    updateCart();
                }
            });
        });
    }

    function animateCartBadge() {
        if (!cartCountBadge) return;
        cartCountBadge.style.transform = 'scale(1.4)';
        setTimeout(() => {
            cartCountBadge.style.transform = 'scale(1)';
        }, 300);
    }

    if (cartToggleBtn && cartDrawer && cartDrawerOverlay) {
        cartToggleBtn.addEventListener('click', () => {
            cartDrawer.classList.add('open');
            cartDrawerOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });

        const closeCart = () => {
            cartDrawer.classList.remove('open');
            cartDrawerOverlay.classList.remove('open');
            document.body.style.overflow = 'auto';
        };

        if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
        cartDrawerOverlay.addEventListener('click', closeCart);
    }

    // Load persistent cart
    if (localStorage.getItem('ali_restaurant_cart')) {
        cart = JSON.parse(localStorage.getItem('ali_restaurant_cart'));
        updateCart();
    }

    attachCartButtonListeners();

    // Checkout processing simulation
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            
            checkoutBtn.textContent = 'Processing Order...';
            checkoutBtn.disabled = true;
            
            setTimeout(() => {
                if (cartDrawer && cartDrawerOverlay) {
                    cartDrawer.classList.remove('open');
                    cartDrawerOverlay.classList.remove('open');
                    document.body.style.overflow = 'auto';
                }
                triggerOrderConfirmationReceipt();
                
                cart = [];
                updateCart();
                checkoutBtn.textContent = 'Proceed to Experience Checkout';
                checkoutBtn.disabled = false;
            }, 1500);
        });
    }

    function triggerOrderConfirmationReceipt() {
        if (!bookingReceipt || !bookingModal) return;
        const orderNumber = 'ALI-ORD-' + Math.floor(100000 + Math.random() * 900000);
        const total = cartTotalEl ? cartTotalEl.textContent : '$0.00';
        
        bookingReceipt.innerHTML = `
            <div class="receipt-row bold">
                <span>Receipt Type</span>
                <span>Gourmet Delivery Order</span>
            </div>
            <div class="receipt-row">
                <span>Order Reference</span>
                <span>${orderNumber}</span>
            </div>
            <div class="receipt-row">
                <span>Items Placed</span>
                <span>${cart.reduce((a,c) => a + c.quantity, 0)} items</span>
            </div>
            <div class="receipt-row">
                <span>Status</span>
                <span style="color: var(--color-emerald)">Preparing in Kitchen</span>
            </div>
            <div class="receipt-row bold">
                <span>Amount Paid</span>
                <span>${total}</span>
            </div>
        `;
        
        const mTitle = document.querySelector('#booking-modal .modal-title');
        const mDesc = document.querySelector('#booking-modal .modal-desc');
        if (mTitle) mTitle.textContent = 'Order Confirmed';
        if (mDesc) mDesc.textContent = 'Chef Ali has received your order menu catalog. Preparing gourmet courses now.';
        
        bookingModal.classList.add('open');
        triggerConfettiRain();
    }

    // ==========================================
    // 8. Seating Booking & Visual Selection (reservation.html only)
    // ==========================================
    if (bookingForm && tableNodes.length > 0) {
        tableNodes.forEach(node => {
            node.addEventListener('click', () => {
                if (node.classList.contains('reserved')) {
                    shakeElement(node);
                    return;
                }

                tableNodes.forEach(t => t.classList.remove('selected'));
                selectedTable = {
                    id: node.getAttribute('data-table-id'),
                    capacity: parseInt(node.getAttribute('data-capacity'), 10),
                    type: node.getAttribute('data-type')
                };

                node.classList.add('selected');
                if (selectedTableText) {
                    selectedTableText.textContent = `Table ${selectedTable.id} - ${selectedTable.type} (${selectedTable.capacity} Seats)`;
                }
                
                if (bookingGuestsSelect) {
                    bookingGuestsSelect.value = selectedTable.capacity.toString();
                }
            });
        });

        if (bookingGuestsSelect) {
            bookingGuestsSelect.addEventListener('change', (e) => {
                const requestedGuests = parseInt(e.target.value, 10);
                tableNodes.forEach(node => {
                    node.style.boxShadow = '';
                    if (node.classList.contains('available') && !node.classList.contains('reserved')) {
                        const cap = parseInt(node.getAttribute('data-capacity'), 10);
                        if (cap >= requestedGuests && cap <= requestedGuests + 2) {
                            node.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.4)';
                        }
                    }
                });
            });
        }

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!selectedTable) {
                const layout = document.querySelector('.restaurant-layout');
                if (layout) shakeElement(layout);
                if (selectedTableText) {
                    selectedTableText.innerHTML = '<span style="color: #ef4444">Please select a table on the visual map above.</span>';
                }
                return;
            }

            const name = document.getElementById('booking-name').value;
            const guests = bookingGuestsSelect.value;
            const date = bookingDateInput.value;
            const time = document.getElementById('booking-time').value;
            const bookingCode = 'ALI-RES-' + Math.floor(1000 + Math.random() * 9000);

            if (bookingReceipt) {
                bookingReceipt.innerHTML = `
                    <div class="receipt-row bold">
                        <span>Receipt Type</span>
                        <span>Fine Seating Booking</span>
                    </div>
                    <div class="receipt-row">
                        <span>Reservation Code</span>
                        <span style="color: var(--color-gold); font-weight: bold">${bookingCode}</span>
                    </div>
                    <div class="receipt-row">
                        <span>Guest Name</span>
                        <span>${name}</span>
                    </div>
                    <div class="receipt-row">
                        <span>Table Selected</span>
                        <span>Table ${selectedTable.id} (${selectedTable.type})</span>
                    </div>
                    <div class="receipt-row">
                        <span>Party Size</span>
                        <span>${guests} People</span>
                    </div>
                    <div class="receipt-row">
                        <span>Schedule Time</span>
                        <span>${date} @ ${time}</span>
                    </div>
                    <div class="receipt-row bold">
                        <span>Reservation Status</span>
                        <span style="color: var(--color-emerald)">Confirmed</span>
                    </div>
                `;
            }

            const mTitle = document.querySelector('#booking-modal .modal-title');
            const mDesc = document.querySelector('#booking-modal .modal-desc');
            if (mTitle) mTitle.textContent = 'Reservation Confirmed';
            if (mDesc) mDesc.textContent = 'Your table in our premium sanctuary has been reserved. A digital invitation has been dispatched to your email.';

            if (bookingModal) bookingModal.classList.add('open');
            triggerConfettiRain();

            const selectedNode = document.querySelector(`.table-node[data-table-id="${selectedTable.id}"]`);
            if (selectedNode) {
                selectedNode.classList.remove('selected', 'available');
                selectedNode.classList.add('reserved');
                const tag = selectedNode.querySelector('.table-tag');
                if (tag) tag.textContent = 'Reserved';
            }

            selectedTable = null;
            if (selectedTableText) selectedTableText.textContent = 'No Table Selected';
            bookingForm.reset();
            if (bookingDateInput) bookingDateInput.value = today;
        });
    }

    function shakeElement(element) {
        element.style.transform = 'translateX(-5px)';
        setTimeout(() => { element.style.transform = 'translateX(5px)'; }, 80);
        setTimeout(() => { element.style.transform = 'translateX(-5px)'; }, 160);
        setTimeout(() => { element.style.transform = 'translateX(5px)'; }, 240);
        setTimeout(() => { element.style.transform = ''; }, 320);
    }

    if (bookingModal && closeModalBtn) {
        const closeModal = () => {
            bookingModal.classList.remove('open');
        };
        closeModalBtn.addEventListener('click', closeModal);
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) closeModal();
        });
    }

    // ==========================================
    // 9. Custom Lightweight Confetti Canvas Rain
    // ==========================================
    function triggerConfettiRain() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '350';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const colors = ['#10B981', '#059669', '#064E3B', '#D4AF37', '#F3CD4E', '#FFFFFF'];
        const particles = [];
        
        for (let i = 0; i < 120; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * -height - 20,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedX: Math.random() * 4 - 2,
                speedY: Math.random() * 5 + 3,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 4 - 2
            });
        }

        let animationFrame;
        function update() {
            ctx.clearRect(0, 0, width, height);
            let active = false;
            
            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;
                
                if (p.y < height) {
                    active = true;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });

            if (active) {
                animationFrame = requestAnimationFrame(update);
            } else {
                canvas.remove();
            }
        }

        update();
        
        setTimeout(() => {
            cancelAnimationFrame(animationFrame);
            canvas.remove();
        }, 7000);
    }

    // ==========================================
    // 10. Reviews slider / Testimonials Carousel (Home page only)
    // ==========================================
    if (testimonialTrack && testimonialDots.length > 0) {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        const showTestimonial = (index) => {
            currentTestimonialIndex = index;
            testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
            testimonialDots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === index);
            });
        };

        testimonialDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'), 10);
                showTestimonial(index);
                resetTestimonialTimer();
            });
        });

        const startTestimonialTimer = () => {
            testimonialInterval = setInterval(() => {
                let nextIndex = currentTestimonialIndex + 1;
                if (nextIndex >= testimonialCards.length) {
                    nextIndex = 0;
                }
                showTestimonial(nextIndex);
            }, 5000);
        };

        const resetTestimonialTimer = () => {
            clearInterval(testimonialInterval);
            startTestimonialTimer();
        };

        startTestimonialTimer();
    }

    // ==========================================
    // 11. Newsletter Form Submission Handling (Footer)
    // ==========================================
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            
            input.value = '';
            input.placeholder = 'Invite Registered Successfully! ✓';
            input.style.borderColor = '#10B981';
            input.disabled = true;
            
            setTimeout(() => {
                input.placeholder = 'Your Email Address';
                input.style.borderColor = '';
                input.disabled = false;
            }, 3000);
        });
    }
    
    // Final check to re-bind hovers on initial render items
    if (window.rebindCursorHovers) {
        window.rebindCursorHovers();
    }
});


