import { useState } from "react"
import { useRevalidator } from "react-router"
import {
  isSignedIn,
  likePost,
  unlikePost,
  type FeedPost,
} from "../data/feedPosts"
import { usePromptLogin } from "../lib/loginPrompt"
import { Icon } from "./Home"

export default function LikeButton({
  post,
  className = "",
  size = 17,
  label,
}: {
  post: FeedPost
  className?: string
  size?: number
  label?: string
}) {
  const revalidator = useRevalidator()
  const promptLogin = usePromptLogin()
  // 누르자마자 하트와 숫자가 바뀌도록 서버 응답 전까지 임시 상태를 보여줌
  const [pending, setPending] = useState<boolean | null>(null)
  const liked = pending ?? post.isLiked
  const count =
    pending === null ? post.likes : post.likes + (pending ? 1 : -1)

  async function toggle() {
    if (pending !== null) return
    if (!(await isSignedIn())) {
      promptLogin("로그인 후 공감할 수 있어요")
      return
    }

    const next = !liked
    setPending(next)
    try {
      if (next) await likePost(post.id)
      else await unlikePost(post.id)
      await revalidator.revalidate()
    } catch {
      window.alert("처리하지 못했어요. 잠시 후 다시 시도해주세요.")
    } finally {
      setPending(null)
    }
  }

  return (
    <button
      className={`${className} ${liked ? "is-liked" : ""}`.trim()}
      aria-pressed={liked}
      title={liked ? "공감 취소" : "공감하기"}
      onClick={toggle}
    >
      <Icon name="heart" size={size} filled={liked} />
      {label ? ` ${label} ${count}` : ` ${count}`}
    </button>
  )
}
