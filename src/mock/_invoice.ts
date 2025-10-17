import { add, subDays } from 'date-fns';
import { _addressBooks } from './_others';

// Define a mock function for generating unique IDs
const generateUniqueId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

// Define a mock function for generating random numbers
const generateRandomNumber = () => {
  return Math.floor(Math.random() * 1000);
};

// Define INVOICE_SERVICE_OPTIONS
const INVOICE_SERVICE_OPTIONS = [...Array(8)].map((_, index) => ({
  id: generateUniqueId(),
  name: `Filters ${index + 1}`,
  price: generateRandomNumber(),
}));

// Define ITEMS based on INVOICE_SERVICE_OPTIONS
const ITEMS = INVOICE_SERVICE_OPTIONS.map((option, index) => {
  const total = option.price * generateRandomNumber();
  return {
    id: generateUniqueId(),
    total,
    title: `Item ${index + 1}`,
    description: `Description ${index + 1}`,
    price: option.price,
    service: option.name,
    quantity: generateRandomNumber(),
  };
});

// Define _invoices based on the IInvoice type
const _invoices = [...Array(20)].map((_, index) => {
  const taxes = generateRandomNumber();
  const discount = generateRandomNumber();
  const shipping = generateRandomNumber();

  const subTotal = ITEMS.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);

  const totalAmount = subTotal - shipping - discount + taxes;

  const status =
    (index % 2 && 'paid') ||
    (index % 3 && 'paid') ||
    (index % 4 && 'overdue') ||
    'draft';

  return {
    id: generateUniqueId(),
    taxes,
    status,
    discount,
    shipping,
    subTotal,
    totalAmount,
    items: ITEMS,
    invoiceNumber: `Invoice ${index + 1}`,
    invoiceFrom: _addressBooks[index],
    invoiceTo: _addressBooks[index + 1],
    projectNumber: `ProjectName${index}`,
    sent: generateRandomNumber(),
    createDate: subDays(new Date(), index),
    dueDate: add(new Date(), { days: index + 15, hours: index }),
  };
});

export { INVOICE_SERVICE_OPTIONS, _invoices };
