import type { FeedPost } from "../data/feedPosts"
import type { Page } from "../types"
import { FeedCard } from "./Feed"
import { Header, Icon, MobileNav } from "./Home"

export default function MyPosts({
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
    ? "로그인하면 내가 쓴 글을 볼 수 있어요."
    : posts.length === 0
      ? "아직 쓴 글이 없어요."
      : `총 ${posts.length}개의 고민을 나눴어요.`

  return (
    <div className="candidate-page page-b-white feed-page feed2-page">
      <Header active="myPosts" onNavigate={onNavigate} />
      <main className="feed-main feed2-main">
        <section className="feed-intro">
          <div>
            <span className="section-kicker">MY STORIES</span>
            <h1>내가 쓴 글</h1>
            <p>{description}</p>
          </div>
          <button
            className="primary-button"
            onClick={() => onNavigate("write")}
          >
            <Icon name="pen" size={18} /> 고민 나누기
          </button>
        </section>

        <section className="feed2-list">
          {posts.map((post) => (
            <FeedCard key={post.id} post={post} onSelect={onSelectPost} />
          ))}
        </section>
      </main>
      <MobileNav active="myPosts" onNavigate={onNavigate} />
    </div>
  )
}
