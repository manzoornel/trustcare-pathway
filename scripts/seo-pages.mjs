// Single source of truth for the static (pre-rendered) SEO content of each public page.
// Search engines and AI assistants that don't run JavaScript read this HTML.
// Keep facts here in sync with the React pages.

export const SITE = "https://doctoruncle.in";

const nav = `
<nav aria-label="Main">
  <a href="/">Home</a> · <a href="/services">Services</a> · <a href="/doctors">Our Doctors</a> ·
  <a href="/about">About</a> · <a href="/blog">Health Blog</a> · <a href="/careers">Careers</a> ·
  <a href="/contact">Contact</a>
</nav>`;

const branches = `
<section>
  <h2>Our branches</h2>
  <h3>Vakkad Branch</h3>
  <p>Near Malayalam University, Vakkad, Tirur, Kerala 676502.<br>
  Open 24 hours, every day, with a casualty (emergency) department.<br>
  Phone: <a href="tel:+919961588880">99615 88880</a></p>
  <h3>Unniyal Branch</h3>
  <p>Unniyal Junction, Tanur Road, Unniyal, Kerala.<br>
  Open 7 AM – 10 PM, every day.<br>
  Phone: <a href="tel:+918089771640">80897 71640</a> | <a href="tel:+918089771641">80897 71641</a></p>
  <p>Email: contact@doctoruncle.in</p>
</section>`;

const services = `
<ul>
  <li><strong>General medicine and primary care</strong> for all ages: fever, infections, chronic conditions and check-ups.</li>
  <li><strong>Diabetes care</strong>: personalised treatment plans, continuous glucose monitoring and diet counselling.</li>
  <li><strong>Minor surgical procedures.</strong></li>
  <li><strong>Women's health</strong>, including preventive screening and prenatal care.</li>
  <li><strong>Home care</strong> in Vakkad, Unniyal, Tanur and nearby areas: doctor home visits, nursing care, injections and IV infusions, physiotherapy, ECG and home sample collection for lab tests.</li>
  <li><strong>Laboratory tests and ECG.</strong></li>
  <li><strong>On-site pharmacy.</strong></li>
  <li><strong>Telemedicine</strong> consultations.</li>
</ul>`;

export const pages = [
  {
    path: "/",
    title: "Doctor Uncle Family Clinic | 24-Hour Clinic in Vakkad, Tirur & Unniyal",
    description:
      "Family clinic near Tirur: Vakkad branch open 24 hours, Unniyal branch 7 AM–10 PM. General medicine, diabetes care, minor surgery, home visits, lab and pharmacy. Call 99615 88880.",
    body: `${nav}
<main>
  <h1>Doctor Uncle Family Clinic — Vakkad &amp; Unniyal, Tirur</h1>
  <p>A family clinic with two branches near Tirur, Malappuram district, Kerala. Our Vakkad branch is open 24 hours with a casualty department; our Unniyal branch is open from 7 AM to 10 PM.</p>
  <h2>Services</h2>${services}
  ${branches}
</main>`,
  },
  {
    path: "/services",
    title: "Services | Primary Care, Diabetes & Home Care | Doctor Uncle, Tirur",
    description:
      "General medicine, diabetes care with glucose monitoring, minor surgery, women's health, lab and ECG, pharmacy, telemedicine and home care at our Vakkad and Unniyal branches.",
    body: `${nav}
<main>
  <h1>Healthcare services at Doctor Uncle Family Clinic</h1>
  <p>These services are offered at our Vakkad and Unniyal branches. Casualty (emergency) care is available 24 hours at the Vakkad branch.</p>
  ${services}
  ${branches}
</main>`,
  },
  {
    path: "/doctors",
    title: "Our Doctors | Doctor Uncle Family Clinic, Vakkad & Unniyal",
    description:
      "Meet the doctors at Doctor Uncle Family Clinic near Tirur: general practitioners, general medicine and specialist consultations at our Vakkad and Unniyal branches.",
    body: `${nav}
<main>
  <h1>Our doctors</h1>
  <p>Doctor Uncle Family Clinic's general practitioners and specialists see patients at our Vakkad and Unniyal branches. The current team, with each doctor's speciality and timings, is listed on this page.</p>
  ${branches}
</main>`,
  },
  {
    path: "/about",
    title: "About Doctor Uncle Family Clinic | Family Healthcare in Vakkad & Unniyal",
    description:
      "Doctor Uncle Family Clinic provides family healthcare near Tirur, Kerala, through two branches: Vakkad (open 24 hours) and Unniyal (7 AM–10 PM).",
    body: `${nav}
<main>
  <h1>About Doctor Uncle Family Clinic</h1>
  <p>Doctor Uncle Family Clinic provides healthcare for the whole family through two branches near Tirur, Malappuram district, Kerala.</p>
  ${branches}
</main>`,
  },
  {
    path: "/contact",
    title: "Contact & Directions | Doctor Uncle Clinic, Vakkad & Unniyal",
    description:
      "Vakkad branch near Malayalam University, open 24 hours: 99615 88880. Unniyal branch, Unniyal Junction, Tanur Road, 7 AM–10 PM: 80897 71640.",
    body: `${nav}
<main>
  <h1>Contact Doctor Uncle Family Clinic</h1>
  ${branches}
  <p>Directions: <a href="https://maps.app.goo.gl/APyMEnBeAxSfB5bX8">Vakkad branch on Google Maps</a> · <a href="https://maps.app.goo.gl/GqAqenygrwV5vo3cA">Unniyal branch on Google Maps</a></p>
</main>`,
  },
  {
    path: "/blog",
    title: "Health Blog | Expert Medical Tips from Doctor Uncle Family Clinic",
    description:
      "Health articles and medical guides from the doctors at Doctor Uncle Family Clinic, Vakkad and Unniyal, near Tirur.",
    body: `${nav}
<main>
  <h1>Health blog</h1>
  <p>Health articles and practical advice from the doctors at Doctor Uncle Family Clinic.</p>
</main>`,
  },
  {
    path: "/careers",
    title: "Careers | Doctor Uncle Family Clinic, Tirur",
    description:
      "Current job openings at Doctor Uncle Family Clinic's Vakkad and Unniyal branches near Tirur, Kerala.",
    body: `${nav}
<main>
  <h1>Careers at Doctor Uncle Family Clinic</h1>
  <p>Current openings at our Vakkad and Unniyal branches are listed on this page.</p>
</main>`,
  },
];
