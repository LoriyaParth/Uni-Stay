import { Link } from 'react-router-dom';

export default function Help() {
  const faqs = [
    { q: 'How do I list my property?', a: 'Click on "Add Listing" in the navigation bar. Fill in your property details including basic info, photos, room configurations, and amenities. You can save as draft or publish directly.' },
    { q: 'Is UniStay free to use?', a: 'Yes! Browsing and searching for accommodations is completely free for students. Property owners can list their properties at no cost.' },
    { q: 'How do I contact a property owner?', a: 'Click on any listing to view details. You\'ll find the owner\'s contact information including phone number and email on the listing detail page.' },
    { q: 'Can I save listings for later?', a: 'Yes! Click the heart icon on any listing card to save it to your favorites. You can access all saved listings from the "My Favorites" page.' },
    { q: 'How are listings verified?', a: 'Our team verifies each listing by cross-checking property details, photos, and owner credentials to ensure authenticity and safety.' },
    { q: 'What types of accommodation are available?', a: 'UniStay offers Paying Guests (PG), Private Apartments, Shared Flats, and Hostels near colleges and universities.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <header className="text-center mb-16">
        <span className="material-symbols-outlined text-5xl text-primary mb-4">help</span>
        <h1 className="font-h1 text-h1 text-on-surface mb-3">Help & Support</h1>
        <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">
          Everything you need to know about using UniStay. Can't find what you're looking for? Contact our support team.
        </p>
      </header>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="font-h2 text-h2 text-on-surface mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4 stagger-children">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant group">
              <summary className="font-semibold text-on-surface cursor-pointer list-none flex items-center justify-between">
                {faq.q}
                <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="mt-4 text-on-surface-variant text-body-md leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gradient-to-r from-primary to-primary-container rounded-2xl p-10 text-white text-center">
        <span className="material-symbols-outlined text-4xl mb-4 opacity-90">support_agent</span>
        <h2 className="text-2xl font-bold mb-3">Still Need Help?</h2>
        <p className="text-white/80 mb-6 max-w-md mx-auto">Our support team is available 24/7 to assist you with any queries or issues.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="mailto:support@unistay.com" className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">mail</span>Email Support
          </a>
          <a href="tel:+911234567890" className="px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all flex items-center justify-center gap-2 border border-white/30">
            <span className="material-symbols-outlined">call</span>Call Us
          </a>
        </div>
      </section>
    </div>
  );
}
