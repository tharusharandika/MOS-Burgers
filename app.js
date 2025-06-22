let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const code = button.getAttribute('data-code');
            const price = parseFloat(button.getAttribute('data-price'));
            const discount = parseFloat(button.getAttribute('data-discount'));
            const item = { code, name: button.closest('.card').querySelector('.card-title').textContent.replace(' (Code: ' + code + ')', ''), price, discount, quantity: 1 };
            cart.push(item);
            updateCart();
        });
    });

    document.getElementById('menu-toggle').addEventListener('click', () => {
        document.getElementById('menu').style.display = 'block';
        document.getElementById('cart-section').style.display = 'none';
    });

    document.getElementById('cart-toggle').addEventListener('click', () => {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('cart-section').style.display = 'block';
        updateCart();
    });

    document.getElementById('apply-discount').addEventListener('click', () => {
        const discount = parseFloat(document.getElementById('discount').value);
        let total = parseFloat(document.getElementById('total').textContent);
        const discountedTotal = total - (total * (discount / 100));
        document.getElementById('total').textContent = discountedTotal.toFixed(2);
    });
        document.getElementById('generate-receipt').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const cartItems = document.getElementById('cart-items');
        const total = document.getElementById('total').textContent;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('MOS Burgers Receipt', 105, 20, null, null, 'center');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}`, 20, 30);
        doc.text('Items:', 20, 40);

        let y = 50;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            doc.text(`${item.name} (x${item.quantity}) - ${itemTotal.toFixed(2)} LKR`, 20, y);
            y += 10;
        });

        doc.text(`Total: ${total} LKR`, 20, y + 10);
        doc.save('mos_burgers_receipt.pdf');
    });
});

    function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <span>${item.name} (x${item.quantity}) - ${itemTotal.toFixed(2)} LKR</span>
            <button class="btn btn-danger btn-sm float-end remove-item" data-code="${item.code}">Remove</button>
        `;
        cartItemsDiv.appendChild(cartItemDiv);
    });
    document.getElementById('total').textContent = total.toFixed(2);

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const code = button.getAttribute('data-code');
            cart = cart.filter(item => item.code !== code);
            updateCart();
        });
    });
}