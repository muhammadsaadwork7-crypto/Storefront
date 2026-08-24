export default function StoreFooter({ categories }) {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {/* Brand blurb */}
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 font-bold text-white text-lg mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-black text-sm">
              S
            </span>
            Storefront
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Quality clothes and shoes, picked for you.
          </p>
        </div>

        {/* Shop links */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Shop</h4>
          <ul className="flex flex-col gap-2 text-sm">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <a href={`#category-${c.id}`} className="text-gray-400 hover:text-white transition-colors">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Company</h4>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">About us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>

        {/* Newsletter (static for now) */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Stay in the loop</h4>
          <p className="text-sm text-gray-400 mb-3">Get updates on new arrivals and offers.</p>
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email"
              className="bg-gray-800 text-sm text-white placeholder-gray-500 rounded-l-md px-3 py-2 flex-1 outline-none"
            />
            <button
              type="submit"
              className="bg-white text-black text-sm font-medium px-3 rounded-r-md"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Storefront. All rights reserved.</span>
          <span>Built with React, Express & PostgreSQL</span>
        </div>
      </div>
    </footer>
  );
}
