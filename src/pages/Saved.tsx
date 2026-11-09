import type { Page } from "../types"
import { Header, MobileNav } from "./Home"

// 임시 화면. 저장 기능과 Figma 디자인이 준비되면 교체
export default function Saved({
  onNavigate,
}: {
  onNavigate: (page: Page) => void
}) {
  return (
    <div className="candidate-page page-b-white feed-page">
      <Header active="saved" onNavigate={onNavigate} />
      <main className="feed-main">
        <section className="feed-intro">
          <div>
            <span className="section-kicker">SAVED</span>
            <h1>저장 목록</h1>
            <p>아직 저장한 글이 없어요.</p>
          </div>
        </section>
      </main>
      <MobileNav active="saved" onNavigate={onNavigate} />
    </div>
  )
}
