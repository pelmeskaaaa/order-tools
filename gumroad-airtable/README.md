# Gumroad → Airtable sales sync

An inspectable n8n example for recording Gumroad sales in Airtable. It uses a sale notice to start the workflow, then checks the sale ID against Gumroad's authenticated Sales API before preparing an Airtable write.

## What the workflow does

1. Receive a Gumroad sale notice.
2. Require a sale ID and look up that sale in the connected Gumroad account.
3. Stop if Gumroad does not confirm the sale, the returned ID does not match, the sale is refunded or disputed, or required fields are missing.
4. Map the confirmed sale to Airtable and upsert by **Order Number**, so a replay updates the existing row.

The n8n Gumroad Trigger passes the received request body to the workflow. This example does not treat that notification itself as proof of a sale. The separate authenticated lookup is the confirmation step. The workflow is inactive on import and contains no credentials, Airtable IDs, or real buyer data.

The interactive page is a simulation using fictional data. It does not connect to either service. A real first run is still needed to confirm that the Gumroad notification's ID matches the ID accepted by the account's Sales API.

## Files

- `index.html`, `styles.css`, `app.js` — interactive, fictional-data walkthrough.
- `sample-sale.json` — example notification.
- `expected-airtable-upsert.json` — expected Airtable request for the fictional sale.
- `n8n-workflow.json` — inactive n8n workflow with credential and table placeholders.

## Airtable table fields

Create a table with these exact names before enabling the workflow:

| Field | Airtable type |
| --- | --- |
| Order Number | Single line text; merge key |
| Sale ID | Single line text |
| Buyer Email | Email |
| Product ID | Single line text |
| Product Name | Single line text |
| Sale Amount | Currency or number |
| Currency | Single line text |
| Sale Date | Date with time |
| Can Contact | Checkbox |

## Setup

1. Import `n8n-workflow.json` into n8n. Keep it inactive while configuring.
2. Select a Gumroad API credential with the `view_sales` scope on both the Gumroad Trigger and **Verify sale with Gumroad API**. Keep the token in n8n's credential store; do not paste it into a URL or workflow code.
3. Add an Airtable personal access token limited to the target base and record read/write scopes. Select it on **Upsert Airtable sale**.
4. Replace `appREPLACE_ME/tblREPLACE_ME` with the target base and table IDs.
5. Send or replay a real sale notice while the workflow is inactive in test mode. Confirm that Gumroad returns the matching sale ID, then inspect the mapped Airtable row.
6. Replay the same order and confirm that the row count stays the same. Try a notification with a missing ID and confirm that it stops before the Airtable node.
7. Activate only after the owner confirms the field mapping and first live result.

Refund and dispute events, later updates to an existing sale, and historical imports are not included. The workflow stops a sale that is already refunded or disputed when it is checked. If those later changes need to update Airtable, add separate Gumroad event subscriptions and agree the accounting rules first. `Can Contact` is stored as a flag; the workflow does not send email.

## Sources

- [n8n Gumroad Trigger documentation](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.gumroadtrigger)
- [n8n Gumroad Trigger source](https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/nodes/Gumroad/GumroadTrigger.node.ts)
- [n8n Gumroad credential documentation](https://docs.n8n.io/integrations/builtin/credentials/gumroad)
- [Gumroad Sales API controller](https://github.com/antiwork/gumroad/blob/main/app/controllers/api/v2/sales_controller.rb)
- [Gumroad sale fields and API response example](https://gumroad.com/help/article/76-license-keys)
- [Airtable API call limits and `performUpsert`](https://support.airtable.com/articles/7735693959-managing-api-call-limits-in-airtable)

Copyright 2026 Oleh Boiko. Fictional demonstration materials. No permission to resell this sample as a template.

