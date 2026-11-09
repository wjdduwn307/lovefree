import { feedPosts, type FeedPost } from "../data/feedPosts"
import type { Page } from "../types"
import { Header, Icon, MobileNav } from "./Home"

export default function Reviews2({
  onNavigate,
  onSelectPost,
}: {
  onNavigate: (page: Page) => void
  onSelectPost: (post: FeedPost) => void
}) {
  const resolvedPosts = feedPosts.filter((post) => post.resolution)

  return (
    <div className="candidate-page page-b-white reviews-alt-page">
      <Header active="reviews" onNavigate={onNavigate} />
      <main className="reviews-alt-main">
        <section className="reviews-alt-hero">
          <div>
            <span className="section-kicker">LOVE, AFTERWARDS</span>
            <h1>
              그 후, 우리의 마음은
              <br />
              <em>조금 달라졌어요.</em>
            </h1>
            <p>고민의 정답보다 서로를 이해하게 된 순간을 모았습니다.</p>
          </div>
        </section>

        <section className="reviews-alt-grid">
          {resolvedPosts.map((post) => (
            <button
              className="reviews-alt-card"
              key={post.id}
              onClick={() => onSelectPost(post)}
            >
              <div className="reviews-alt-card-top">
                <span>{post.category}</span>
                <time>{post.resolution?.time}</time>
              </div>
              <span className="reviews-alt-mark">
                <Icon name="sparkle" size={18} />
              </span>
              <h2>{post.resolution?.title}</h2>
              <p>{post.resolution?.body.split("\n")[0]}</p>
              <div className="reviews-alt-origin">
                <span>처음 나눈 고민</span>
                <strong>{post.title}</strong>
              </div>
              <div className="reviews-alt-footer">
                <span>
                  <Icon name="heart" size={15} /> 도움됐어요 {post.likes}
                </span>
                <span>
                  이야기 읽기 <Icon name="arrow" size={16} />
                </span>
              </div>
            </button>
          ))}
        </section>
      </main>
      <MobileNav active="reviews" onNavigate={onNavigate} />
    </div>
  )
}
