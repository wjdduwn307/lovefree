import { useState, type FormEvent } from "react"
import type { FeedPost } from "../data/feedPosts"
import type { Page } from "../types"
import { Header, Icon, MobileNav } from "./Home"

type Comment = {
  id: number
  relationship: string
  time: string
  text: string
}

const initialComments: Comment[] = [
  {
    id: 1,
    relationship: "2년째 연애 중",
    time: "8분 전",
    text: "저도 비슷한 시기가 있었어요. 연락 횟수보다 서로 꼭 지키고 싶은 연락 시간을 하나 정해보니 훨씬 편해졌습니다.",
  },
  {
    id: 2,
    relationship: "8개월째 연애 중",
    time: "21분 전",
    text: "서운함부터 말하기보다 요즘 많이 바쁜지 먼저 물어보는 건 어떨까요? 대화의 시작이 한결 부드러웠어요.",
  },
  {
    id: 3,
    relationship: "4년째 연애 중",
    time: "43분 전",
    text: "기다리는 동안 어떤 기분이 들었는지를 솔직하게 말해보세요. 상대를 탓하지 않고 내 감정을 설명하는 게 중요하더라고요.",
  },
]

export default function Detail({
  post,
  onNavigate,
}: {
  post: FeedPost
  onNavigate: (page: Page) => void
}) {
  const [comments, setComments] = useState(initialComments)
  const [comment, setComment] = useState("")

  function submitComment(event: FormEvent) {
    event.preventDefault()
    const text = comment.trim()
    if (!text) return

    setComments((current) => [
      ...current,
      {
        id: Date.now(),
        relationship: "1년 이상 3년 미만",
        time: "방금 전",
        text,
      },
    ])
    setComment("")
  }

  return (
    <div className="candidate-page page-b-white detail-page">
      <Header active="detail" onNavigate={onNavigate} />
      <main className="detail-main">
        <button className="detail-back" onClick={() => onNavigate("feed")}>
          <Icon name="arrow" size={17} /> 고민 피드로 돌아가기
        </button>

        <article className="detail-article">
          <div className="detail-topic-row">
            <span>{post.category}</span>
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
        </article>

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
                <span>1년 이상 3년 미만</span>
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
                  disabled={!comment.trim()}
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
                  <p>{item.text}</p>
                  <button>
                    <Icon name="heart" size={14} /> 도움됐어요
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <MobileNav active="detail" onNavigate={onNavigate} />
    </div>
  )
}
