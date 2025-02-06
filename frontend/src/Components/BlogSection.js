import React from 'react'
import './BlogSection.css'

const BlogSection = () => {
  return (
    <section className="blog">
      <h2>HOT ARTICLES</h2>
      <div className="article-grid">
        <div className="article-item">
          <img src="path/to/article1.jpg" alt="Article 1" />
          <h3>The Future of AI in Personal Finance</h3>
          <p>Explore how AI is revolutionizing the way we manage our money.</p>
        </div>
        {/* Add more article items */}
      </div>
    </section>
  )
}

export default BlogSection