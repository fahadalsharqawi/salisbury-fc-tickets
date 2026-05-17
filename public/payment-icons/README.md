# Payment method icons

The site renders these via `<img src="/payment-icons/<key>.svg" />` in
`src/components/PaymentMethodLogo.tsx`. Drop the official brand SVG for
each scheme below — the merchant agreement with Tap (and with each
scheme directly) gives you the right to display these marks.

Required files:

- `visa.svg`        — Visa Inc. brand portal: https://merchantsignageapi.visa.com/
- `mastercard.svg`  — Mastercard brand center: https://brand.mastercard.com/
- `amex.svg`        — American Express merchant marketing toolkit
- `mada.svg`        — mada (Saudi Payments): https://www.mada.com.sa/en/branding
- `knet.svg`        — KNET (Kuwait): request from KNET merchant services
- `benefit.svg`     — Benefit (Bahrain): https://www.benefit.bh/
- `meeza.svg`       — meeza (Egypt): https://www.meeza.eg/
- `apple-pay.svg`   — Apple Pay marketing assets: https://developer.apple.com/apple-pay/marketing/
- `google-pay.svg`  — Google Pay brand guidelines: https://developers.google.com/pay/api/web/guides/brand-guidelines

Tip: Tap publishes a merchant brand kit that bundles most of these.
Check your Tap dashboard for "Brand assets" or contact Tap merchant
support and ask for the payment-methods logo bundle.

Until the files are present, the footer + receipt strip will render
broken-image icons.
