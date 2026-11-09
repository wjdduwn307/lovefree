import { useState, type FormEvent } from "react"
import { useNavigate, useRevalidator } from "react-router"
import {
  createComment,
  deleteComment,
  deletePost,
  deleteResolution,
  isSignedIn,
  updateComment,
  type FeedPost,
  type MyProfile,
  type PostComment,
  type Resolution,
} from "../data/feedPosts"
import type { Page } from "../types"
import { Header, Icon, MobileNav } from "./Home"
import LoginModal from "./LoginModal"

export default function Detail({
  post,
  comments,
  myProfile,
  resolution,
  onNavigate,
}: {
  post: FeedPost
  comments: PostComment[]
  myProfile: MyProfile | null
  resolution?: Resolution
  onNavigate: (page: Page) => void
}) {
  const navigate = useNavigate()
  const revalidator = useRevalidator()
  const [comment, setComment] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingText, setEditingText] = useState("")
  const [busy, setBusy] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  async function run(action: () => Promise<unknown>) {
    if (busy) return false
    setBusy(true)
    try {
      await action()
      return true
    } catch {
      window.alert("처리하지 못했어요. 잠시 후 다시 시도해주세요.")
      return false
    } finally {
      setBusy(false)
    }
  }

  async function submitComment(event: FormEvent) {
    event.preventDefault()
    const text = comment.trim()
    if (!text) return
    if (!(await isSignedIn())) {
      setShowLogin(true)
      return
    }

    const done = await run(async () => {
      await createComment(post.id, text)
      await revalidator.revalidate()
    })
    if (done) setComment("")
  }

  function startEditing(item: PostComment) {
    setEditingId(item.id)
    setEditingText(item.text)
  }

  async function saveEditing(event: FormEvent) {
    event.preventDefault()
    const text = editingText.trim()
    if (!text || editingId === null) return

    const done = await run(async () => {
      await updateComment(editingId, text)
      await revalidator.revalidate()
    })
    if (done) setEditingId(null)
  }

  function removeComment(commentId: number) {
    if (!window.confirm("댓글을 삭제할까요?")) return
    void run(async () => {
      await deleteComment(commentId)
      await revalidator.revalidate()
    })
  }

  async function removePost() {
    if (!window.confirm("글을 삭제할까요? 후기와 댓글도 함께 삭제돼요.")) return
    if (await run(() => deletePost(post.id))) navigate("/feed")
  }

  async function removeResolution() {
    if (!window.confirm("후기를 삭제할까요?")) return
    if (await run(() => deleteResolution(post.id))) navigate(`/feed/${post.id}`)
  }

  return (
    <div className="candidate-page page-b-white detail-page">
      <Header
        active={resolution ? "reviews" : "detail"}
        onNavigate={onNavigate}
      />
      <main className="detail-main">
        <button className="detail-back" onClick={() => onNavigate("feed")}>
          <Icon name="arrow" size={17} /> 고민 피드로 돌아가기
        </button>

        <article className="detail-article">
          <div className="detail-topic-row">
            <div>
              <span>{post.category}</span>
            </div>
            <time>{post.time}</time>
          </div>
          <h1>{post.title}</h1>

          <div className="detail-author-panel">
            <span className="detail-avatar">
              <Icon name="heart" size={22} />
            </span>
            <div className="detail-author-name">
              <strong>익명의 해방이</strong>
              <span>마음을 나눈 해방이</span>
            </div>
            <dl>
              <div>
                <dt>연애 기간</dt>
                <dd>{post.relationship}</dd>
              </div>
              <div>
                <dt>글쓴이</dt>
                <dd>{post.authorGender}</dd>
              </div>
              <div>
                <dt>상대방</dt>
                <dd>{post.partnerGender}</dd>
              </div>
            </dl>
          </div>

          <div className="detail-body">
            {post.body
              .split("\n")
              .map((line, index) =>
                line ? <p key={index}>{line}</p> : <br key={index} />,
              )}
          </div>

          <div className="detail-reactions">
            <button>
              <Icon name="heart" size={18} /> 공감해요 {post.likes}
            </button>
            <span>
              <Icon name="chat" size={18} /> 댓글 {comments.length}
            </span>
            <button className="detail-bookmark" aria-label="게시글 저장">
              <Icon name="bookmark" size={19} />
            </button>
          </div>

          {post.isMine && (
            <div className="owner-actions">
              {!resolution && (
                <button onClick={() => navigate(`/feed/${post.id}/review`)}>
                  {post.resolution ? "후기 수정" : "후기 쓰기"}
                </button>
              )}
              <button onClick={() => navigate(`/write/${post.id}`)}>
                글 수정
              </button>
              <button className="danger" disabled={busy} onClick={removePost}>
                글 삭제
              </button>
            </div>
          )}
        </article>

        {resolution && (
          <section className="resolution-section">
            <span className="resolution-connector" aria-hidden="true">
              <i />
              <b />
            </span>
            <div className="resolution-card">
              <div className="resolution-card-heading">
                <span className="resolved-badge">
                  <Icon name="sparkle" size={15} /> 해결했어요
                </span>
                <time>{resolution.time}</time>
              </div>
              <p className="resolution-label">이 고민을 나눈 뒤</p>
              <h2>{resolution.title}</h2>
              <div className="resolution-body">
                {resolution.body
                  .split("\n")
                  .map((line, index) =>
                    line ? <p key={index}>{line}</p> : <br key={index} />,
                  )}
              </div>
              {resolution.changed.length > 0 && (
                <div className="resolution-changes">
                  <span>우리 사이에 생긴 변화</span>
                  <div>
                    {resolution.changed.map((item) => (
                      <p key={item}>
                        <Icon name="heart" size={14} /> {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {post.isMine && (
                <div className="owner-actions">
                  <button onClick={() => navigate(`/feed/${post.id}/review`)}>
                    후기 수정
                  </button>
                  <button
                    className="danger"
                    disabled={busy}
                    onClick={removeResolution}
                  >
                    후기 삭제
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="comment-section">
          <div className="comment-heading">
            <div>
              <span className="section-kicker">WARM REPLIES</span>
              <h2>
                해방이들의 이야기 <b>{comments.length}</b>
              </h2>
            </div>
            <p>서로를 존중하는 따뜻한 댓글을 남겨주세요.</p>
          </div>

          <form className="comment-form" onSubmit={submitComment}>
            <span className="comment-my-avatar">
              <Icon name="user" size={19} />
            </span>
            <div>
              <div className="comment-form-meta">
                <strong>해방이</strong>
                <span>{myProfile?.relationship ?? "연애 기간 미입력"}</span>
              </div>
              <textarea
                maxLength={500}
                placeholder="이 고민에 따뜻한 이야기를 건네주세요."
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
              <div className="comment-form-actions">
                <span>{comment.length} / 500</span>
                <button
                  className="primary-button"
                  type="submit"
                  disabled={!comment.trim() || busy}
                >
                  댓글 등록
                </button>
              </div>
            </div>
          </form>

          <div className="comment-list">
            {comments.map((item, index) => (
              <article className="comment-item" key={item.id}>
                <span
                  className={`comment-avatar comment-avatar-${(index % 4) + 1}`}
                >
                  <Icon name="heart" size={15} />
                </span>
                <div>
                  <div className="comment-meta">
                    <strong>해방이</strong>
                    <span>{item.relationship}</span>
                    <i />
                    <time>{item.time}</time>
                  </div>
                  {editingId === item.id ? (
                    <form className="comment-edit" onSubmit={saveEditing}>
                      <textarea
                        maxLength={500}
                        value={editingText}
                        onChange={(event) => setEditingText(event.target.value)}
                      />
                      <div className="comment-actions">
                        <button type="submit" disabled={busy}>
                          저장
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                        >
                          취소
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p>{item.text}</p>
                      <div className="comment-actions">
                        <button>
                          <Icon name="heart" size={14} /> 도움됐어요
                        </button>
                        {item.isMine && (
                          <>
                            <button onClick={() => startEditing(item)}>
                              수정
                            </button>
                            <button
                              className="danger"
                              disabled={busy}
                              onClick={() => removeComment(item.id)}
                            >
                              삭제
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <MobileNav
        active={resolution ? "reviews" : "detail"}
        onNavigate={onNavigate}
      />
    </div>
  )
}
