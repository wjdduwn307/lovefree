import { useState, type MouseEvent, type ReactNode } from "react"
import type { FeedPost } from "../data/feedPosts"
import { supabase } from "../lib/supabase"
import { useIsAdmin } from "../lib/useIsAdmin"
import { useSession } from "../lib/useSession"
import LoginModal from "./LoginModal"
import LikeButton from "./LikeButton"
import SaveButton from "./SaveButton"
import SearchOverlay from "./SearchOverlay"
import type { ActivePage, Page } from "../types"

type IconName = "arrow" | "bookmark" | "chat" | "heart" | "home" | "map" | "pen" | "search" | "sparkle" | "user"

export function Icon({
  name,
  size = 20,
  filled = false,
}: {
  name: IconName
  size?: number
  filled?: boolean
}) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    bookmark: (
      <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.8L6 21Z" />
    ),
    chat: (
      <path d="M20 14a4 4 0 0 1-4 4H9l-5 3v-5.5A7 7 0 0 1 3 12V8a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4Z" />
    ),
    heart: (
      <path d="M20.8 5.8a5.4 5.4 0 0 0-7.6 0L12 7l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 22l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z" />
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" />
        <path d="M9 3v15m6-12v15" />
      </>
    ),
    pen: (
      <>
        <path d="m4 20 4.3-1 10.9-11a2.1 2.1 0 0 0-3-3L5.3 16Z" />
        <path d="m14.8 6.6 3 3" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3 1.2 4.2L17 9l-3.8 1.8L12 15l-1.2-4.2L7 9l3.8-1.8Z" />
        <path d="m19 15 .6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6Z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`logo ${inverse ? "logo-inverse" : ""}`}>
      <span className="logo-mark">
        <Icon name="heart" size={17} />
      </span>
      <span>연애해방</span>
    </div>
  )
}

// highlight: 글쓴 해방이처럼 강조할 이름이면 핫핑크로 표시
export function AuthorName({
  admin,
  name,
  highlight = false,
}: {
  admin: boolean
  name: string
  highlight?: boolean
}) {
  if (admin) return <strong className="admin-name">관리자 해방이</strong>
  return <strong className={highlight ? "author-name" : undefined}>{name}</strong>
}

