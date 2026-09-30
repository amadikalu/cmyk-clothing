class CmykHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-white/10">
            <!-- Mature, thin-stroke monochrome menu trigger -->
            <button aria-label="Menu" class="text-white hover:text-gray-400 transition-colors focus:outline-none p-1">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div class="flex flex-col items-center">
                <h1 class="text-base font-black tracking-[0.25em] text-white">CMYK</h1>
                <span class="text-[8px] tracking-[0.2em] text-gray-500 uppercase">Studio Lab</span>
            </div>
            <!-- Monochrome shopping bag trigger -->
            <div class="relative cursor-pointer transition-transform active:scale-95 flex items-center p-1">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <!-- Dynamic Badge -->
                <span id="cart-badge" class="absolute top-0 right-0 bg-white text-black text-[9px] font-bold px-1 rounded-full hidden">0</span>
            </div>
        </header>
        `;

        this.updateBadge(window.Cart ? window.Cart.getCartCount() : 0);

        window.addEventListener('cartUpdated', (e) => {
            this.updateBadge(e.detail.count);
        });
    }

    updateBadge(count) {
        const badge = this.querySelector('#cart-badge');
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}
customElements.define('cmyk-header', CmykHeader);
