import type { FeedPost } from "../data/feedPosts"
import type { Page } from "../types"
import { FeedCard } from "./Feed"
import { Header, MobileNav } from "./Home"

export default function Saved({
  posts,
  signedIn,
  onNavigate,
  onSelectPost,
}: {
  posts: FeedPost[]
  signedIn: boolean
  onNavigate: (page: Page) => void
  onSelectPost: (post: FeedPost) => void
}) {
  const description = !signedIn
    ? "로그인하면 저장한 글을 볼 수 있어요."
    : posts.length === 0
      ? "아직 저장한 글이 없어요. 마음에 남는 글의 저장 버튼을 눌러보세요."
      : `총 ${posts.length}개의 글을 저장했어요.`

  return (
    <div className="candidate-page page-b-white feed-page feed2-page">
      <Header active="saved" onNavigate={onNavigate} />
      <main className="feed-main feed2-main">
        <section className="feed-intro">
          <div>
            <span className="section-kicker">SAVED</span>
            <h1>저장 목록</h1>
            <p>{description}</p>
          </div>
        </section>

        <section className="feed2-list">
          {posts.map((post) => (
            <FeedCard key={post.id} post={post} onSelect={onSelectPost} />
          ))}
        </section>
      </main>
      <MobileNav active="saved" onNavigate={onNavigate} />
    </div>
  )
}
