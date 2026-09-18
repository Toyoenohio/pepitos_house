export interface SelectedModifier {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  priceDelta: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  image: string;
  size?: string;
  modifiers: SelectedModifier[];
}

export interface CustomerData {
  name: string;
  phone: string;
  email: string;
  zone: string;
  address: string;
  reference: string;
  paymentMethod: string;
  notes: string;
}

export const WHATSAPP_PHONE = '584248319602';

export function formatWhatsAppMessage(customer: CustomerData, items: CartItem[], total: number, deliveryFee: number = 0): string {
  const lines: string[] = [];

  lines.push('🥖 *¡NUEVO PEDIDO - PEPITOS HOUSE 251!* 🥖');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('*Cliente:* ' + customer.name);
  lines.push('*Teléfono:* ' + customer.phone);
  if (customer.email) {
    lines.push('*Email (Membresía):* ' + customer.email);
  }
  lines.push('*Zona:* ' + customer.zone);
  lines.push('*Dirección:* ' + customer.address);
  if (customer.reference) {
    lines.push('*Punto de Ref:* ' + customer.reference);
  }
  lines.push('*Método de Pago:* ' + customer.paymentMethod);
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('*DETALLE DEL PEDIDO:*');

  items.forEach((item, index) => {
    const itemTotal = (item.unitPrice * item.quantity).toFixed(2);
    lines.push('\n*' + (index + 1) + '. ' + item.name + '* x' + item.quantity + ' = *$' + itemTotal + '*');
    if (item.size) {
      lines.push('   📏 Tamaño: _' + item.size + '_');
    }
    const extras = item.modifiers.filter(m => m.groupId !== 'size');
    if (extras.length > 0) {
      const extrasStr = extras.map(e => e.optionName + ' (+$' + e.priceDelta.toFixed(2) + ')').join(', ');
      lines.push('   ➕ Extras: _' + extrasStr + '_');
    }
  });

  const subtotal = items.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);
  lines.push('\n━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('Subtotal: $' + subtotal.toFixed(2));
  if (deliveryFee > 0) {
    lines.push('Delivery (' + customer.zone + '): $' + deliveryFee.toFixed(2));
  } else {
    lines.push('Delivery (' + customer.zone + '): *GRATIS* (Promo)');
  }
  lines.push('💰 *TOTAL A PAGAR: $' + total.toFixed(2) + '*');

  if (customer.notes && customer.notes.trim()) {
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('📝 *Notas:* ' + customer.notes);
  }

  lines.push('\n🙏 *¡Por favor confirmen mi pedido para procesarlo! Gracias.*');

  return lines.join('\n');
}

export function generateWhatsAppUrl(customer: CustomerData, items: CartItem[], total: number, deliveryFee: number = 0): string {
  const message = formatWhatsAppMessage(customer, items, total, deliveryFee);
  return 'https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(message);
}
