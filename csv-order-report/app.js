"use strict";
(() => {
  const report = window.SAMPLE_REPORT;
  const byId = id => document.getElementById(id);
  const money = value => "$" + Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const text = (tag, value, className) => {
    const node = document.createElement(tag);
    node.textContent = String(value);
    if (className) node.className = className;
    return node;
  };
  const cell = (row, value, className) => {
    const node = text("td", value, className);
    row.append(node);
    return node;
  };
  const empty = (tbody, span) => {
    const row = document.createElement("tr");
    const node = cell(row, "No matching rows. Try another order ID or clear the search.", "empty-cell");
    node.colSpan = span;
    tbody.append(row);
  };

  byId("revenue").textContent = money(report.revenue);
  const metrics = {"unit-count": report.units, "accepted-count": report.counts.accepted, "input-count": report.counts.input, "flow-accepted": report.counts.accepted, "duplicate-count": report.counts.exact_duplicates, "rejected-count": report.counts.rejected};
  Object.entries(metrics).forEach(([id, value]) => { byId(id).textContent = String(value); });

  const monthNames = {"01":"January", "02":"February", "03":"March"};
  const summaryRows = (target, rows, key, format) => {
    const body = byId(target);
    rows.forEach(item => {
      const row = document.createElement("tr");
      cell(row, format ? format(item[key]) : item[key]);
      cell(row, item.orders, "number");
      cell(row, item.units, "number");
      cell(row, money(item.revenue), "number");
      body.append(row);
    });
  };
  summaryRows("monthly-rows", report.monthly, "month", value => { const [year,month] = value.split("-"); return (monthNames[month] || month) + " " + year; });
  summaryRows("category-rows", report.categories, "category");

  function renderAccepted() {
    const query = byId("accepted-search").value.trim().toLowerCase();
    const rows = report.accepted.filter(item => item.order_id.toLowerCase().includes(query));
    const body = byId("accepted-rows");
    body.replaceChildren();
    rows.forEach(item => {
      const row = document.createElement("tr");
      cell(row, item.source_row);
      cell(row, item.order_id, "order-id");
      cell(row, item.order_date);
      cell(row, item.category);
      cell(row, item.quantity, "number");
      cell(row, money(item.unit_price), "number");
      cell(row, money(item.revenue), "number");
      body.append(row);
    });
    if (!rows.length) empty(body, 7);
    byId("accepted-status").textContent = "Showing " + rows.length + " of " + report.accepted.length + " accepted orders" + (query ? " matching your search." : ".");
  }

  function renderReview() {
    const query = byId("review-search").value.trim().toLowerCase();
    const rows = report.exceptions.filter(item => (item.original.order_id + " " + item.reason).toLowerCase().includes(query));
    const body = byId("review-rows");
    body.replaceChildren();
    rows.forEach(item => {
      const source = item.original;
      const row = document.createElement("tr");
      cell(row, item.source_row);
      const order = cell(row, "");
      order.append(text("span", source.order_id || "Missing ID", "order-id"), text("span", source.order_date, "cell-secondary"));
      cell(row, source.category || "Missing category");
      const amounts = cell(row, source.quantity || "Missing", "number");
      amounts.append(text("span", source.unit_price || "Missing", "cell-secondary"));
      const result = cell(row, "");
      result.append(text("span", item.disposition, "badge"));
      cell(row, item.reason, "reason-cell");
      body.append(row);
    });
    if (!rows.length) empty(body, 6);
    byId("review-status").textContent = "Showing " + rows.length + " of " + report.exceptions.length + " excluded rows" + (query ? " matching your search." : ".");
  }

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function activate(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      byId(item.getAttribute("aria-controls")).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", event => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activate(tabs[next], true); }
    });
  });
  byId("accepted-search").addEventListener("input", renderAccepted);
  byId("review-search").addEventListener("input", renderReview);
  renderAccepted();
  renderReview();
})();
