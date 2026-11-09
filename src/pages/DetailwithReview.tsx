import type {
  FeedPost,
  MyProfile,
  PostComment,
} from "../data/feedPosts"
import type { Page } from "../types"
import Detail from "./Detail"

export default function Review({
  post,
  comments,
  myProfile,
  onNavigate,
}: {
  post: FeedPost
  comments: PostComment[]
  myProfile: MyProfile | null
  onNavigate: (page: Page) => void
}) {
  return (
    <Detail
      post={post}
      comments={comments}
      myProfile={myProfile}
      resolution={post.resolution}
      onNavigate={onNavigate}
    />
  )
}
