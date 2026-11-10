import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import {
  createResolution,
  updateResolution,
  type FeedPost,
} from "../data/feedPosts"
import { useIsAdmin } from "../lib/useIsAdmin"
import type { Page } from "../types"
import { AuthorName, Header, Icon, MobileNav } from "./Home"

const CHANGE_FIELDS = 3

export default function WriteReview({
  post,
  onNavigate,
}: {
  post: FeedPost
  onNavigate: (page: Page) => void
}) {
  const navigate = useNavigate()
  const isAdmin = useIsAdmin()
  const existing = post.resolution
  const [title, setTitle] = useState(existing?.title ?? "")
  const [body, setBody] = useState(existing?.body ?? "")
  const [changed, setChanged] = useState(() =>
    Array.from(
      { length: CHANGE_FIELDS },
      (_, index) => existing?.changed[index] ?? "",
    ),
  )
  const [submitting, setSubmitting] = useState(false)

  const canPublish =
    title.trim().length >= 5 && body.trim().length >= 20 && !submitting

  function updateChange(index: number, value: string) {
    setChanged((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
    )
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canPublish) return

    const input = {
      title: title.trim(),
      body: body.trim(),
      changed: changed.map((item) => item.trim()).filter(Boolean),
    }
    setSubmitting(true)
    try {
      if (existing) await updateResolution(post.id, input)
      else await createResolution(post.id, input)
      navigate(`/reviews/${post.id}`)
    } catch {
      window.alert("저장하지 못했어요. 잠시 후 다시 시도해주세요.")
      setSubmitting(false)
    }
  }

  return (
    <div className="candidate-page page-b-white member-page">
      <Header active="reviews" onNavigate={onNavigate} />
      <main className="member-main">
        <section className="member-intro">
          <span className="member-intro-icon">
            <Icon name="sparkle" size={22} />
          </span>
          <div>
            <span className="section-kicker">AFTER THE STORY</span>
            <h1>그 후의 이야기를 들려주세요</h1>
            <p>고민을 나눈 뒤 달라진 마음이 다른 해방이에게 힘이 돼요.</p>
          </div>
        </section>

        <form className="write-layout" onSubmit={handleSubmit}>
          <div className="editor-card">
            <div className="field-group">
              <label htmlFor="review-title">후기 제목</label>
              <input
                id="review-title"
                maxLength={60}
                placeholder="어떤 변화가 있었는지 한 문장으로 알려주세요"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <span className="character-count">{title.length} / 60</span>
            </div>
            <div className="field-group body-field">
              <label htmlFor="review-body">후기 본문</label>
              <textarea
                id="review-body"
                maxLength={2000}
                placeholder={
                  "어떤 대화를 나눴나요?\n지금 두 사람의 마음은 어떤지 편하게 적어주세요."
                }
                value={body}
                onChange={(event) => setBody(event.target.value)}
              />
              <span className="character-count">
                {body.length.toLocaleString()} / 2,000
              </span>
            </div>
            <div className="field-group">
              <label htmlFor="review-change-0">
                우리 사이에 생긴 변화 <span>선택</span>
              </label>
              <div className="change-fields">
                {changed.map((item, index) => (
                  <input
                    id={`review-change-${index}`}
                    key={index}
                    maxLength={40}
                    placeholder="예) 서운함을 쌓아두지 않고 먼저 설명하기"
                    value={item}
                    onChange={(event) =>
                      updateChange(index, event.target.value)
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <aside className="write-side">
            <div className="identity-card">
              <div className="anonymous-avatar">
                <Icon name="heart" size={22} />
              </div>
              <div>
                <AuthorName admin={isAdmin} name="익명의 해방이" />
                <span>
                  {isAdmin ? "관리자로 게시돼요" : "완전 익명으로 게시돼요"}
                </span>
              </div>
              <Icon name="sparkle" size={18} />
            </div>
            <div className="writing-guide">
              <span className="section-kicker">MY STORY</span>
              <h2>{post.title}</h2>
              <ul>
                <li>
                  <b>01</b>
                  <span>어떤 대화나 행동이 도움이 됐는지 들려주세요.</span>
                </li>
                <li>
                  <b>02</b>
                  <span>상대방을 특정할 수 있는 정보는 가려주세요.</span>
                </li>
              </ul>
            </div>
            <div className="form-actions">
              <button
                className="cancel-button"
                type="button"
                onClick={() => navigate(`/feed/${post.id}`)}
              >
                취소
              </button>
              <button
                className="primary-button publish-button"
                disabled={!canPublish}
                type="submit"
              >
                <Icon name="pen" size={17} />
                {existing ? " 후기 수정하기" : " 후기 올리기"}
              </button>
            </div>
            <p className="publish-hint">
              제목 5자, 본문 20자 이상 작성하면 올릴 수 있어요.
            </p>
          </aside>
        </form>
      </main>
      <MobileNav active="reviews" onNavigate={onNavigate} />
    </div>
  )
}
