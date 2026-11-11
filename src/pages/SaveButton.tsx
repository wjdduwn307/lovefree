import { useState } from "react"
import { useRevalidator } from "react-router"
import {
  isSignedIn,
  savePost,
  unsavePost,
  type FeedPost,
} from "../data/feedPosts"
import { usePromptLogin } from "../lib/loginPrompt"
import { useToast } from "../lib/toast"
import { Icon } from "./Home"

export default function SaveButton({
  post,
  className = "",
  size = 18,
}: {
  post: FeedPost
  className?: string
  size?: number
}) {
  const revalidator = useRevalidator()
  const promptLogin = usePromptLogin()
  const showToast = useToast()
  // 누르자마자 아이콘이 바뀌도록 서버 응답 전까지 임시 상태를 보여줌
  const [pending, setPending] = useState<boolean | null>(null)
  const saved = pending ?? post.isSaved

  async function toggle() {
    if (pending !== null) return
    if (!(await isSignedIn())) {
      promptLogin("로그인 후 글을 저장할 수 있어요")
      return
    }

    const next = !saved
    setPending(next)
    try {
      if (next) await savePost(post.id)
      else await unsavePost(post.id)
      showToast(
        next
          ? "저장했어요. 프로필의 저장 목록에서 볼 수 있어요"
          : "저장을 취소했어요",
      )
      await revalidator.revalidate()
    } catch {
      window.alert("저장하지 못했어요. 잠시 후 다시 시도해주세요.")
    } finally {
      setPending(null)
    }
  }

  return (
    <button
      className={`${className} ${saved ? "is-saved" : ""}`.trim()}
      aria-label={saved ? "저장 취소" : "저장"}
      aria-pressed={saved}
      onClick={toggle}
    >
      <Icon name="bookmark" size={size} filled={saved} />
    </button>
  )
}
