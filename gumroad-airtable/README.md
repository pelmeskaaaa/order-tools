# Gumroad → Airtable sales sync

An inspectable n8n example for sending new Gumroad sales into Airtable. It is built around one practical rule: an event must not silently disappear or create a second row when it is replayed.

## What the sample shows

- A Gumroad sale event is checked for an order number, buyer email, product ID, amount, currency, and timestamp.
- Valid events are mapped to a small Airtable sales table.
- Airtable `performUpsert` merges on **Order Number**, so replaying the same event updates the matching row.
- Invalid events stop with a readable error before any Airtable write.
- Gumroad's `can_contact` flag is recorded as a checkbox. The workflow does not send email.
- The workflow is imported inactive and contains no credentials or real customer data.

The browser demo is simulated. It does not connect to a Gumroad or Airtable account. The downloadable workflow becomes live only after the owner adds their credentials and replaces the base and table IDs.

## Files

- `index.html`, `styles.css`, `app.js` — interactive, fictional-data walkthrough.
- `sample-sale.json` — example Gumroad event.
- `expected-airtable-upsert.json` — exact upsert request body for that event.
- `n8n-workflow.json` — inactive n8n workflow export with credential and table placeholders.

## Airtable table fields

Create a table with these exact names before enabling the workflow:

| Field | Airtable type |
| --- | --- |
| Order Number | Single line text; unique merge key |
| Sale ID | Single line text |
| Buyer Email | Email |
| Product ID | Single line text |
| Product Name | Single line text |
| Sale Amount | Currency or number |
| Currency | Single line text |
| Sale Date | Date with time |
| Can Contact | Checkbox |

## Setup outline

1. Import `n8n-workflow.json` into n8n. It is intentionally inactive.
2. Add a Gumroad credential with sale access to the trigger. The Gumroad Trigger receives the event body sent to its webhook URL.
3. Create an Airtable personal access token with access only to the target base and record read/write scopes. Add it as an HTTP Header Auth credential using `Authorization: Bearer <token>`.
4. Replace `appREPLACE_ME/tblREPLACE_ME` in the Airtable URL with the IDs for the target base and table.
5. Run a test event, inspect the mapped Airtable row, replay the same order, and confirm that the row count stays the same.
6. Try a payload with a required field missing. The workflow should stop before the Airtable node and show the validation error in the n8n execution.
7. Activate only after the owner has confirmed the field mapping and test results.

Historical import, refund/dispute updates, and reconciliation against past Gumroad sales are outside this small sales-only example. They can be added after confirming how the store should represent those events. The sample records `can_contact` so the owner can filter follow-ups by Gumroad's permission flag; it does not send email or decide whether a particular message is legally permitted.

## Demo data

All names, products, emails, and amounts in the demo are fictional. The `.test` email domain is reserved for examples. No client credentials, live webhooks, or customer records are included.

## Sources

- [n8n Gumroad Trigger](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.gumroadtrigger)
- [Gumroad API response fields](https://gumroad.com/help/article/76-license-keys)
- [n8n Gumroad Trigger implementation](https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Gumroad/GumroadTrigger.node.ts)
- [Airtable API call limits and `performUpsert`](https://support.airtable.com/articles/7735693959-managing-api-call-limits-in-airtable)

Copyright 2026 Oleh Boiko. Fictional demonstration materials. No permission to resell this sample as a template.
