import { useCallback, useRef, useState } from "react"
import {
  Navigate,
  Outlet,
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
  redirect,
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
} from "react-router"
import {
  fetchComments,
  fetchMyPosts,
  fetchMyProfile,
  fetchPost,
  fetchPosts,
  fetchSavedPosts,
  isSignedIn,
  searchPosts,
} from "./data/feedPosts"
import {
  fetchAdminTerms,
  fetchIsAdmin,
  recordSearch,
} from "./data/hotTopics"
import { LoginPromptContext, usePromptLogin } from "./lib/loginPrompt"
import { ToastContext } from "./lib/toast"
import { supabase } from "./lib/supabase"
import Admin from "./pages/Admin"
import Detail from "./pages/Detail"
import DetailwithReview from "./pages/DetailwithReview"
import Feed from "./pages/Feed"
import FeedReviews from "./pages/Feed_Reviews"
import Home, { Icon } from "./pages/Home"
import LoginModal from "./pages/LoginModal"
import MyPosts from "./pages/MyPosts"
import Profile from "./pages/Profile"
import Saved from "./pages/Saved"
import Search from "./pages/Search"
import Write from "./pages/Write"
import WriteReview from "./pages/WriteReview"
import type { Page } from "./types"

// Page 이름 -> 주소(URL) 대응표. 페이지가 늘면 여기에 한 줄 추가
const paths: Record<Page, string> = {
  home: "/",
  feed: "/feed",
  reviews: "/reviews",
  write: "/write",
  profile: "/profile",
  saved: "/saved",
  myPosts: "/my-posts",
  admin: "/admin",
}

async function loadDetail(postId: string | undefined, fallback: string) {
  const post = await fetchPost(postId)
  if (!post) throw redirect(fallback)

  const [comments, myProfile] = await Promise.all([
    fetchComments(post.id),
    fetchMyProfile(),
  ])
  return { post, comments, myProfile }
}

function detailLoader({ params }: LoaderFunctionArgs) {
  return loadDetail(params.postId, paths.feed)
}

async function reviewDetailLoader({ params }: LoaderFunctionArgs) {
  const data = await loadDetail(params.postId, paths.reviews)
  if (!data.post.resolution) throw redirect(paths.reviews)
  return data
}

// 글쓴이만 수정 페이지와 후기 작성 페이지에 들어올 수 있음
async function ownPostLoader({ params }: LoaderFunctionArgs) {
  const post = await fetchPost(params.postId)
  if (!post) throw redirect(paths.feed)
  if (!post.isMine) throw redirect(`${paths.feed}/${post.id}`)
  return post
}

// 로그인하지 않으면 글쓰기 화면에 들어올 수 없음
async function writeLoader() {
  if (!(await isSignedIn())) throw redirect(paths.home)
  return null
}

async function searchLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")?.trim() ?? ""
  if (!query) throw redirect(paths.home)

  const posts = await searchPosts(query)
  // Hot 주제를 눌러 들어온 검색은 순위가 저절로 굳어지지 않게 집계에서 제외
  if (posts.length > 0 && !url.searchParams.has("hot")) recordSearch(query)
  return { query, posts }
}

async function adminLoader() {
  if (!(await fetchIsAdmin())) throw redirect(paths.home)
  return fetchAdminTerms()
}

async function savedLoader() {
  const [posts, signedIn] = await Promise.all([fetchSavedPosts(), isSignedIn()])
  return { posts, signedIn }
}

async function myPostsLoader() {
  const [posts, signedIn] = await Promise.all([fetchMyPosts(), isSignedIn()])
  return { posts, signedIn }
}

function usePageNavigation() {
  const navigate = useNavigate()
  const promptLogin = usePromptLogin()
  return async (page: Page) => {
    if (page === "write" && !(await isSignedIn())) {
      promptLogin("로그인 후 글을 쓸 수 있어요", paths.write)
      return
    }
    navigate(paths[page])
  }
}

function useOpenPost(basePath: string) {
  const navigate = useNavigate()
  return (post: { id: number }) => navigate(`${basePath}/${post.id}`)
}

function RootLayout() {
  const navigate = useNavigate()
  const [loginPrompt, setLoginPrompt] = useState<{
    notice: string
    next?: string
  } | null>(null)

  const [toast, setToast] = useState<{ id: number; message: string } | null>(
    null,
  )
  const toastTimer = useRef<number | undefined>(undefined)

  const showToast = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = window.setTimeout(() => setToast(null), 2400)
  }, [])

  // 팝업에서 로그인까지 마치면 원래 하려던 화면으로 이동
  async function closeLoginPrompt() {
    const next = loginPrompt?.next
    setLoginPrompt(null)
    if (next && (await isSignedIn())) navigate(next)
  }

  return (
    <LoginPromptContext value={(notice, next) => setLoginPrompt({ notice, next })}>
      <ToastContext value={showToast}>
        <Outlet />
        <ScrollRestoration />
        {loginPrompt && (
          <LoginModal notice={loginPrompt.notice} onClose={closeLoginPrompt} />
        )}
        {toast && (
          <div className="save-toast" key={toast.id} role="status">
            <Icon name="bookmark" size={18} /> {toast.message}
          </div>
        )}
      </ToastContext>
    </LoginPromptContext>
  )
}

