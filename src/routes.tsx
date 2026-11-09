import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useNavigate,
  useParams,
} from "react-router"
import { feedPosts, type FeedPost } from "./data/feedPosts"
import Detail from "./pages/Detail"
import DetailwithReview from "./pages/DetailwithReview"
import Feed from "./pages/Feed"
import FeedReviews from "./pages/Feed_Reviews"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Saved from "./pages/Saved"
import Write from "./pages/Write"
import type { Page } from "./types"

// Page 이름 -> 주소(URL) 대응표. 페이지가 늘면 여기에 한 줄 추가
const paths: Record<Page, string> = {
  home: "/",
  feed: "/feed",
  reviews: "/reviews",
  write: "/write",
  profile: "/profile",
  saved: "/saved",
}

function usePageNavigation() {
  const navigate = useNavigate()
  return (page: Page) => {
    navigate(paths[page])
    window.scrollTo(0, 0)
  }
}

function useOpenPost(basePath: string) {
  const navigate = useNavigate()
  return (post: FeedPost) => {
    navigate(`${basePath}/${post.id}`)
    window.scrollTo(0, 0)
  }
}

function HomeRoute() {
  return <Home onNavigate={usePageNavigation()} />
}

function FeedRoute() {
  return (
    <Feed
      onNavigate={usePageNavigation()}
      onSelectPost={useOpenPost(paths.feed)}
    />
  )
}

function ReviewsRoute() {
  return (
    <FeedReviews
      onNavigate={usePageNavigation()}
      onSelectPost={useOpenPost(paths.reviews)}
    />
  )
}

function DetailRoute() {
  const { postId } = useParams()
  const post = feedPosts.find((item) => String(item.id) === postId)
  const go = usePageNavigation()

  if (!post) return <Navigate to={paths.feed} replace />
  return <Detail post={post} onNavigate={go} />
}

function ReviewDetailRoute() {
  const { postId } = useParams()
  const post = feedPosts.find((item) => String(item.id) === postId)
  const go = usePageNavigation()

  if (!post?.resolution) return <Navigate to={paths.reviews} replace />
  return <DetailwithReview post={post} onNavigate={go} />
}

function WriteRoute() {
  return <Write onNavigate={usePageNavigation()} />
}

function ProfileRoute() {
  return <Profile onNavigate={usePageNavigation()} />
}

function SavedRoute() {
  return <Saved onNavigate={usePageNavigation()} />
}

const router = createBrowserRouter([
  { path: paths.home, Component: HomeRoute },
  { path: paths.feed, Component: FeedRoute },
  { path: `${paths.feed}/:postId`, Component: DetailRoute },
  { path: paths.reviews, Component: ReviewsRoute },
  { path: `${paths.reviews}/:postId`, Component: ReviewDetailRoute },
  { path: paths.write, Component: WriteRoute },
  { path: paths.profile, Component: ProfileRoute },
  { path: paths.saved, Component: SavedRoute },
  { path: "*", element: <Navigate to={paths.home} replace /> },
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
