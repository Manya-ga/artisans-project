export function animateAddToCart(productImageElement) {
  if (!productImageElement) return;

  const cartIcon = document.querySelector('[data-cart-icon]');
  if (!cartIcon) return;

  const sourceRect = productImageElement.getBoundingClientRect();
  const targetRect = cartIcon.getBoundingClientRect();
  const clone = productImageElement.cloneNode(true);
  const scale = 0.18;
  const duration = 850;

  clone.style.position = 'fixed';
  clone.style.left = `${sourceRect.left}px`;
  clone.style.top = `${sourceRect.top}px`;
  clone.style.width = `${sourceRect.width}px`;
  clone.style.height = `${sourceRect.height}px`;
  clone.style.objectFit = 'cover';
  clone.style.borderRadius = '16px';
  clone.style.boxShadow = '0 24px 80px rgba(15, 23, 42, 0.18)';
  clone.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${duration}ms ease-out`;
  clone.style.zIndex = 9999;
  clone.style.pointerEvents = 'none';
  clone.style.opacity = '1';

  document.body.appendChild(clone);

  const deltaX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
  const deltaY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

  requestAnimationFrame(() => {
    clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
    clone.style.opacity = '0.15';

    cartIcon.classList.add('cart-bounce');
    const badge = cartIcon.querySelector('[data-cart-badge]');
    if (badge) badge.classList.add('badge-pulse');

    window.setTimeout(() => {
      clone.remove();
      cartIcon.classList.remove('cart-bounce');
      if (badge) badge.classList.remove('badge-pulse');
    }, duration + 90);
  });
}
