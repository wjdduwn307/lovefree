import { useState } from "react"
import { useRevalidator } from "react-router"
import {
  hideTerm,
  restoreTerm,
  saveTerm,
  type AdminTerm,
} from "../data/hotTopics"
import type { Page } from "../types"
import { Header, MobileNav } from "./Home"

function failureMessage(error: unknown) {
  return (error as { code?: string }).code === "23505"
    ? "이미 다른 검색어가 고정된 순위예요."
    : "처리하지 못했어요. 잠시 후 다시 시도해주세요."
}

function TermRow({ item }: { item: AdminTerm }) {
  const revalidator = useRevalidator()
  const [label, setLabel] = useState(item.label ?? "")
  const [pin, setPin] = useState(item.pinnedRank ? String(item.pinnedRank) : "")
  const [busy, setBusy] = useState(false)

  async function run(action: () => Promise<void>) {
    setBusy(true)
    try {
      await action()
      await revalidator.revalidate()
    } catch (error) {
      window.alert(failureMessage(error))
    } finally {
      setBusy(false)
    }
  }

  function remove() {
    if (!window.confirm(`‘${item.term}’을(를) 순위에서 삭제할까요?`)) return
    void run(() => hideTerm(item.term))
  }

  if (item.hidden) {
    return (
      <div className="admin-term-row is-hidden" data-term={item.term}>
        <b>삭제됨</b>
        <div>
          <strong>{item.term}</strong>
          <small>최근 7일 {item.searchCount}회 검색</small>
        </div>
        <button
          className="admin-action"
          disabled={busy}
          onClick={() => void run(() => restoreTerm(item.term))}
        >
          복구
        </button>
      </div>
    )
  }

  return (
    <div className="admin-term-row" data-term={item.term}>
      <b>
        {item.currentRank
          ? String(item.currentRank).padStart(2, "0")
          : "-"}
      </b>
      <div>
        <strong>{item.term}</strong>
        <small>최근 7일 {item.searchCount}회 검색</small>
      </div>
      <input
        aria-label={`${item.term} 표시 이름`}
        maxLength={20}
        placeholder="표시 이름"
        value={label}
        onChange={(event) => setLabel(event.target.value)}
      />
      <select
        aria-label={`${item.term} 고정 순위`}
        value={pin}
        onChange={(event) => setPin(event.target.value)}
      >
        <option value="">자동</option>
        {[1, 2, 3, 4, 5].map((rank) => (
          <option key={rank} value={rank}>
            {rank}위 고정
          </option>
        ))}
      </select>
      <button
        className="admin-action"
        disabled={busy}
        onClick={() =>
          void run(() => saveTerm(item.term, label, pin ? Number(pin) : null))
        }
      >
        저장
      </button>
      <button className="admin-action danger" disabled={busy} onClick={remove}>
        삭제
      </button>
    </div>
  )
}

export default function Admin({
  terms,
  onNavigate,
}: {
  terms: AdminTerm[]
  onNavigate: (page: Page) => void
}) {
  return (
    <div className="candidate-page page-b-white feed-page">
      <Header active="admin" onNavigate={onNavigate} />
      <main className="feed-main">
        <section className="feed-intro">
          <div>
            <span className="section-kicker">ADMIN</span>
            <h1>지금 Hot한 주제 관리</h1>
            <p>삭제한 검색어는 복구하기 전까지 순위에 다시 나오지 않아요.</p>
          </div>
        </section>

        <section className="admin-term-list">
          {terms.map((item) => (
            <TermRow
              key={`${item.term}:${item.label}:${item.pinnedRank}:${item.hidden}`}
              item={item}
            />
          ))}
        </section>
      </main>
      <MobileNav active="admin" onNavigate={onNavigate} />
    </div>
  )
}
