export type FeedPost = {
  id: number
  category: string
  time: string
  title: string
  body: string
  likes: number
  comments: number
  relationship: string
  authorGender: string
  partnerGender: string
}

// 임시 샘플 데이터. 실제 게시글 저장소를 연결하면 교체
export const feedPosts: FeedPost[] = [
  {
    id: 1,
    category: "연락 문제",
    time: "12분 전",
    title: "연락 텀이 길어진 남자친구, 제가 예민한 걸까요?",
    body: "예전에는 바빠도 한두 시간 안에는 답이 왔는데 요즘은 반나절씩 소식이 없어요.\n서운하다고 말하면 부담스러워할까 봐 고민돼요.\n\n어떻게 말을 꺼내면 좋을까요?",
    likes: 46,
    comments: 28,
    relationship: "1년 이상 3년 미만",
    authorGender: "여성",
    partnerGender: "남성",
  },
  {
    id: 2,
    category: "데이트",
    time: "34분 전",
    title: "기념일을 자꾸 잊는 연인과 어떻게 대화할까요?",
    body: "날짜 자체보다 나만 우리 관계를 중요하게 생각하는 것 같은 기분이 들어요.\n싸우지 않고 제 마음을 잘 전하고 싶어요.",
    likes: 31,
    comments: 19,
    relationship: "3개월 이상 1년 미만",
    authorGender: "여성",
    partnerGender: "남성",
  },
  {
    id: 3,
    category: "가치관",
    time: "1시간 전",
    title: "서로 다른 소비 습관, 맞춰갈 수 있을까요?",
    body: "저는 미래를 위해 저축하는 편이고 연인은 지금의 행복이 더 중요하대요.\n함께 정할 수 있는 기준이 필요해요.",
    likes: 52,
    comments: 36,
    relationship: "3년 이상",
    authorGender: "남성",
    partnerGender: "여성",
  },
  {
    id: 4,
    category: "권태기",
    time: "2시간 전",
    title: "함께 있어도 설레지 않는데 권태기일까요?",
    body: "싫어진 건 아닌데 만나도 예전처럼 할 이야기가 많지 않아요.\n이 시기를 어떻게 지나왔는지 듣고 싶어요.",
    likes: 38,
    comments: 22,
    relationship: "3년 이상",
    authorGender: "선택 안 함",
    partnerGender: "선택 안 함",
  },
  {
    id: 5,
    category: "장거리",
    time: "3시간 전",
    title: "장거리 연애, 얼마나 자주 만나야 할까요?",
    body: "서로 일이 바빠 한 달에 한 번 보기도 어려워졌어요.\n만나는 횟수를 두고 자꾸 의견이 엇갈려요.",
    likes: 27,
    comments: 14,
    relationship: "1년 이상 3년 미만",
    authorGender: "남성",
    partnerGender: "여성",
  },
]
