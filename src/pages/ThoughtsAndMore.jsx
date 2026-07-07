import { POSTS } from '../lib/posts.js'
import BlogCard from '../components/BlogCard.jsx'

export default function ThoughtsAndMore() {
  return (
    <div className="content">
      <h1 className="page-title">Thoughts & More</h1>
      <p className="page-description">Blog posts and travel compilations — things I've written and places I've been.</p>
      <div className="blog-grid">
        {POSTS.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
