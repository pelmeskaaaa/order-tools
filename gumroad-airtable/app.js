const sampleEvent = {
  sale_id: "demo-sale-042",
  order_number: 704393042,
  email: "maya@example.test",
  product_id: "field-notes",
  product_name: "Field Notes Pack",
  price: 2400,
  currency: "usd",
  sale_timestamp: "2026-11-19T08:42:16Z",
  can_contact: true,
  refunded: false,
  disputed: false
};

let eventsReceived = 1;
let rowsCreated = 1;
let duplicateRows = 0;

const eventCount = document.querySelector("#event-count");
const rowCount = document.querySelector("#row-count");
const duplicateCount = document.querySelector("#duplicate-count");
const resultTitle = document.querySelector("#result-title");
const resultCopy = document.querySelector("#result-copy");
const runStatus = document.querySelector("#run-status");
const exceptionMessage = document.querySelector("#exception-message");
const payload = document.querySelector("#payload");

function renderCounts() {
  eventCount.textContent = String(eventsReceived);
  rowCount.textContent = String(rowsCreated);
  duplicateCount.textContent = String(duplicateRows);
}

document.querySelector("#toggle-payload").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const isOpen = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isOpen));
  button.textContent = isOpen ? "View source payload" : "Hide source payload";
  payload.textContent = JSON.stringify(sampleEvent, null, 2);
  payload.hidden = isOpen;
});

document.querySelector("#replay-sale").addEventListener("click", () => {
  eventsReceived += 1;
  // The demo merges on the existing Order Number instead of adding a row.
  renderCounts();
  resultTitle.textContent = "Existing row updated";
  resultCopy.textContent = "Order 704393042 matched the merge key. The row count stayed at one.";
  runStatus.textContent = "Replay checked · no duplicate created";
  exceptionMessage.hidden = true;
});

document.querySelector("#send-invalid").addEventListener("click", () => {
  const incomplete = { ...sampleEvent, order_number: "", email: "" };
  const missing = ["order_number", "email"].filter((key) => !String(incomplete[key] ?? "").trim());
  eventsReceived += 1;
  renderCounts();
  resultTitle.textContent = "Write stopped";
  resultCopy.textContent = "The event is rejected before Airtable is called.";
  runStatus.textContent = `Review required · ${missing.join(" and ")} missing`;
  exceptionMessage.textContent = `No row was created. Validation stopped this event because ${missing.join(" and ")} were missing. In n8n, the failed execution stays visible for inspection and retry after correction.`;
  exceptionMessage.hidden = false;
});
