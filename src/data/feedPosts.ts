import { supabase } from "../lib/supabase"

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
  isMine: boolean
  isAdminAuthor: boolean
  isSaved: boolean
  isLiked: boolean
  resolution?: Resolution
}

export type PostComment = {
  id: number
  relationship: string
  time: string
  text: string
  isMine: boolean
  isAuthor: boolean
  isAdminAuthor: boolean
}

export type MyProfile = {
  relationship: string | null
  myGender: string | null
  partnerGender: string | null
}

export type PostInput = { category: string; title: string; body: string }
export type ResolutionInput = {
  title: string
  body: string
  changed: string[]
}

type PostRow = {
  id: number
  category: string
  title: string
  body: string
  relationship: string | null
  author_gender: string | null
  partner_gender: string | null
  likes: number
  created_at: string
  is_mine: boolean
  is_admin_author?: boolean
  saved_at?: string | null
  is_liked?: boolean
  comment_count: number
  resolution_title: string | null
  resolution_body: string | null
  resolution_changed: string[] | null
  resolution_created_at: string | null
}

type CommentRow = {
  id: number
  relationship: string | null
  body: string
  created_at: string
  is_mine: boolean
  is_author?: boolean
  is_admin_author?: boolean
}

const MISSING = "미입력"
const DAY = 24 * 60 * 60 * 1000

function relativeTime(iso: string) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return "방금 전"
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}일 전`
  return new Date(iso).toLocaleDateString("ko-KR")
}

function resolutionTime(postAt: string, resolutionAt: string) {
  const days = Math.floor(
    (new Date(resolutionAt).getTime() - new Date(postAt).getTime()) / DAY,
  )
  if (days < 1) return "고민 작성 당일"
  if (days < 14) return `고민 작성 ${days}일 후`
  return `고민 작성 ${Math.floor(days / 7)}주 후`
}

function toPost(row: PostRow): FeedPost {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    body: row.body,
    time: relativeTime(row.created_at),
    relationship: row.relationship ?? MISSING,
    authorGender: row.author_gender ?? MISSING,
    partnerGender: row.partner_gender ?? MISSING,
    comments: row.comment_count,
    likes: row.likes,
    isMine: row.is_mine,
    isAdminAuthor: row.is_admin_author ?? false,
    isSaved: Boolean(row.saved_at),
    isLiked: row.is_liked ?? false,
    resolution:
      row.resolution_title && row.resolution_created_at
        ? {
            title: row.resolution_title,
            body: row.resolution_body ?? "",
            changed: row.resolution_changed ?? [],
            time: resolutionTime(row.created_at, row.resolution_created_at),
          }
        : undefined,
  }
}

export async function isSignedIn() {
  const { data } = await supabase.auth.getSession()
  return Boolean(data.session)
}

export async function fetchPosts() {
  const { data, error } = await supabase
    .from("posts_public")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return (data as PostRow[]).map(toPost)
}

// 검색어를 PostgREST 필터에 안전하게 넣을 수 있는 패턴으로 변환
function searchPattern(word: string) {
  const literal = word.replace(/[\\%_]/g, "\\$&")
  return `"%${literal.replace(/["\\]/g, "\\$&")}%"`
}

const SEARCH_COLUMNS = [
  "category",
  "title",
  "body",
  "resolution_title",
  "resolution_body",
]

// 띄어쓰기로 나눈 단어가 모두 포함된 글을 찾음
export async function searchPosts(query: string) {
  // *는 DB 필터에서 "아무 글자"로 해석되므로 검색어에서 제외
  const words = query.replace(/\*/g, " ").split(/\s+/).filter(Boolean)
  if (words.length === 0) return []

  let request = supabase.from("posts_public").select("*")
  for (const word of words) {
    const pattern = searchPattern(word)
    request = request.or(
      SEARCH_COLUMNS.map((column) => `${column}.ilike.${pattern}`).join(","),
    )
  }

  const { data, error } = await request.order("created_at", {
    ascending: false,
  })
  if (error) throw error
  return (data as PostRow[]).map(toPost)
}

export async function fetchSavedPosts() {
  const { data, error } = await supabase
    .from("posts_public")
    .select("*")
    .not("saved_at", "is", null)
    .order("saved_at", { ascending: false })
  if (error) throw error
  return (data as PostRow[]).map(toPost)
}

