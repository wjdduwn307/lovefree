import {
  Header,
  Icon,
  MobileNav,
  StoryCard,
  places,
  resolvedStories,
  stories,
} from "./CandidateGallery";

export default function B2Final() {
  return (
    <div className="candidate-page page-b page-b-white">
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
          </aside>
        </section>

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
