class CmykNav extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav class="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0c]/90 backdrop-blur-lg border-t border-white/10 pb-safe pt-2">
            <div class="flex justify-around items-center h-16 px-2" id="nav-container">
                <a href="index.html" class="nav-link flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
                    <svg class="w-6 h-6 nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    <span class="text-[10px] font-medium">Home</span>
                </a>
                <a href="shop.html" class="nav-link flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
                    <svg class="w-6 h-6 nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    <span class="text-[10px] font-medium">Store</span>
                </a>
                <a href="studio.html" class="nav-link flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
                    <svg class="w-6 h-6 nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"></path></svg>
                    <span class="text-[10px] font-medium">Custom Lab</span>
                </a>
                <a href="contact.html" class="nav-link flex flex-col items-center gap-1 text-gray-500 hover:text-white transition-colors">
                    <svg class="w-6 h-6 nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span class="text-[10px] font-medium">Profile</span>
                </a>
            </div>
        </nav>
        `;

        // Smart Routing Logic: Detect active page and illuminate the icon
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const links = this.querySelectorAll('.nav-link');
        
        links.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.remove('text-gray-500');
                link.classList.add('text-white', 'opacity-100');
                link.querySelector('.nav-icon').setAttribute('fill', 'currentColor');
            }
        });
    }
}
customElements.define('cmyk-nav', CmykNav);
