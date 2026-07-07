import { useParams, Link, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { getDeepDiveBySlug } from '../lib/deepdives.js'

export default function DeepDive() {
  const { slug } = useParams()
  const deepDive = getDeepDiveBySlug(slug)

  if (!deepDive) return <Navigate to="/professional-life" replace />

  return (
    <div className="content">
      <Link to="/professional-life" className="back-link">
        ← Professional Life
      </Link>
      <article>
        {deepDive.company && <p className="blog-post-date">{deepDive.company}</p>}
        <h1 className="page-title">{deepDive.title}</h1>
        <div className="blog-post-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {deepDive.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
