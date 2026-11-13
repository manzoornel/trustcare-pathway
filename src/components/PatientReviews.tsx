// Real patient reviews live on our Google Business Profiles.
// (The earlier sample testimonials were template placeholders and have been removed.)
const branches = [
  {
    name: "Vakkad Branch",
    detail: "Near Malayalam University · Open 24 hours",
    href: "https://maps.app.goo.gl/APyMEnBeAxSfB5bX8",
  },
  {
    name: "Unniyal Branch",
    detail: "Unniyal Junction, Tanur Road · 7 AM – 10 PM",
    href: "https://maps.app.goo.gl/GqAqenygrwV5vo3cA",
  },
];

const PatientReviews = () => (
  <section className="py-12 bg-gray-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl font-bold text-gray-900">What Our Patients Say</h2>
      <p className="mt-4 text-lg text-gray-600">
        Read genuine reviews from our patients on Google, and share your own
        experience after your visit.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((b) => (
          <a
            key={b.name}
            href={b.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900">{b.name}</h3>
            <p className="text-gray-600 mt-1">{b.detail}</p>
            <span className="inline-block mt-4 text-primary font-medium">
              Read reviews on Google →
            </span>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default PatientReviews;
