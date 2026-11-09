import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from "react-router";
import Home from "./pages/Home";
import Write from "./pages/Write";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import Detail from "./pages/Detail";
import { feedPosts } from "./data/feedPosts";
import type { Page } from "./types";

// Page 이름 -> 주소(URL) 대응표. 페이지가 늘면 여기에 한 줄 추가
const paths: Record<Page, string> = {
  home: "/",
  feed: "/feed",
  write: "/write",
  profile: "/profile",
};

function DetailRoute({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { postId } = useParams();
  const post = feedPosts.find((item) => String(item.id) === postId);

  if (!post) return <Navigate to={paths.feed} replace />;
  return <Detail post={post} onNavigate={onNavigate} />;
}

function AppRoutes() {
  const navigate = useNavigate();

  // 기존 페이지들이 쓰는 onNavigate("write") 형태를 그대로 유지
  const go = (page: Page) => {
    navigate(paths[page]);
    window.scrollTo(0, 0);
  };

  return (
    <Routes>
      <Route path="/" element={<Home onNavigate={go} />} />
      <Route
        path="/feed"
        element={
          <Feed
            onNavigate={go}
            onSelectPost={(post) => {
              navigate(`${paths.feed}/${post.id}`);
              window.scrollTo(0, 0);
            }}
          />
        }
      />
      <Route path="/feed/:postId" element={<DetailRoute onNavigate={go} />} />
      <Route path="/write" element={<Write onNavigate={go} />} />
      <Route path="/profile" element={<Profile onNavigate={go} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
