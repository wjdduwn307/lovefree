import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { fetchHotTopics, type HotTopic } from "../data/hotTopics"
import { Icon } from "./Home"

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [text, setText] = useState("")
  const [topics, setTopics] = useState<HotTopic[]>([])

  useEffect(() => {
    let active = true
    fetchHotTopics()
      .then((items) => {
        if (active) setTopics(items)
      })
      .catch(() => {
        // 순위를 못 불러와도 검색은 할 수 있음
      })
    return () => {
      active = false
    }
  }, [])

  // 검색창이 열린 동안 뒤 화면이 스크롤되지 않게 함
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  function submit(event: FormEvent) {
    event.preventDefault()
    const query = text.trim()
    if (!query) return
    onClose()
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  function openTopic(topic: HotTopic) {
    onClose()
    navigate(`/search?q=${encodeURIComponent(topic.term)}&hot=1`)
  }

  return (
    <div
      className="search-overlay"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose()
      }}
    >
      <div className="search-panel">
        <form className="search-box" role="search" onSubmit={submit}>
          <input
            autoFocus
            aria-label="게시글과 후기 검색"
            maxLength={50}
            placeholder="고민이나 후기를 검색해보세요"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <button type="submit" aria-label="검색 실행">
            <Icon name="search" size={30} />
          </button>
        </form>

        {topics.length > 0 && (
          <section className="hot-topics">
            <h2>지금 Hot한 주제</h2>
            <ol>
              {topics.map((topic) => (
                <li key={topic.term}>
                  <button
                    className={topic.rank <= 3 ? "is-top" : ""}
                    style={{ animationDelay: `${topic.rank * 45}ms` }}
                    onClick={() => openTopic(topic)}
                  >
                    <b>{String(topic.rank).padStart(2, "0")}</b>
                    <span>{topic.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  )
}
