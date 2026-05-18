# Payment method icons

The site renders these via `<img src="/payment-icons/<key>.png" />` in
`src/components/PaymentMethodLogo.tsx`. Drop the official brand SVG for
each scheme below — the merchant agreement with Tap (and with each
scheme directly) gives you the right to display these marks.

Required files:

- `visa.png`        — Visa Inc. brand portal: https://merchantsignageapi.visa.com/
- `mastercard.png`  — Mastercard brand center: https://brand.mastercard.com/
- `amex.png`        — American Express merchant marketing toolkit
- `mada.png`        — mada (Saudi Payments): https://www.mada.com.sa/en/branding
- `knet.png`        — KNET (Kuwait): request from KNET merchant services
- `benefit.png`     — Benefit (Bahrain): https://www.benefit.bh/
- `meeza.png`       — meeza (Egypt): https://www.meeza.eg/
- `apple-pay.png`   — Apple Pay marketing assets: https://developer.apple.com/apple-pay/marketing/
- `google-pay.png`  — Google Pay brand guidelines: https://developers.google.com/pay/api/web/guides/brand-guidelines

Tip: Tap publishes a merchant brand kit that bundles most of these.
Check your Tap dashboard for "Brand assets" or contact Tap merchant
support and ask for the payment-methods logo bundle.

Until the files are present, the footer + receipt strip will render
broken-image icons.
