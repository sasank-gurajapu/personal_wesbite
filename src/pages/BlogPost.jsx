import { useParams, Link, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPostBySlug, formatPostDate } from '../lib/posts.js'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) return <Navigate to="/thoughts-and-more" replace />

  return (
    <div className="content">
      <Link to="/thoughts-and-more" className="back-link">
        ← Thoughts & More
      </Link>
      <article>
        <time className="blog-post-date">{formatPostDate(post.date)}</time>
        <h1 className="page-title">{post.title}</h1>
        <div className="blog-post-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
