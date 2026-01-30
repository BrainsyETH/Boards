import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Float Trip Guides & Resources',
  description: 'Expert guides and tips for planning the perfect float trip on Missouri rivers. Learn about water conditions, access points, and the best times to float.',
};

const blogPosts = [
  {
    slug: 'best-float-rivers-missouri-2026',
    title: 'Best Float Rivers in Missouri: Complete Guide 2026',
    description: 'Discover the top 8 float rivers in Missouri, from beginner-friendly creeks to scenic Ozark waterways. Compare difficulty, scenery, and access points.',
    date: '2026-01-29',
    readTime: '12 min read',
    category: 'Guides',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col bg-neutral-50">
      {/* Hero */}
      <section className="relative py-12 md:py-16 text-white" style={{ background: 'linear-gradient(to bottom right, #0F2D35, #163F4A, #0F2D35)' }}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full" style={{ backgroundColor: '#1D525F' }}>
              <BookOpen className="w-8 h-8 text-primary-300" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Eddy's Thoughts
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Expert tips, river guides, and planning advice for Missouri float trips
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="flex-1 py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-white border-2 border-neutral-200 rounded-xl p-6 shadow-sm
                           hover:border-primary-400 hover:shadow-md transition-all no-underline"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
                    {post.category}
                  </span>
                  <span className="text-xs text-neutral-500">{post.readTime}</span>
                </div>

                <h2 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">
                  {post.title}
                </h2>

                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{post.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <time dateTime={post.date} className="text-xs text-neutral-500">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                  <div className="flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:text-primary-700">
                    Read more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA to main app */}
          <div className="mt-12 text-center">
            <p className="text-neutral-600 mb-4">Ready to start planning your float?</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
            >
              Plan Your Float
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-800 border-t-2 border-neutral-900 px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4 p-4 bg-primary-700/50 rounded-lg border border-primary-600/30">
            <p className="text-sm text-primary-100 text-center">
              <strong className="text-white">Safety First:</strong> Eddy is a planning guide only. Always consult local outfitters and authorities for current conditions before floating.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-primary-200">
            <div className="flex items-center gap-4">
              <p>Eddy &middot; Water data from USGS</p>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
            <p className="text-center md:text-right text-primary-300">
              &copy; {new Date().getFullYear()} eddy.guide &middot; For informational purposes only
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
