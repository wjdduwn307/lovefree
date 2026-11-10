import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import {
  createPost,
  updatePost,
  type FeedPost,
} from "../data/feedPosts"
import { useIsAdmin } from "../lib/useIsAdmin"
import type { Page } from "../types"
import { AuthorName, Header, Icon, MobileNav } from "./Home"

type ScreenProps = {
  post?: FeedPost
  onNavigate: (page: Page) => void
}

const topics = ["연락 문제", "데이트", "가치관", "권태기", "장거리", "기타"]

export default function Write({ post, onNavigate }: ScreenProps) {
  const navigate = useNavigate()
  const isAdmin = useIsAdmin()
  const [topic, setTopic] = useState(post?.category ?? "")
  const [title, setTitle] = useState(post?.title ?? "")
  const [body, setBody] = useState(post?.body ?? "")
  // const [allowComments, setAllowComments] = useState(true)
  const [published, setPublished] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const hasBody = body.trim().length > 0

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (submitting || !hasBody) return
    if (title.trim().length < 5 || body.trim().length < 20) {
      window.alert("제목은 5자, 본문은 20자 이상 작성해주세요.")
      return
    }

    const input = {
      category: topic || "기타",
      title: title.trim(),
      body: body.trim(),
    }
    setSubmitting(true)
    try {
      let postId = post?.id
      if (postId) await updatePost(postId, input)
      else postId = await createPost(input)

      setPublished(true)
      const target = `/feed/${postId}`
      window.setTimeout(() => navigate(target), 1100)
    } catch {
      window.alert("저장하지 못했어요. 잠시 후 다시 시도해주세요.")
      setSubmitting(false)
    }
  }

  return (
    <div className="candidate-page page-b-white member-page">
      <Header active="write" onNavigate={onNavigate} />
      <main className="member-main">
        <section className="member-intro">
          <span className="member-intro-icon">
            <Icon name="pen" size={22} />
          </span>
          <div>
            <span className="section-kicker">SHARE YOUR HEART</span>
            <h1>마음속 이야기를 들려주세요</h1>
            <p>
              이곳에서는 모두가 ‘익명의 해방이’예요. 천천히, 솔직하게 적어도
              괜찮아요.
            </p>
          </div>
        </section>

        <form className="write-layout" onSubmit={handleSubmit}>
          <div className="editor-card">
            <div className="field-group">
              <label>
                고민 주제 <span>선택</span>
              </label>
              <div className="topic-selector">
                {topics.map((item) => (
                  <button
                    className={topic === item ? "selected" : ""}
                    key={item}
                    type="button"
                    onClick={() => setTopic(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="field-group">
              <label htmlFor="story-title">제목</label>
              <input
                id="story-title"
                maxLength={60}
                placeholder="어떤 고민인지 한 문장으로 알려주세요"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <span className="character-count">{title.length} / 60</span>
            </div>
            <div className="field-group body-field">
              <label htmlFor="story-body">본문</label>
              <textarea
                id="story-body"
                maxLength={2000}
                placeholder={
                  "무슨 일이 있었나요?\n지금 어떤 마음인지, 어떤 도움이 필요한지 편하게 적어주세요."
                }
                value={body}
                onChange={(event) => setBody(event.target.value)}
              />
              <span className="character-count">
                {body.length.toLocaleString()} / 2,000
              </span>
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
              <span className="section-kicker">A LITTLE GUIDE</span>
              <h2>더 따뜻한 대화를 위해</h2>
              <ul>
                <li>
                  <b>01</b>
                  <span>상대방을 특정할 수 있는 정보는 가려주세요.</span>
                </li>
                <li>
                  <b>02</b>
                  <span>비난보다 내가 느낀 감정을 들려주세요.</span>
                </li>
                <li>
                  <b>03</b>
                  <span>받고 싶은 조언을 함께 적어보세요.</span>
                </li>
              </ul>
            </div>
            {/* <label className="toggle-row">
              <span>
                <strong>댓글 받기</strong>
                <small>다른 해방이들의 이야기를 들어요</small>
              </span>
              <input
                type="checkbox"
                checked={allowComments}
                onChange={(event) => setAllowComments(event.target.checked)}
              />
              <i />
            </label> */}
            <div className="form-actions">
              <button
                className="cancel-button"
                type="button"
                onClick={() =>
                  post ? navigate(`/feed/${post.id}`) : onNavigate("home")
                }
              >
                취소
              </button>
              <button
                className="primary-button publish-button"
                disabled={!hasBody || submitting}
                type="submit"
              >
                <Icon name="pen" size={17} />{" "}
                {post ? "고민 수정하기" : "고민 올리기"}
              </button>
            </div>
            <p className="publish-hint">
              제목 5자, 본문 20자 이상 작성하면 올릴 수 있어요.
            </p>
          </aside>
        </form>
      </main>
      {published && (
        <div className="save-toast">
          <Icon name="heart" size={18} />{" "}
          {post ? "고민을 수정했어요" : "고민이 따뜻하게 전해졌어요"}
        </div>
      )}
      <MobileNav active="write" onNavigate={onNavigate} />
    </div>
  )
}
