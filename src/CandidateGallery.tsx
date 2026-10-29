import { useState, type ReactNode } from "react";

type IconName =
  | "arrow"
  | "bookmark"
  | "chat"
  | "heart"
  | "home"
  | "map"
  | "pen"
  | "search"
  | "sparkle"
  | "user";

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    bookmark: <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.8L6 21Z" />,
    chat: <path d="M20 14a4 4 0 0 1-4 4H9l-5 3v-5.5A7 7 0 0 1 3 12V8a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4Z" />,
    heart: <path d="M20.8 5.8a5.4 5.4 0 0 0-7.6 0L12 7l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 22l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z" />,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" /><path d="M9 3v15m6-12v15" /></>,
    pen: <><path d="m4 20 4.3-1 10.9-11a2.1 2.1 0 0 0-3-3L5.3 16Z" /><path d="m14.8 6.6 3 3" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    sparkle: <><path d="m12 3 1.2 4.2L17 9l-3.8 1.8L12 15l-1.2-4.2L7 9l3.8-1.8Z" /><path d="m19 15 .6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6Z" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`logo ${inverse ? "logo-inverse" : ""}`}>
      <span className="logo-mark"><Icon name="heart" size={17} /></span>
      <span>연애해방</span>
    </div>
  );
}

export function Header({ dark = false }: { dark?: boolean }) {
  return (
    <header className={`site-header ${dark ? "header-dark" : ""}`}>
      <Logo inverse={dark} />
      <nav className="desktop-nav" aria-label="주요 메뉴">
        <a className="nav-active" href="#feed">홈</a>
        <a href="#stories">고민 피드</a>
        <a href="#places">화해 장소</a>
        <a href="#reviews">해결 후기</a>
      </nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="검색"><Icon name="search" /></button>
        <button className="login-button">로그인</button>
        <button className="primary-button small"><Icon name="pen" size={17} /> 고민 나누기</button>
      </div>
    </header>
  );
}

export const stories = [
  {
    category: "연락 문제",
    time: "12분 전",
    title: "연락 텀이 길어진 남자친구, 제가 예민한 걸까요?",
    text: "예전에는 바빠도 한두 시간 안에는 답이 왔는데 요즘은 반나절씩 소식이 없어요. 서운하다고 말하면 부담스러워할까 봐 고민돼요.",
    comments: 28,
    likes: 46,
    avatar: "민",
    tone: "coral",
  },
  {
    category: "데이트",
    time: "34분 전",
    title: "기념일을 자꾸 잊는 연인과 어떻게 대화할까요?",
    text: "날짜 자체보다 나만 우리 관계를 중요하게 생각하는 것 같은 기분이 들어요. 싸우지 않고 제 마음을 잘 전하고 싶어요.",
    comments: 19,
    likes: 31,
    avatar: "수",
    tone: "blue",
  },
  {
    category: "가치관",
    time: "1시간 전",
    title: "서로 다른 소비 습관, 맞춰갈 수 있을까요?",
    text: "저는 미래를 위해 저축하는 편이고 연인은 지금의 행복이 더 중요하대요. 함께 정할 수 있는 기준이 필요해요.",
    comments: 36,
    likes: 52,
    avatar: "지",
    tone: "violet",
  },
];

export const resolvedStories = [
  {
    topic: "연락 문제",
    before: "연락 텀이 길어진 남자친구, 제가 예민한 걸까요?",
    title: "답장 시간보다 서로의 하루를 묻기로 했어요",
    text: "댓글에서 알려준 대화법으로 서운함 대신 제가 바라는 걸 솔직히 말했어요. 매일 짧게라도 서로의 하루를 나누기로 했습니다.",
    likes: 127,
    comments: 18,
  },
  {
    topic: "데이트",
    before: "기념일을 자꾸 잊는 연인과 어떻게 대화할까요?",
    title: "기념일보다 중요한 마음을 확인했어요",
    text: "함께 기억하고 싶은 날을 캘린더에 직접 정했어요. 서운함을 참는 대신 차분히 설명하니 연인도 제 마음을 이해해 줬어요.",
    likes: 94,
    comments: 12,
  },
  {
    topic: "가치관",
    before: "서로 다른 소비 습관, 맞춰갈 수 있을까요?",
    title: "우리 둘만의 소비 기준이 생겼어요",
    text: "각자의 방식을 틀렸다고 말하지 않고 공동 목표부터 정했습니다. 한 달에 한 번 함께 점검하면서 맞춰가기로 했어요.",
    likes: 81,
    comments: 9,
  },
];

