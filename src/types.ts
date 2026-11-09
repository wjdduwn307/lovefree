// onNavigate로 바로 이동할 수 있는 페이지
export type Page = "home" | "feed" | "write" | "profile";

// 메뉴 활성 표시용. 상세 페이지는 게시글 id가 필요해서 onNavigate 대상에서 제외
export type ActivePage = Page | "detail";