export async function savePost(postId: number) {
  const { error } = await supabase.from("saved_posts").insert({ post_id: postId })
  // 이미 저장된 글이면 그대로 둠
  if (error && error.code !== "23505") throw error
}

export async function likePost(postId: number) {
  const { error } = await supabase.from("post_likes").insert({ post_id: postId })
  // 이미 공감한 글이면 그대로 둠
  if (error && error.code !== "23505") throw error
}

export async function unlikePost(postId: number) {
  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
  if (error) throw error
}

export async function unsavePost(postId: number) {
  const { error } = await supabase
    .from("saved_posts")
    .delete()
    .eq("post_id", postId)
  if (error) throw error
}

export async function fetchMyPosts() {
  const { data, error } = await supabase
    .from("posts_public")
    .select("*")
    .eq("is_mine", true)
    .order("created_at", { ascending: false })
  if (error) throw error
  return (data as PostRow[]).map(toPost)
}

export async function fetchPost(postId: string | undefined) {
  const id = Number(postId)
  if (!Number.isInteger(id)) return null

  const { data, error } = await supabase
    .from("posts_public")
    .select("*")
    .eq("id", id)
    .maybeSingle()
  if (error) throw error
  return data ? toPost(data as PostRow) : null
}

export async function fetchComments(postId: number): Promise<PostComment[]> {
  const { data, error } = await supabase
    .from("comments_public")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
  if (error) throw error
  return (data as CommentRow[]).map((row) => ({
    id: row.id,
    relationship: row.relationship ?? MISSING,
    time: relativeTime(row.created_at),
    text: row.body,
    isMine: row.is_mine,
    isAuthor: row.is_author ?? false,
    isAdminAuthor: row.is_admin_author ?? false,
  }))
}

export async function fetchMyProfile(): Promise<MyProfile | null> {
  const { data: auth } = await supabase.auth.getSession()
  if (!auth.session) return null

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.session.user.id)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return {
    relationship: data.relationship,
    myGender: data.my_gender,
    partnerGender: data.partner_gender,
  }
}

export async function saveMyProfile(profile: MyProfile) {
  const { data: auth } = await supabase.auth.getSession()
  if (!auth.session) throw new Error("로그인이 필요해요")

  const { error } = await supabase.from("profiles").upsert({
    id: auth.session.user.id,
    relationship: profile.relationship,
    my_gender: profile.myGender,
    partner_gender: profile.partnerGender,
  })
  if (error) throw error
}

export async function createPost(input: PostInput) {
  const profile = await fetchMyProfile()
  const { data, error } = await supabase
    .from("posts")
    .insert({
      ...input,
      relationship: profile?.relationship ?? null,
      author_gender: profile?.myGender ?? null,
      partner_gender: profile?.partnerGender ?? null,
    })
    .select("id")
    .single()
  if (error) throw error
  return data.id as number
}

export async function updatePost(postId: number, input: PostInput) {
  const { error } = await supabase.from("posts").update(input).eq("id", postId)
  if (error) throw error
}

export async function deletePost(postId: number) {
  const { error } = await supabase.from("posts").delete().eq("id", postId)
  if (error) throw error
}

export async function createResolution(
  postId: number,
  input: ResolutionInput,
) {
  const { error } = await supabase
    .from("resolutions")
    .insert({ post_id: postId, ...input })
  if (error) throw error
}

export async function updateResolution(
  postId: number,
  input: ResolutionInput,
) {
  const { error } = await supabase
    .from("resolutions")
    .update(input)
    .eq("post_id", postId)
  if (error) throw error
}

export async function deleteResolution(postId: number) {
  const { error } = await supabase
    .from("resolutions")
    .delete()
    .eq("post_id", postId)
  if (error) throw error
}

export async function createComment(postId: number, body: string) {
  const profile = await fetchMyProfile()
  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    body,
    relationship: profile?.relationship ?? null,
  })
  if (error) throw error
}

export async function updateComment(commentId: number, body: string) {
  const { error } = await supabase
    .from("comments")
    .update({ body })
    .eq("id", commentId)
  if (error) throw error
}

export async function deleteComment(commentId: number) {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
  if (error) throw error
}
