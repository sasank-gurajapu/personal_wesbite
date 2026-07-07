import { Link } from 'react-router-dom'
import { formatPostDate } from '../lib/posts.js'

export default function BlogCard({ post }) {
  return (
    <article className="blog-card">
      <time className="blog-card-date">{formatPostDate(post.date)}</time>
      <h2 className="blog-card-title">{post.title}</h2>
      <p className="blog-card-excerpt">{post.excerpt}</p>
      <Link to={`/thoughts-and-more/${post.slug}`} className="blog-card-cta">
        Read more →
      </Link>
    </article>
  )
}
