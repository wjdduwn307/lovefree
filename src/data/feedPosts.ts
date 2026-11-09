export type Resolution = {
  title: string
  body: string
  changed: string[]
  time: string
}

export type FeedPost = {
  id: number
  category: string
  title: string
  body: string
  time: string
  relationship: string
  authorGender: string
  partnerGender: string
  comments: number
  likes: number
  resolution?: Resolution
}

export const feedPosts: FeedPost[] = [
  {
    id: 1,
    category: "연락 문제",
    title: "연락 텀이 길어진 남자친구, 제가 예민한 걸까요?",
    body: "예전에는 바빠도 한두 시간 안에는 답장이 왔는데, 요즘은 반나절씩 소식이 없어요.\n\n바쁜 시기라는 건 알고 있지만 연락을 기다리는 시간이 길어질수록 저만 우리 관계를 신경 쓰는 것 같은 기분이 들어요. 서운하다고 말하면 부담스러워할까 봐 아직 제대로 이야기하지 못했습니다.\n\n감정적으로 따지지 않으면서 제 마음을 어떻게 전하면 좋을까요?",
    time: "12분 전",
    relationship: "1년 이상 3년 미만",
    authorGender: "여성",
    partnerGender: "남성",
    comments: 28,
    likes: 46,
    resolution: {
      title: "답장 시간보다 서로의 하루를 묻기로 했어요",
      body: "댓글에서 알려준 대화법을 참고해 서운함부터 꺼내기보다 요즘 많이 바쁜지 먼저 물어봤어요.\n\n연인도 연락이 줄어든 걸 미안해하고 있었고, 이제는 답장 시간보다 하루에 한 번 서로의 하루를 제대로 묻기로 했어요.",
      changed: [
        "기다리는 시간을 혼자 해석하지 않기",
        "매일 밤 서로의 하루 나누기",
      ],
      time: "고민 작성 7일 후",
    },
  },
  {
    id: 2,
    category: "데이트",
    title: "기념일을 자꾸 잊는 연인과 어떻게 대화할까요?",
    body: "날짜 자체보다 나만 우리 관계를 중요하게 생각하는 것 같은 기분이 들어요.\n\n지난번에는 서운한 마음에 바로 화를 냈고 결국 서로 기분만 상했습니다. 이번에는 싸우지 않고 제가 왜 서운했는지 차분히 전하고 싶어요.",
    time: "34분 전",
    relationship: "3년 이상",
    authorGender: "여성",
    partnerGender: "여성",
    comments: 19,
    likes: 31,
    resolution: {
      title: "기념일보다 중요한 마음을 확인했어요",
      body: "서운했던 이유가 날짜를 잊어서가 아니라 나만 관계를 중요하게 생각하는 것 같았기 때문이라고 차분히 이야기했어요.\n\n함께 기억하고 싶은 날을 둘이 다시 정하고 캘린더에 기록했습니다.",
      changed: ["함께 기억할 기념일 정하기", "서운함을 쌓아두지 않고 설명하기"],
      time: "고민 작성 12일 후",
    },
  },
  {
    id: 3,
    category: "가치관",
    title: "서로 다른 소비 습관, 맞춰갈 수 있을까요?",
    body: "저는 미래를 위해 저축하는 편이고 연인은 지금의 행복이 더 중요하다고 생각해요.\n\n데이트 비용이나 여행 계획을 세울 때마다 서로가 답답하다고 느끼게 됩니다.",
    time: "1시간 전",
    relationship: "3개월 이상 1년 미만",
    authorGender: "남성",
    partnerGender: "여성",
    comments: 36,
    likes: 52,
    resolution: {
      title: "우리 둘만의 소비 기준이 생겼어요",
      body: "각자의 소비 방식을 틀렸다고 말하지 않고 우리가 함께 이루고 싶은 목표부터 이야기했습니다.\n\n공동 저축과 각자 자유롭게 쓸 수 있는 금액을 나누기로 했어요.",
      changed: ["공동 목표 금액 먼저 정하기", "각자의 자유 소비 존중하기"],
      time: "고민 작성 3주 후",
    },
  },
  {
    id: 4,
    category: "권태기",
    title: "요즘 대화가 줄었는데 권태기의 시작일까요?",
    body: "함께 있어도 각자 휴대폰만 보는 시간이 많아졌어요. 편안해진 건지 마음이 멀어진 건지 구분이 되지 않아 고민입니다.",
    time: "2시간 전",
    relationship: "1년 이상 3년 미만",
    authorGender: "남성",
    partnerGender: "남성",
    comments: 14,
    likes: 25,
  },
  {
    id: 5,
    category: "장거리",
    title: "한 달에 한 번 만나는 장거리 연애, 지치지 않는 방법이 있을까요?",
    body: "서로의 일정이 맞지 않아 만나는 횟수가 줄고 있습니다. 연락만으로 관계를 잘 이어갈 수 있는 방법이 궁금해요.",
    time: "5시간 전",
    relationship: "3개월 이상 1년 미만",
    authorGender: "여성",
    partnerGender: "남성",
    comments: 22,
    likes: 38,
  },
  {
    id: 6,
    category: "가족",
    title: "연인의 가족 문제에 어디까지 의견을 내도 될까요?",
    body: "힘들어하는 모습을 보면 도와주고 싶지만 괜히 선을 넘는 건 아닐까 조심스러워요.",
    time: "8시간 전",
    relationship: "3년 이상",
    authorGender: "기타",
    partnerGender: "여성",
    comments: 11,
    likes: 17,
  },
]
