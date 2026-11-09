import type { FeedPost } from "../data/feedPosts"
import type { Page } from "../types"
import { FeedCard } from "./Feed"
import { Header, MobileNav } from "./Home"

export default function Search({
  query,
  posts,
  onNavigate,
  onSelectPost,
}: {
  query: string
  posts: FeedPost[]
  onNavigate: (page: Page) => void
  onSelectPost: (post: FeedPost) => void
}) {
  return (
    <div className="candidate-page page-b-white feed-page feed2-page">
      <Header active="search" onNavigate={onNavigate} />
      <main className="feed-main feed2-main">
        <section className="feed-intro">
          <div>
            <span className="section-kicker">SEARCH</span>
            <h1>‘{query}’ 검색 결과</h1>
            <p>
              {posts.length > 0
                ? `총 ${posts.length}개의 이야기를 찾았어요.`
                : "찾는 이야기가 없어요. 다른 단어로 검색해보세요."}
            </p>
          </div>
        </section>

        <section className="feed2-list">
          {posts.map((post) => (
            <FeedCard key={post.id} post={post} onSelect={onSelectPost} />
          ))}
        </section>
      </main>
      <MobileNav active="search" onNavigate={onNavigate} />
    </div>
  )
}
