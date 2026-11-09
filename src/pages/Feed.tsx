import { useState } from "react"
import type { FeedPost } from "../data/feedPosts"
import type { Page } from "../types"
import { Header, Icon, MobileNav } from "./Home"

const categories = ["전체", "연락 문제", "데이트", "가치관", "권태기", "장거리"]

export function FeedCard({
  post,
  onSelect,
}: {
  post: FeedPost
  onSelect: (post: FeedPost) => void
}) {
  return (
    <button className="feed2-card" onClick={() => onSelect(post)}>
      <span
        className={`feed-mini-avatar feed2-avatar feed-avatar-${(post.id % 4) + 1}`}
      >
        <Icon name="heart" size={17} />
      </span>
      <div className="feed2-card-content">
        <div className="feed2-meta">
          <strong>익명의 해방이</strong>
          <i />
          <time>{post.time}</time>
          <span>{post.category}</span>
          {post.resolution && <b className="resolved-status">해결완료</b>}
        </div>
        <h2>{post.title}</h2>
        <p>{post.body.split("\n")[0]}</p>
        <div className="feed2-stats">
          <span>
            <Icon name="heart" size={16} /> {post.likes}
          </span>
          <span>
            <Icon name="chat" size={16} /> 댓글 {post.comments}
          </span>
        </div>
      </div>
      <Icon name="arrow" size={19} />
    </button>
  )
}

export default function Feed({
  posts,
  onNavigate,
  onSelectPost,
}: {
  posts: FeedPost[]
  onNavigate: (page: Page) => void
  onSelectPost: (post: FeedPost) => void
}) {
  const [category, setCategory] = useState("전체")
  const [currentOnly, setCurrentOnly] = useState(false)
  const visiblePosts = posts.filter(
    (post) =>
      (category === "전체" || post.category === category) &&
      (!currentOnly || !post.resolution),
  )

  return (
    <div className="candidate-page page-b-white feed-page feed2-page">
      <Header active="feed" onNavigate={onNavigate} />
      <main className="feed-main feed2-main">
        <section className="feed-intro">
          <div>
            <span className="section-kicker">REAL STORIES</span>
            <h1>지금 나누는 고민</h1>
            <p>
              최신 고민부터, 후기가 도착한 이야기까지 시간순으로 만나보세요.
            </p>
          </div>
          <button
            className="primary-button"
            onClick={() => onNavigate("write")}
          >
            <Icon name="pen" size={18} /> 고민 나누기
          </button>
        </section>

        <div className="feed-toolbar">
          <div className="feed-categories" aria-label="고민 카테고리">
            {categories.map((item) => (
              <button
                className={category === item ? "selected" : ""}
                key={item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="feed-filter-toggle">
            <span>현재 고민만 보기</span>
            <input
              type="checkbox"
              checked={currentOnly}
              onChange={(event) => setCurrentOnly(event.target.checked)}
            />
            <i />
          </label>
        </div>
        <p className="feed-result-count">총 {visiblePosts.length}개의 고민</p>

        <section className="feed2-list">
          {visiblePosts.map((post) => (
            <FeedCard key={post.id} post={post} onSelect={onSelectPost} />
          ))}
        </section>
      </main>
      <MobileNav active="feed" onNavigate={onNavigate} />
    </div>
  )
}