function RouteLoading() {
  return <div className="route-status">불러오는 중이에요</div>
}

function RouteError() {
  return (
    <div className="route-status">
      <p>이야기를 불러오지 못했어요.</p>
      <button
        className="primary-button small"
        onClick={() => window.location.reload()}
      >
        다시 시도
      </button>
    </div>
  )
}

function HomeRoute() {
  return (
    <Home
      posts={useLoaderData<typeof fetchPosts>()}
      onNavigate={usePageNavigation()}
      onSelectReview={useOpenPost(paths.reviews)}
      onSelectPost={useOpenPost(paths.feed)}
    />
  )
}

function FeedRoute() {
  return (
    <Feed
      posts={useLoaderData<typeof fetchPosts>()}
      onNavigate={usePageNavigation()}
      onSelectPost={useOpenPost(paths.feed)}
    />
  )
}

function ReviewsRoute() {
  return (
    <FeedReviews
      posts={useLoaderData<typeof fetchPosts>()}
      onNavigate={usePageNavigation()}
      onSelectPost={useOpenPost(paths.reviews)}
    />
  )
}

function DetailRoute() {
  const data = useLoaderData<typeof detailLoader>()
  return <Detail {...data} onNavigate={usePageNavigation()} />
}

function ReviewDetailRoute() {
  const data = useLoaderData<typeof reviewDetailLoader>()
  return <DetailwithReview {...data} onNavigate={usePageNavigation()} />
}

function WriteRoute() {
  return <Write onNavigate={usePageNavigation()} />
}

function EditPostRoute() {
  const post = useLoaderData<typeof ownPostLoader>()
  return <Write key={post.id} post={post} onNavigate={usePageNavigation()} />
}

function WriteReviewRoute() {
  const post = useLoaderData<typeof ownPostLoader>()
  return (
    <WriteReview key={post.id} post={post} onNavigate={usePageNavigation()} />
  )
}

function ProfileRoute() {
  const profile = useLoaderData<typeof fetchMyProfile>()
  // 로그인 상태가 바뀌면 입력값을 새 프로필로 다시 채움
  return (
    <Profile
      key={profile ? "member" : "guest"}
      profile={profile}
      onNavigate={usePageNavigation()}
    />
  )
}

function AdminRoute() {
  return (
    <Admin
      terms={useLoaderData<typeof adminLoader>()}
      onNavigate={usePageNavigation()}
    />
  )
}

function SearchRoute() {
  const openPost = useOpenPost(paths.feed)
  const openReview = useOpenPost(paths.reviews)
  return (
    <Search
      {...useLoaderData<typeof searchLoader>()}
      onNavigate={usePageNavigation()}
      onSelectPost={(post) =>
        post.resolution ? openReview(post) : openPost(post)
      }
    />
  )
}

function MyPostsRoute() {
  return (
    <MyPosts
      {...useLoaderData<typeof myPostsLoader>()}
      onNavigate={usePageNavigation()}
      onSelectPost={useOpenPost(paths.feed)}
    />
  )
}

function SavedRoute() {
  return (
    <Saved
      {...useLoaderData<typeof savedLoader>()}
      onNavigate={usePageNavigation()}
      onSelectPost={useOpenPost(paths.feed)}
    />
  )
}

const router = createBrowserRouter([
  {
    Component: RootLayout,
    HydrateFallback: RouteLoading,
    ErrorBoundary: RouteError,
    children: [
      { path: paths.home, loader: fetchPosts, Component: HomeRoute },
      { path: paths.feed, loader: fetchPosts, Component: FeedRoute },
      {
        path: `${paths.feed}/:postId`,
        loader: detailLoader,
        Component: DetailRoute,
      },
      {
        path: `${paths.feed}/:postId/review`,
        loader: ownPostLoader,
        Component: WriteReviewRoute,
      },
      { path: paths.reviews, loader: fetchPosts, Component: ReviewsRoute },
      {
        path: `${paths.reviews}/:postId`,
        loader: reviewDetailLoader,
        Component: ReviewDetailRoute,
      },
      { path: paths.write, loader: writeLoader, Component: WriteRoute },
      {
        path: `${paths.write}/:postId`,
        loader: ownPostLoader,
        Component: EditPostRoute,
      },
      {
        path: paths.profile,
        loader: fetchMyProfile,
        Component: ProfileRoute,
      },
      { path: paths.saved, loader: savedLoader, Component: SavedRoute },
      { path: "/search", loader: searchLoader, Component: SearchRoute },
      { path: paths.admin, loader: adminLoader, Component: AdminRoute },
      {
        path: paths.myPosts,
        loader: myPostsLoader,
        Component: MyPostsRoute,
      },
      { path: "*", element: <Navigate to={paths.home} replace /> },
    ],
  },
])

// 로그인/로그아웃하면 "내 글" 표시가 달라지므로 화면 데이터를 다시 불러옴
let currentUserId: string | undefined
supabase.auth.onAuthStateChange((event, session) => {
  const nextUserId = session?.user.id
  if (event !== "INITIAL_SESSION" && nextUserId !== currentUserId) {
    window.setTimeout(() => router.revalidate(), 0)
  }
  currentUserId = nextUserId
})

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
