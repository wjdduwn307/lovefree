import Detail, { type Resolution } from "./Detail"
import type { FeedPost } from "../data/feedPosts"
import type { Page } from "../types"

const reviews: Record<number, Resolution> = {
  1: {
    title: "답장 시간보다 서로의 하루를 묻기로 했어요",
    body: "댓글에서 알려준 대화법을 참고해 서운함부터 꺼내기보다 요즘 많이 바쁜지 먼저 물어봤어요.\n\n연인도 연락이 줄어든 걸 미안해하고 있었고, 답장을 빨리 해야 한다는 부담 때문에 오히려 연락을 미루게 됐다고 솔직하게 말해줬습니다. 이제는 답장 시간보다 하루에 한 번 서로의 하루를 제대로 묻기로 했어요.",
    changed: [
      "기다리는 시간을 혼자 해석하지 않기",
      "매일 밤 짧게라도 서로의 하루 나누기",
    ],
    time: "고민 작성 7일 후",
  },
  2: {
    title: "기념일보다 중요한 마음을 확인했어요",
    body: "서운했던 이유가 날짜를 잊어서가 아니라 나만 관계를 중요하게 생각하는 것 같았기 때문이라고 차분히 이야기했어요.\n\n함께 기억하고 싶은 날을 둘이 다시 정하고 캘린더에 기록했습니다. 연인도 제 마음을 이해해 줬고, 다음 기념일은 함께 계획하기로 했어요.",
    changed: [
      "함께 기억할 기념일 직접 정하기",
      "서운함을 쌓아두지 않고 먼저 설명하기",
    ],
    time: "고민 작성 12일 후",
  },
  3: {
    title: "우리 둘만의 소비 기준이 생겼어요",
    body: "각자의 소비 방식을 틀렸다고 말하지 않고 우리가 함께 이루고 싶은 목표부터 이야기했습니다.\n\n공동 저축과 각자 자유롭게 쓸 수 있는 금액을 나누니 서로를 설득하려 애쓰지 않아도 됐어요. 한 달에 한 번 함께 점검하며 조정하기로 했습니다.",
    changed: [
      "공동 목표를 위한 금액 먼저 정하기",
      "각자의 자유 소비 영역 존중하기",
    ],
    time: "고민 작성 3주 후",
  },
}

export default function Review({
  post,
  onNavigate,
}: {
  post: FeedPost
  onNavigate: (page: Page) => void
}) {
  return (
    <Detail
      post={post}
      resolution={reviews[post.id] ?? reviews[1]}
      onNavigate={onNavigate}
    />
  )
}
