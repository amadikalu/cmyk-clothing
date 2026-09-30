// src/js/db.js
// Centralized product catalog for the frontend
const cmykCatalog = {
    "varsity-bw": {
        title: "CMYK Varsity Jacket - B/W",
        price: "$35.00",
        description: "Premium black and white varsity jacket. Features custom DTF printed chest emblem and tailored fit.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        imageColor: "from-gray-800 to-black"
    },
    "cargo-blk": {
        title: "Cargo Shorts - Blk",
        price: "$30.00",
        description: "Heavyweight cotton cargo shorts. Multi-pocket design built for utility and streetwear aesthetics.",
        sizes: ["30", "32", "34", "36"],
        imageColor: "from-[#111116] to-gray-900"
    },
    "premium-beanie": {
        title: "Premium Beanie",
        price: "$15.00",
        description: "Thick knit headwarmer with high-contrast embroidered CMYK logo.",
        sizes: ["One Size"],
        imageColor: "from-gray-700 to-gray-800"
    }
};

// Expose it globally so our HTML files can read it
window.cmykCatalog = cmykCatalog;
class CartManager {
    constructor() {
        this.storageKey = 'cmyk_lab_cart';
        this.items = this._loadCart();
    }

    _loadCart() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Storage inaccessible:", error);
            return [];
        }
    }

    _saveCart() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        this._dispatchUpdate();
    }

    // Architect Note: Broadcast an event whenever the cart changes so the UI can react
    _dispatchUpdate() {
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { count: this.items.length, items: this.items } 
        }));
    }

    addStoreItem(productId, size) {
        this.items.push({
            id: crypto.randomUUID(), // Native browser UUID generation
            type: 'drop',
            productId: productId,
            size: size,
            timestamp: Date.now()
        });
        this._saveCart();
    }

    addCustomBuild(buildData) {
        this.items.push({
            id: crypto.randomUUID(),
            type: 'custom_build',
            specs: buildData,
            timestamp: Date.now()
        });
        this._saveCart();
    }

    getCartCount() {
        return this.items.length;
    }
}

// Initialize the Singleton
window.Cart = new CartManager();