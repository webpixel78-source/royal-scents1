# Royal Scents Kampala website

A responsive storefront made with plain HTML, CSS and JavaScript. It includes:
- Home, product collection, About and Contact sections
- Product search and category filters
- Shopping bag with quantity controls and remove/clear actions
- WhatsApp order message with selected products and quantities
- Phone and email links
- Responsive mobile navigation
- Local product image assets

## Files
- `index.html` — page structure
- `styles.css` — design and responsive styling
- `script.js` — catalogue, filters, cart and WhatsApp actions
- `assets/` — product photographs

## Publish it
1. Extract `royal-scents-kampala.zip` on your computer or phone.
2. Upload the contents of the `royal-scents-kampala` folder to your host's website root folder (often called `public_html`, `www`, or `htdocs`).
3. Keep `index.html`, `styles.css`, `script.js`, and the `assets` folder together in the same folder structure.
4. Open your domain and test navigation, search, add-to-bag, quantity controls, and WhatsApp checkout.
5. For Netlify Drop or a similar static host, upload the extracted folder (or drag the ZIP if that host supports ZIP deployment).

## Important notes
- All nine listed perfumes are priced at UGX 40,000 each. Product cards, cart line items, estimated totals, and WhatsApp order messages use this price. To change a product's price later, edit its `price:40000` value in `script.js`.
- The cart is a front-end enquiry cart; it does not process card/mobile-money payments or store orders in a database. WhatsApp opens a pre-filled message for the customer to send.
- The business contact details in this version are: +256 753 629 773, webpixel78@gmail.com, Kampala, Uganda.
- Google Fonts and the two decorative Unsplash hero/background photographs load over the internet. Product images are bundled locally and do not need an external image service.
- Some product photographs were supplied by the owner and still show the original shop setting/hand. The generated clean product images are used for Kai Aly Vanilla Candy, Kai Aly Vanilla 128, Hawas London, Asad, 9PM Black and 9PM Brown.
