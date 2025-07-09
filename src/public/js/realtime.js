const socket = io();

const form = document.getElementById('productForm');
const list = document.getElementById('productList');
const toast = document.getElementById('toast');

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => {
    toast.className = 'toast hidden';
  }, 2500);
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const product = Object.fromEntries(formData.entries());

  // Validación básica
  const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
  const emptyFields = requiredFields.filter(field => !product[field]);

  if (emptyFields.length > 0) {
    showToast('Por favor completa todos los campos obligatorios.', 'error');
    return;
  }

  product.price = parseFloat(product.price);
  product.stock = parseInt(product.stock);
  product.status = true;
  product.thumbnails = product.thumbnails
    ? product.thumbnails.split(',').map(t => t.trim())
    : [];

  socket.emit('addProduct', product);
  form.reset();
  showToast('Producto agregado con éxito!', 'success');
});

socket.on('productList', products => {
  list.innerHTML = '';

  if (products.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.textContent = '⚠️ No hay productos cargados.';
    emptyMessage.style.fontStyle = 'italic';
    emptyMessage.style.color = '#555';
    list.appendChild(emptyMessage);
    return;
  }

  products.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="product-info">
        <strong>${p.title}</strong>
        <span>$${p.price.toFixed(2)}</span>
      </div>
      <button onclick="deleteProduct(${p.id})">🗑️</button>
    `;
    list.appendChild(li);
  });
});

function deleteProduct(id) {
  socket.emit('deleteProduct', id);
  showToast('Producto eliminado', 'success');
}