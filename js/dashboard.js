/* ==========================================================
   DASHBOARD LOGIC
   -----------------------------------------------------------
   Split into three zones:
   1) VERTICAL CONFIG — makes the same product sellable to a
      salon or a clinic by relabeling itself (this is the
      "product" thinking: one codebase, two markets).
   2) DATA LAYER — persists to localStorage today, swap for
      fetch() calls to your API once the backend exists.
   3) RENDER LAYER — draws whatever data it's given into the DOM.
   ========================================================== */


/* ---------------------------------------------------------
   1) VERTICAL CONFIG
   -----------------------------------------------------------
   Everything client-facing (labels, service list, notes
   wording) comes from here. Add a new business type by adding
   a new key — nothing else in the file needs to change. This
   is the difference between "a CRM" and "a CRM you can sell
   to two different industries."
   --------------------------------------------------------- */

   const VERTICAL_KEY = "localcrm_vertical";

   const verticals = {
     salon: {
       brandSuffix: "Salon",
       personSingular: "Client",
       personPlural: "Clients",
       services: ["Haircut", "Hair Coloring", "Facial", "Manicure", "Pedicure", "Massage", "Spa Package"],
       notesLabel: "Preferences & notes",
       notesPlaceholder: "e.g. allergic to ammonia, prefers evening slots",
       topbarSub: "Welcome back — here's who's booked in today",
     },
     clinic: {
       brandSuffix: "Clinic",
       personSingular: "Patient",
       personPlural: "Patients",
       services: ["Consultation", "Follow-up Checkup", "Dental Cleaning", "Vaccination", "Lab Test", "Physiotherapy"],
       notesLabel: "Medical notes & allergies",
       notesPlaceholder: "e.g. penicillin allergy, follow-up in 2 weeks",
       topbarSub: "Welcome back — here's today's patient schedule",
     },
   };
   
   function getVertical() {
     return localStorage.getItem(VERTICAL_KEY) || "salon";
   }
   
   function setVertical(key) {
     localStorage.setItem(VERTICAL_KEY, key);
     applyVerticalLabels();
   }
   
   // Updates every piece of UI text that depends on business type.
   function applyVerticalLabels() {
     const v = verticals[getVertical()];
   
     document.querySelectorAll(".vswitch-btn").forEach(btn => {
       btn.classList.toggle("active", btn.dataset.vertical === getVertical());
     });
   
     document.getElementById("navPersonLabel").textContent = v.personPlural;
     document.getElementById("topbarSub").textContent = v.topbarSub;
     document.getElementById("searchInput").placeholder = `Search ${v.personPlural.toLowerCase()}, appointments...`;
     document.getElementById("labelTotal").textContent = `Total ${v.personPlural}`;
     document.getElementById("chartTitle").textContent = `${v.personPlural} gained — last 7 days`;
     document.getElementById("tableTitle").textContent = `Recent ${v.personPlural}`;
     document.getElementById("thName").textContent = v.personSingular;
     document.getElementById("modalTitle").textContent = `Add ${v.personSingular}`;
     document.getElementById("labelName").firstChild.textContent = `${v.personSingular} name`;
     document.getElementById("labelNotes").firstChild.textContent = v.notesLabel;
     document.getElementById("fieldNotes").placeholder = v.notesPlaceholder;
     document.getElementById("submitLabel").textContent = `Save ${v.personSingular}`;
   
     const serviceSelect = document.getElementById("fieldService");
     serviceSelect.innerHTML = v.services.map(s => `<option value="${s}">${s}</option>`).join("");
   }
   
   
   /* ---------------------------------------------------------
      2) DATA LAYER
      -----------------------------------------------------------
      Customers persist in localStorage, so anything added through
      the form survives a reload. When you build the Express +
      MongoDB backend, replace load/save/add/delete with fetch()
      calls — the render layer below never has to change.
      --------------------------------------------------------- */
   
   const CUSTOMERS_KEY = "localcrm_customers";
   
   function seedFor(vertical) {
     if (vertical === "clinic") {
       return [
         { name: "Priya Sharma",  phone: "98765 43210", service: "Consultation",       status: "upcoming",  value: 800,  notes: "", appointmentDate: inHours(3) },
         { name: "Ankit Verma",   phone: "91234 56780", service: "Follow-up Checkup",  status: "completed", value: 500,  notes: "", appointmentDate: inHours(-20) },
         { name: "Fatima Sheikh", phone: "99887 66554", service: "Lab Test",           status: "upcoming",  value: 1200, notes: "", appointmentDate: inHours(26) },
         { name: "Rohit Jadhav",  phone: "90011 22334", service: "Vaccination",        status: "cancelled", value: 0,    notes: "", appointmentDate: inHours(-48) },
         { name: "Neha Kulkarni", phone: "93456 78901", service: "Physiotherapy",      status: "upcoming",  value: 900,  notes: "", appointmentDate: inHours(5) },
       ];
     }
     return [
       { name: "Priya Sharma",  phone: "98765 43210", service: "Haircut",       status: "upcoming",  value: 600,  notes: "", appointmentDate: inHours(3) },
       { name: "Ankit Verma",   phone: "91234 56780", service: "Massage",       status: "completed", value: 1500, notes: "", appointmentDate: inHours(-20) },
       { name: "Fatima Sheikh", phone: "99887 66554", service: "Hair Coloring", status: "upcoming",  value: 2600, notes: "", appointmentDate: inHours(26) },
       { name: "Rohit Jadhav",  phone: "90011 22334", service: "Manicure",      status: "cancelled", value: 0,    notes: "", appointmentDate: inHours(-48) },
       { name: "Neha Kulkarni", phone: "93456 78901", service: "Facial",        status: "upcoming",  value: 1200, notes: "", appointmentDate: inHours(5) },
     ];
   }
   
   function inHours(h) {
     return new Date(Date.now() + h * 60 * 60 * 1000).toISOString();
   }
   
   function loadCustomersFromStorage() {
     const raw = localStorage.getItem(CUSTOMERS_KEY);
     if (!raw) {
       const seed = seedFor(getVertical());
       localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(seed));
       return seed;
     }
     try {
       return JSON.parse(raw);
     } catch {
       return seedFor(getVertical());
     }
   }
   
   function saveCustomersToStorage(customers) {
     localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
   }
   
   // Later: async function getCustomers() { return (await fetch('/api/customers')).json(); }
   function getCustomers() {
     return Promise.resolve(loadCustomersFromStorage());
   }
   
   function addCustomer(customer) {
     const customers = loadCustomersFromStorage();
     customers.unshift(customer);
     saveCustomersToStorage(customers);
     return Promise.resolve(customers);
   }
   
   function deleteCustomer(index) {
     const customers = loadCustomersFromStorage();
     customers.splice(index, 1);
     saveCustomersToStorage(customers);
     return Promise.resolve(customers);
   }
   
   const mockWeeklyCustomers = [
     { day: "Mon", value: 4 },
     { day: "Tue", value: 7 },
     { day: "Wed", value: 5 },
     { day: "Thu", value: 9 },
     { day: "Fri", value: 6 },
     { day: "Sat", value: 11 },
     { day: "Sun", value: 8 },
   ];
   
   const mockPipeline = [
     { stage: "New",         count: 14, color: "var(--accent-blue)" },
     { stage: "Contacted",   count: 9,  color: "var(--accent-gold)" },
     { stage: "Negotiating", count: 5,  color: "var(--success)" },
     { stage: "Won",         count: 3,  color: "var(--text-secondary)" },
   ];
   
   function getWeeklyStats() {
     return Promise.resolve(mockWeeklyCustomers);
   }
   function getPipeline() {
     return Promise.resolve(mockPipeline);
   }
   
   
   /* ---------------------------------------------------------
      3) RENDER LAYER
      --------------------------------------------------------- */
   
   function formatCurrency(n) {
     return "₹" + n.toLocaleString("en-IN");
   }
   
   function formatApptTime(iso) {
     if (!iso) return { time: "—", day: "" };
     const d = new Date(iso);
     const now = new Date();
     const isToday = d.toDateString() === now.toDateString();
     const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
     const isTomorrow = d.toDateString() === tomorrow.toDateString();
     const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
     const day = isToday ? "Today" : isTomorrow ? "Tomorrow" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
     return { time, day };
   }
   
   function renderStats(customers) {
     document.getElementById("statCustomers").textContent = customers.length;
   
     const now = new Date();
     const todayCount = customers.filter(c => c.appointmentDate && new Date(c.appointmentDate).toDateString() === now.toDateString()).length;
     document.getElementById("statToday").textContent = todayCount;
     document.getElementById("statTodayDelta").textContent = `${todayCount} booked today`;
   
     const revenue = customers.filter(c => c.status === "completed").reduce((sum, c) => sum + c.value, 0)
       + customers.filter(c => c.status === "upcoming").reduce((sum, c) => sum + c.value, 0);
     document.getElementById("statRevenue").textContent = formatCurrency(revenue);
     document.getElementById("statFollowups").textContent = customers.filter(c => c.status === "upcoming").length;
   }
   
   function renderCustomerTable(customers) {
     const body = document.getElementById("customerTableBody");
     body.innerHTML = customers.map((c, i) => `
       <tr>
         <td>
           <span class="cust-name">${c.name}</span>
           <span class="cust-sub">${c.phone || ""}</span>
         </td>
         <td>${c.service || "—"}</td>
         <td><span class="status-pill ${c.status}">${c.status}</span></td>
         <td><button class="row-delete" data-index="${i}" aria-label="Delete">✕</button></td>
       </tr>
     `).join("");
   
     body.querySelectorAll(".row-delete").forEach(btn => {
       btn.addEventListener("click", async () => {
         const index = Number(btn.dataset.index);
         const updated = await deleteCustomer(index);
         renderStats(updated);
         renderCustomerTable(updated);
         renderAppointments(updated);
       });
     });
   }
   
   function renderAppointments(customers) {
     const list = document.getElementById("appointmentList");
     const upcoming = customers
       .filter(c => c.status === "upcoming" && c.appointmentDate)
       .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
       .slice(0, 5);
   
     if (upcoming.length === 0) {
       list.innerHTML = `<li class="appointment-empty">No upcoming appointments booked yet.</li>`;
       return;
     }
   
     list.innerHTML = upcoming.map(c => {
       const { time, day } = formatApptTime(c.appointmentDate);
       return `
         <li>
           <span class="appt-time">${time}</span>
           <span class="appt-who">
             <span class="appt-name">${c.name}</span>
             <span class="appt-service">${c.service || ""}</span>
           </span>
           <span class="appt-day">${day}</span>
           <span class="cust-value">${formatCurrency(c.value)}</span>
         </li>
       `;
     }).join("");
   }
   
   function renderBarChart(weekly) {
     const max = Math.max(...weekly.map(d => d.value));
     const chart = document.getElementById("barChart");
     chart.innerHTML = weekly.map(d => `
       <div class="bar-col">
         <span class="bar-val">${d.value}</span>
         <div class="bar" style="height:${(d.value / max) * 100}%"></div>
         <span class="bar-day">${d.day}</span>
       </div>
     `).join("");
   }
   
   function renderPipeline(pipeline) {
     const max = Math.max(...pipeline.map(p => p.count));
     const strip = document.getElementById("pipelineStrip");
     strip.innerHTML = pipeline.map(p => `
       <div class="pipe-stage">
         <h3>${p.stage} <span class="pipe-count">${p.count}</span></h3>
         <div class="pipe-bar-track">
           <div class="pipe-bar-fill" style="width:${(p.count / max) * 100}%; background:${p.color}"></div>
         </div>
       </div>
     `).join("");
   }
   
   function renderPulseFeed() {
     const v = verticals[getVertical()];
     const messages = v === verticals.clinic ? [
       "New patient registered from website form",
       "Bill #1042 marked as paid",
       "Reminder sent to Ankit Verma",
       "Patient Neha Kulkarni updated her phone number",
       "New note added on Fatima Sheikh's file",
       "Appointment moved to Follow-up Checkup",
       "Consultation completed for Priya Sharma",
     ] : [
       "New client captured from website form",
       "Invoice #1042 marked as paid",
       "Reminder sent to Ankit Verma",
       "Client Neha Kulkarni updated her phone number",
       "New note added on Fatima Sheikh's profile",
       "Booking moved to confirmed",
       "Appointment completed for Priya Sharma",
     ];
     const feed = document.getElementById("pulseFeed");
     const items = messages.map((msg, i) => `<li><span>${(i + 1) * 3}m ago</span>${msg}</li>`);
     feed.innerHTML = items.join("") + items.join("");
   }
   
   async function refreshAll() {
     const [customers, weekly, pipeline] = await Promise.all([
       getCustomers(),
       getWeeklyStats(),
       getPipeline(),
     ]);
     renderStats(customers);
     renderCustomerTable(customers);
     renderAppointments(customers);
     renderBarChart(weekly);
     renderPipeline(pipeline);
     renderPulseFeed();
   }
   
   async function initDashboard() {
     applyVerticalLabels();
     await refreshAll();
   }
   
   
   /* ---------------------------------------------------------
      4) MODAL + VERTICAL SWITCH WIRING
      --------------------------------------------------------- */
   
   function setupVerticalSwitch() {
     document.querySelectorAll(".vswitch-btn").forEach(btn => {
       btn.addEventListener("click", () => {
         setVertical(btn.dataset.vertical);
         // Re-seed the service dropdown and re-render everything so
         // labels/services match the newly selected business type.
         refreshAll();
       });
     });
   }
   
   function setupAddCustomerModal() {
     const overlay = document.getElementById("modalOverlay");
     const openBtn = document.getElementById("openAddCustomer");
     const closeBtn = document.getElementById("closeAddCustomer");
     const form = document.getElementById("addCustomerForm");
   
     function open() {
       overlay.classList.add("open");
       document.getElementById("fieldName").focus();
     }
     function close() {
       overlay.classList.remove("open");
       form.reset();
     }
   
     openBtn.addEventListener("click", open);
     closeBtn.addEventListener("click", close);
     overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
     document.addEventListener("keydown", (e) => {
       if (e.key === "Escape" && overlay.classList.contains("open")) close();
     });
   
     form.addEventListener("submit", async (e) => {
       e.preventDefault();
       const apptInput = document.getElementById("fieldAppointment").value;
       const newCustomer = {
         name: document.getElementById("fieldName").value.trim(),
         phone: document.getElementById("fieldPhone").value.trim(),
         service: document.getElementById("fieldService").value,
         status: document.getElementById("fieldStatus").value,
         value: Number(document.getElementById("fieldValue").value) || 0,
         notes: document.getElementById("fieldNotes").value.trim(),
         appointmentDate: apptInput ? new Date(apptInput).toISOString() : null,
       };
       const updated = await addCustomer(newCustomer);
       renderStats(updated);
       renderCustomerTable(updated);
       renderAppointments(updated);
       close();
     });
   }
   
   document.addEventListener("DOMContentLoaded", () => {
     initDashboard();
     setupVerticalSwitch();
     setupAddCustomerModal();
   });