export function StoryCard({ story = stories[0], compact = false }: { story?: typeof stories[number]; compact?: boolean }) {
  return (
    <article className={`story-card ${compact ? "story-compact" : ""}`}>
      <div className="story-meta">
        <span className={`avatar avatar-${story.tone}`}>{story.avatar}</span>
        <div>
          <strong>익명의 해방이</strong>
          <span><b>{story.category}</b> · {story.time}</span>
        </div>
        <button className="more-button" aria-label="더 보기">•••</button>
      </div>
      <h3>{story.title}</h3>
      <p>{story.text}</p>
      <div className="story-stats">
        <span><Icon name="heart" size={17} /> {story.likes}</span>
        <span><Icon name="chat" size={17} /> {story.comments}</span>
        <button aria-label="저장"><Icon name="bookmark" size={18} /></button>
      </div>
    </article>
  );
}

function CandidateA() {
  return (
    <div className="candidate-page page-a">
      <Header />
      <main>
        <section className="hero-a">
          <div className="hero-copy">
            <span className="eyebrow"><Icon name="sparkle" size={16} /> 우리 사이, 다시 가까워지는 곳</span>
            <h1>사랑이 어려운 순간,<br /><em>혼자 고민하지 마세요</em></h1>
            <p>비슷한 고민을 지나온 사람들의 진짜 이야기와<br className="desktop-only" /> 따뜻한 조언으로 관계의 답을 찾아보세요.</p>
            <div className="hero-buttons">
              <button className="primary-button">고민 나누기 <Icon name="arrow" /></button>
              <button className="ghost-button">해결 후기 둘러보기</button>
            </div>
            <div className="trust-row">
              <div className="avatar-stack"><span>유</span><span>민</span><span>해</span><span>연</span></div>
              <p><strong>2,814명</strong>이 함께 고민을 나누고 있어요</p>
            </div>
          </div>
          <div className="hero-visual" aria-label="커뮤니티 대화 예시">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="floating-tag tag-one">나만 이런 걸까?</div>
            <div className="floating-tag tag-two">진심을 말해봐요</div>
            <div className="phone-card">
              <div className="phone-top"><span>오늘의 고민</span><Icon name="heart" size={18} /></div>
              <div className="phone-illustration">
                <span className="person person-left">A</span>
                <span className="heart-line">♡</span>
                <span className="person person-right">B</span>
              </div>
              <h3>먼저 사과하는 게<br />지는 것 같아요</h3>
              <div className="advice-bubble">“마음을 전하는 건<br />지는 게 아니에요.”</div>
              <div className="phone-stats"><span>공감 127</span><span>댓글 42</span></div>
            </div>
          </div>
        </section>

        <section className="feed-section" id="feed">
          <div className="section-heading">
            <div><span className="section-kicker">REAL STORIES</span><h2>지금 나누는 고민들</h2></div>
            <button className="text-button">전체 보기 <Icon name="arrow" size={18} /></button>
          </div>
          <div className="story-grid">{stories.map((story) => <StoryCard key={story.title} story={story} />)}</div>
        </section>
      </main>
      <MobileNav />
    </div>
  );
}