export function Header({
  active = "home",
  onNavigate,
}: {
  active?: ActivePage
  onNavigate?: (page: Page) => void
}) {
  const session = useSession()
  const [showLogin, setShowLogin] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const isAdmin = useIsAdmin()

  // <a href="#..."> 의 기본 동작(주소 변경)을 막고, 화면 전환 함수만 실행
  const go = (page: Page) => (event: MouseEvent) => {
    event.preventDefault()
    onNavigate?.(page)
  }

  return (
    <>
      <header className="site-header">
        <button
          className="logo-button"
          onClick={() => onNavigate?.("home")}
          aria-label="홈으로 이동"
        >
          <Logo />
        </button>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          <a
            className={active === "home" ? "nav-active" : ""}
            href="#feed"
            onClick={go("home")}
          >
            홈
          </a>
          <a
            className={
              active === "feed" || active === "detail" ? "nav-active" : ""
            }
            href="#stories"
            onClick={go("feed")}
          >
            고민 피드
          </a>
          <a href="#places">화해 장소</a>
          <a
            className={active === "reviews" ? "nav-active" : ""}
            href="#reviews"
            onClick={go("reviews")}
          >
            해결 후기
          </a>
        </nav>
        <div className="header-actions">
          <div className="header-search">
            <button
              className="icon-button"
              aria-label="검색"
              onClick={() => setSearchOpen(true)}
            >
              <Icon name="search" />
            </button>
          </div>
          {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
          {session && (
            <button
              className="icon-button"
              aria-label="내 정보"
              onClick={() => onNavigate?.("profile")}
            >
              <Icon name="user" />
            </button>
          )}
          {isAdmin && (
            <button
              className="login-button admin-button"
              onClick={() => onNavigate?.("admin")}
            >
              관리자
            </button>
          )}
          <button
            className="login-button"
            onClick={
              session
                ? () => supabase.auth.signOut()
                : () => setShowLogin(true)
            }
          >
            {session ? "로그아웃" : "로그인"}
          </button>
          <button
            className="primary-button small"
            onClick={() => onNavigate?.("write")}
          >
            <Icon name="pen" size={17} /> 고민 나누기
          </button>
        </div>
      </header>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}

const storyTones = ["coral", "blue", "violet"]

function preview(text: string) {
  const line = text.replace(/\s+/g, " ").trim()
  return line.length > 90 ? `${line.slice(0, 90)}…` : line
}

function StoryCard({
  story,
  compact = false,
  onSelect,
}: {
  story: FeedPost
  compact?: boolean
  onSelect?: (post: { id: number }) => void
}) {
  return (
    <article
      className={`story-card ${compact ? "story-compact" : ""}`}
      tabIndex={0}
      onClick={(event) => {
        // 카드 안의 더 보기, 저장 버튼을 누를 때는 이동하지 않음
        if (!(event.target as HTMLElement).closest("button")) onSelect?.(story)
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" && event.target === event.currentTarget) {
          onSelect?.(story)
        }
      }}
    >
      <div className="story-meta">
        <span className={`avatar avatar-${storyTones[story.id % storyTones.length]}`}>
          해
        </span>
        <div>
          <AuthorName admin={story.isAdminAuthor} name="익명의 해방이" />
          <span>
            <b>{story.category}</b> · {story.time}
          </span>
        </div>
        <button className="more-button" aria-label="더 보기">
          •••
        </button>
      </div>
      <h3>{story.title}</h3>
      <p>{preview(story.body)}</p>
      <div className="story-stats">
        <LikeButton post={story} className="like-button" />
        <span>
          <Icon name="chat" size={17} /> {story.comments}
        </span>
        <SaveButton post={story} />
      </div>
    </article>
  )
}

const places = [
  {
    name: "마음정원",
    kind: "조용한 카페",
    distance: "320m",
    color: "place-pink",
    icon: "☕",
  },
  {
    name: "노을 산책길",
    kind: "대화하기 좋은 공원",
    distance: "680m",
    color: "place-blue",
    icon: "♧",
  },
]

export function MobileNav({
  active = "home",
  onNavigate,
}: {
  active?: ActivePage
  onNavigate?: (page: Page) => void
}) {
  const go = (page: Page) => (event: MouseEvent) => {
    event.preventDefault()
    onNavigate?.(page)
  }

  return (
    <nav className="mobile-nav" aria-label="모바일 메뉴">
      <a
        className={active === "home" ? "active" : ""}
        href="#feed"
        onClick={go("home")}
      >
        <Icon name="home" />
        <span>홈</span>
      </a>
      <a
        className={active === "feed" || active === "detail" ? "active" : ""}
        href="#stories"
        onClick={go("feed")}
      >
        <Icon name="chat" />
        <span>고민</span>
      </a>
      <button
        className={active === "write" ? "active" : ""}
        aria-label="글쓰기"
        onClick={() => onNavigate?.("write")}
      >
        <Icon name="pen" />
      </button>
      <a href="#places">
        <Icon name="map" />
        <span>장소</span>
      </a>
      <a
        className={active === "profile" ? "active" : ""}
        href="#profile"
        onClick={go("profile")}
      >
        <Icon name="user" />
        <span>내 정보</span>
      </a>
    </nav>
  )
}

export default function Home({
  posts,
  onNavigate,
  onSelectReview,
  onSelectPost,
}: {
  posts: FeedPost[]
  onNavigate?: (page: Page) => void
  onSelectReview?: (post: { id: number }) => void
  onSelectPost?: (post: { id: number }) => void
}) {
  const resolvedPosts = posts.filter((post) => post.resolution).slice(0, 3)

  return (
    <div className="candidate-page page-b page-b-white">
      <Header onNavigate={onNavigate} />
      <main>
        <section className="hero-b">
          <div className="soft-shape shape-one" />
          <div className="soft-shape shape-two" />
          <div className="hero-b-copy">
            <span className="eyebrow">LOVE, LIBERATED</span>
            <h1>
              우리의 사랑이
              <br />
              다시 <em>말랑해지도록.</em>
            </h1>
            <p>
              서툰 마음도 괜찮아요. 다른 시선과 따뜻한 대화로
              <br className="desktop-only" /> 우리만의 답을 함께 찾아가요.
            </p>
            <button
              className="primary-button"
              onClick={() => onNavigate?.("write")}
            >
              내 고민부터 꺼내보기 <Icon name="arrow" />
            </button>
          </div>
          <div className="hero-b-proof">
            <span className="mini-heart">
              <Icon name="heart" size={22} />
            </span>
            <div>
              <strong>1,204개의 마음</strong>
              <p>오늘도 따뜻한 답을 만났어요</p>
            </div>
          </div>
        </section>

        <section className="b-content-section" id="feed">
          <div className="b-feed-column">
            <div className="section-heading">
              <div>
                <span className="section-kicker">REAL STORIES</span>
                <h2>지금 나누는 고민</h2>
              </div>
              <button
                className="text-button"
                onClick={() => onNavigate?.("feed")}
              >
                전체 보기 <Icon name="arrow" size={18} />
              </button>
            </div>
            <div className="b-story-list">
              {posts.slice(0, 2).map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  compact
                  onSelect={onSelectPost}
                />
              ))}
            </div>
          </div>

          <aside className="b-place-column" id="places">
            <div className="b-place-heading">
              <div>
                <span className="section-kicker">MAKE PEACE, NEARBY</span>
                <h2>
                  우리 가까이,
                  <br />
                  대화하기 좋은 곳
                </h2>
              </div>
              <span className="location-pill">
                <Icon name="map" size={13} /> 성수동
              </span>
            </div>
            <div className="b-map">
              <div className="map-grid" />
              <span className="b-map-pin main-pin">
                <Icon name="heart" size={18} />
              </span>
              <span className="b-map-pin sub-pin">
                <Icon name="map" size={16} />
              </span>
              <div className="map-place-card">
                <span className="place-thumb place-pink">☕</span>
                <div>
                  <strong>마음정원</strong>
                  <span>조용한 대화가 필요한 날 · 320m</span>
                </div>
              </div>
            </div>
            <div className="b-place-list">
              {places.map((place, index) => (
                <div className="b-place-item" key={place.name}>
                  <span className="place-rank">0{index + 1}</span>
                  <div>
                    <strong>{place.name}</strong>
                    <span>{place.kind}</span>
                  </div>
                  <b>{place.distance}</b>
                  <Icon name="arrow" size={16} />
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="resolved-feed" id="reviews">
          <div className="section-heading">
            <div>
              <span className="section-kicker">AFTER THE STORY</span>
              <h2>해결 후기 모아보기</h2>
              <p>고민을 나눈 뒤, 관계가 달라진 이야기를 만나보세요.</p>
            </div>
            <button
              className="text-button"
              onClick={() => onNavigate?.("reviews")}
            >
              후기 전체 보기 <Icon name="arrow" size={18} />
            </button>
          </div>
          <div className="resolved-grid">
            {resolvedPosts.map((post) => (
              <button
                className="resolved-card"
                key={post.id}
                onClick={() => onSelectReview?.(post)}
              >
                <div className="resolved-origin">
                  <span>{post.category}</span>
                  <p>
                    <b>이전 고민</b>
                    {post.title}
                  </p>
                </div>
                <div className="resolved-body">
                  <span className="resolved-badge">
                    <Icon name="sparkle" size={14} /> 해결했어요
                  </span>
                  <h3>{post.resolution?.title}</h3>
                  <p>{preview(post.resolution?.body ?? "")}</p>
                </div>
                <div className="resolved-stats">
                  <span>
                    <Icon name="heart" size={16} /> 도움됐어요 {post.likes}
                  </span>
                  <span>
                    <Icon name="chat" size={16} /> {post.comments}
                  </span>
                  <Icon name="arrow" size={17} />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="b-journey-strip">
          <span>
            <b>01</b>
            <Icon name="pen" size={19} /> 고민을 나누고
          </span>
          <Icon name="arrow" size={17} />
          <span>
            <b>02</b>
            <Icon name="chat" size={19} /> 다른 시선을 만나고
          </span>
          <Icon name="arrow" size={17} />
          <span>
            <b>03</b>
            <Icon name="map" size={19} /> 우리답게 화해해요
          </span>
        </section>
      </main>
      <MobileNav onNavigate={onNavigate} />
    </div>
  )
}
