class ProductManager {
  constructor(formId, previewImgId) {
    this.form = document.getElementById(formId);
    if (!this.form) return;
    this.imageInput = this.form.querySelector('input[type="file"]');
    this.previewImg = document.getElementById(previewImgId);
    this.initListeners();
  }

  initListeners() {
    if (this.imageInput && this.previewImg) {
      this.imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.previewImg.src = URL.createObjectURL(file);
          this.previewImg.style.display = 'block';
        }
      });
    }
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this.form);
    const submitBtn = this.form.querySelector('button[type="submit"]');

    try {
      submitBtn.textContent = 'Syncing with Edge...';
      submitBtn.disabled = true;

      const response = await fetch('https://api.cmykbrandmedia.com/products/create', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      
      if (result.success) {
        alert(`Successfully published: ${result.data.name}`);
        this.form.reset();
        if (this.previewImg) this.previewImg.style.display = 'none';
      } else {
        alert(`Server rejected upload: ${result.message}`);
      }
    } catch (err) {
      console.error('Transmission failure:', err);
      alert('Network error. Check your connection and try again.');
    } finally {
      submitBtn.textContent = 'Upload Product';
      submitBtn.disabled = false;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ProductManager('admin-product-form', 'image-preview');
});