export function CandidateB({ white = false }: { white?: boolean }) {
  return (
    <div className={`candidate-page page-b ${white ? "page-b-white" : ""}`}>
      <Header />
      <main>
        <section className="hero-b">
          <div className="soft-shape shape-one" />
          <div className="soft-shape shape-two" />
          <div className="hero-b-copy">
            <span className="eyebrow">LOVE, LIBERATED</span>
            <h1>우리의 사랑이<br />다시 <em>말랑해지도록.</em></h1>
            <p>서툰 마음도 괜찮아요. 다른 시선과 따뜻한 대화로<br className="desktop-only" /> 우리만의 답을 함께 찾아가요.</p>
            <button className="primary-button">내 고민부터 꺼내보기 <Icon name="arrow" /></button>
          </div>
          <div className="hero-b-proof">
            <span className="mini-heart"><Icon name="heart" size={22} /></span>
            <div><strong>1,204개의 마음</strong><p>오늘도 따뜻한 답을 만났어요</p></div>
          </div>
        </section>

        <section className="b-content-section" id="feed">
          <div className="b-feed-column">
            <div className="section-heading">
              <div><span className="section-kicker">REAL STORIES</span><h2>지금 나누는 고민</h2></div>
              <button className="text-button">전체 보기 <Icon name="arrow" size={18} /></button>
            </div>
            <div className="b-story-list">
              {stories.slice(0, 2).map((story) => (
                <StoryCard key={story.title} story={story} compact />
              ))}
            </div>
          </div>

          <aside className="b-place-column" id="places">
            <div className="b-place-heading">
              <div><span className="section-kicker">MAKE PEACE, NEARBY</span><h2>우리 가까이,<br />대화하기 좋은 곳</h2></div>
              <span className="location-pill"><Icon name="map" size={13} /> 성수동</span>
            </div>
            <div className="b-map">
              <div className="map-grid" />
              <span className="b-map-pin main-pin"><Icon name="heart" size={18} /></span>
              <span className="b-map-pin sub-pin"><Icon name="map" size={16} /></span>
              <div className="map-place-card">
                <span className="place-thumb place-pink">☕</span>
                <div><strong>마음정원</strong><span>조용한 대화가 필요한 날 · 320m</span></div>
              </div>
            </div>
            <div className="b-place-list">
              {places.map((place, index) => (
                <div className="b-place-item" key={place.name}>
                  <span className="place-rank">0{index + 1}</span>
                  <div><strong>{place.name}</strong><span>{place.kind}</span></div>
                  <b>{place.distance}</b><Icon name="arrow" size={16} />
                </div>
              ))}
            </div>
            {!white && (
              <div className="b-success-note">
                <Icon name="sparkle" size={19} />
                <p><strong>“천천히 산책하며 말하니 진심이 보였어요.”</strong><span>도움이 된 해결 후기 286</span></p>
                <Icon name="arrow" size={18} />
              </div>
            )}
          </aside>
        </section>

        {white && (
          <section className="resolved-feed" id="reviews">
            <div className="section-heading">
              <div><span className="section-kicker">AFTER THE STORY</span><h2>해결 후기 모아보기</h2><p>고민을 나눈 뒤, 관계가 달라진 이야기를 만나보세요.</p></div>
              <button className="text-button">후기 전체 보기 <Icon name="arrow" size={18} /></button>
            </div>
            <div className="resolved-grid">
              {resolvedStories.map((review) => (
                <article className="resolved-card" key={review.title}>
                  <div className="resolved-origin">
                    <span>{review.topic}</span>
                    <p><b>이전 고민</b>{review.before}</p>
                  </div>
                  <div className="resolved-body">
                    <span className="resolved-badge"><Icon name="sparkle" size={14} /> 해결했어요</span>
                    <h3>{review.title}</h3>
                    <p>{review.text}</p>
                  </div>
                  <div className="resolved-stats">
                    <span><Icon name="heart" size={16} /> 도움됐어요 {review.likes}</span>
                    <span><Icon name="chat" size={16} /> {review.comments}</span>
                    <Icon name="arrow" size={17} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="b-journey-strip">
          <span><b>01</b><Icon name="pen" size={19} /> 고민을 나누고</span>
          <Icon name="arrow" size={17} />
          <span><b>02</b><Icon name="chat" size={19} /> 다른 시선을 만나고</span>
          <Icon name="arrow" size={17} />
          <span><b>03</b><Icon name="map" size={19} /> 우리답게 화해해요</span>
        </section>
      </main>
      <MobileNav />
    </div>
  );
}

export const places = [
  { name: "마음정원", kind: "조용한 카페", distance: "320m", color: "place-pink", icon: "☕" },
  { name: "노을 산책길", kind: "대화하기 좋은 공원", distance: "680m", color: "place-blue", icon: "♧" },
];

function CandidateC() {
  return (
    <div className="candidate-page page-c">
      <Header dark />
      <main className="dashboard">
        <section className="dashboard-intro">
          <div>
            <span className="eyebrow">오늘도 마음은 맑아질 거예요</span>
            <h1>어떤 고민을<br />안고 왔나요?</h1>
          </div>
          <div className="quick-write">
            <div className="quick-avatar"><Icon name="user" /></div>
            <button><span>지금 마음을 익명으로 들려주세요</span><b><Icon name="pen" size={18} /> 글쓰기</b></button>
            <div className="topic-chips"><span># 연락</span><span># 권태기</span><span># 가치관</span><span># 장거리</span></div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="main-feed">
            <div className="section-heading compact-heading">
              <div><span className="live-dot" /> <h2>지금 뜨는 고민</h2></div>
              <button className="text-button">더 보기 <Icon name="arrow" size={17} /></button>
            </div>
            <div className="stacked-stories">
              {stories.slice(0, 2).map((story, index) => (
                <StoryCard key={story.title} story={{ ...story, text: index === 0 ? story.text : story.text.slice(0, 58) + "…" }} compact />
              ))}
            </div>
          </div>

          <aside className="side-column">
            <div className="place-panel" id="places">
              <div className="panel-heading"><div><span>NEAR YOU</span><h2>가까운 화해 장소</h2></div><span className="location-pill">성수동</span></div>
              <div className="mini-map">
                <div className="street s-one" /><div className="street s-two" /><div className="street s-three" />
                <span className="map-pin pin-one"><Icon name="heart" size={15} /></span>
                <span className="map-pin pin-two"><Icon name="map" size={15} /></span>
                <span className="you-pin">나</span>
              </div>
              <div className="place-list">
                {places.map((place) => (
                  <div className="place-item" key={place.name}>
                    <span className={`place-thumb ${place.color}`}>{place.icon}</span>
                    <div><strong>{place.name}</strong><span>{place.kind}</span></div>
                    <b>{place.distance}</b>
                  </div>
                ))}
              </div>
            </div>
            <div className="success-panel">
              <div><span className="success-label">이번 주 해결 후기</span><h3>“말하지 않으면<br />절대 모르는 마음도 있어요.”</h3></div>
              <span className="success-count"><Icon name="heart" size={18} /> 286명에게 도움이 됐어요</span>
            </div>
          </aside>
        </section>
      </main>
      <MobileNav dark />
    </div>
  );
}

export function MobileNav({ dark = false }: { dark?: boolean }) {
  return (
    <nav className={`mobile-nav ${dark ? "mobile-nav-dark" : ""}`} aria-label="모바일 메뉴">
      <a className="active" href="#feed"><Icon name="home" /><span>홈</span></a>
      <a href="#stories"><Icon name="chat" /><span>고민</span></a>
      <button aria-label="글쓰기"><Icon name="pen" /></button>
      <a href="#places"><Icon name="map" /><span>장소</span></a>
      <a href="#profile"><Icon name="user" /><span>내 정보</span></a>
    </nav>
  );
}

const candidateInfo = [
  { id: 0, label: "시안 A", title: "다정한 커뮤니티", desc: "콘텐츠 피드 중심", className: "thumb-a" },
  { id: 1, label: "시안 B", title: "감성과 해결", desc: "브랜드 + 피드·장소", className: "thumb-b" },
  { id: 2, label: "시안 C", title: "실용적인 해결", desc: "피드와 장소 중심", className: "thumb-c" },
  { id: 3, label: "시안 B-2", title: "화이트 에디션", desc: "시안 B · 화이트 테마", className: "thumb-b-white" },
];

export default function App() {
  const [candidate, setCandidate] = useState(0);
  const pages = [<CandidateA />, <CandidateB />, <CandidateC />, <CandidateB white />];

  return (
    <div className="app-shell">
      <section className="concept-switcher">
        <div className="switcher-heading">
          <div><span>MAIN PAGE CONCEPTS</span><h2>연애해방 메인화면 후보</h2></div>
          <p>카드를 눌러 세 가지 디자인 방향을 비교해 보세요.</p>
        </div>
        <div className="concept-list">
          {candidateInfo.map((item) => (
            <button
              className={`concept-card ${candidate === item.id ? "selected" : ""}`}
              key={item.id}
              onClick={() => setCandidate(item.id)}
              aria-pressed={candidate === item.id}
            >
              <span className={`concept-thumb ${item.className}`}>
                <i /><i /><i />
              </span>
              <span className="concept-copy"><b>{item.label} · {item.title}</b><small>{item.desc}</small></span>
              <span className="selection-check">✓</span>
            </button>
          ))}
        </div>
      </section>
      <div className="preview-label"><span>LIVE PREVIEW</span><b>{candidateInfo[candidate].label}</b></div>
      {pages[candidate]}
    </div>
  );
}
