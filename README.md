# shopify-beauty-theme

A Shopify theme extension built on top of **Dawn** (Shopify's official reference theme) for a Beauty & Personal Care storefront. This repo contains the custom sections, snippets, and JS behavior that were added to a Dawn checkout — not a full re-publish of Dawn's source — plus a minimal, working theme skeleton so the additions can be previewed on their own with the Shopify CLI.

## What's custom here

**1. Supplier Sourcing Transparency** (`sections/supplier-sourcing-transparency.liquid`)
A block-based section, fully configurable from the Theme Editor with no code changes: merchants add one block per supplier/ingredient claim (origin, certification, sourcing note, optional icon) and reorder or add/remove blocks freely. Renders on the product page or as a standalone page section.

**2. QA Trust Badges** (`sections/qa-trust-badges.liquid`)
A block-based trust-badge row (dermatologist tested, cruelty-free, batch-tested, etc.) with icon, label, and optional tooltip copy per block — same block-editor pattern, so non-technical staff can maintain it.

**3. Live restock-urgency indicator** (`assets/restock-indicator.js`, `snippets/restock-indicator.liquid`)
A custom element, `<restock-indicator>`, that subscribes to Dawn's variant-change pub/sub event (`PUB_SUB_EVENTS.variantChange`) and re-renders its urgency copy ("Only 3 left", "In stock", "Notify me when back") the instant a shopper picks a different variant — no full product-page reload, matching how Dawn's own price/variant-picker updates work.

## Scope note

This repo is a **working demo, not a full Dawn fork**. `layout/`, base `sections/header.liquid` / `footer.liquid` / `main-product.liquid`, and `config/` are trimmed down to the minimum needed to render and preview the three features above in isolation. To ship this in production you'd merge these files into a full `shopify theme init` / Dawn checkout.

## Preview locally

```bash
shopify theme dev --store your-dev-store.myshopify.com
```

## Linting

```bash
theme-check .
```

`.theme-check.yml` extends the recommended Shopify ruleset used for the section/snippet/asset files above.

## Stack

Liquid, JSON (section schema), vanilla JavaScript (Web Components / custom elements), CSS.
