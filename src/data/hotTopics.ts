import { supabase } from "../lib/supabase"

export type HotTopic = { rank: number; term: string; label: string }

export type AdminTerm = {
  term: string
  searchCount: number
  label: string | null
  pinnedRank: number | null
  hidden: boolean
  currentRank: number | null
}

type AdminTermRow = {
  term: string
  search_count: number
  label: string | null
  pinned_rank: number | null
  hidden: boolean
  current_rank: number | null
}

export async function fetchHotTopics() {
  const { data, error } = await supabase.rpc("hot_topics")
  if (error) throw error
  return data as HotTopic[]
}

export async function fetchIsAdmin() {
  const { data, error } = await supabase.rpc("is_admin")
  return !error && data === true
}

// 같은 브라우저에서는 같은 검색어를 하루 한 번만 집계
export function recordSearch(query: string) {
  const term = query.replace(/[*\s]+/g, " ").trim().toLowerCase()
  const key = `searched:${new Date().toISOString().slice(0, 10)}:${term}`
  try {
    if (localStorage.getItem(key)) return
  } catch {
    // 저장소를 쓸 수 없는 브라우저에서는 DB의 중복 방지에 맡김
  }

  void supabase.rpc("record_search", { search_term: term }).then(({ error }) => {
    if (error) return
    try {
      localStorage.setItem(key, "1")
    } catch {
      // 저장하지 못해도 검색에는 영향 없음
    }
  })
}

export async function fetchAdminTerms(): Promise<AdminTerm[]> {
  const { data, error } = await supabase.rpc("admin_search_terms")
  if (error) throw error
  return (data as AdminTermRow[]).map((row) => ({
    term: row.term,
    searchCount: row.search_count,
    label: row.label,
    pinnedRank: row.pinned_rank,
    hidden: row.hidden,
    currentRank: row.current_rank,
  }))
}

export async function restoreTerm(term: string) {
  const { error } = await supabase
    .from("search_term_overrides")
    .delete()
    .eq("term", term)
  if (error) throw error
}

export async function saveTerm(
  term: string,
  label: string,
  pinnedRank: number | null,
) {
  const trimmed = label.trim()
  if (!trimmed && pinnedRank === null) {
    await restoreTerm(term)
    return
  }

  const { error } = await supabase.from("search_term_overrides").upsert(
    { term, label: trimmed || null, pinned_rank: pinnedRank, hidden: false },
    { onConflict: "term" },
  )
  if (error) throw error
}

export async function hideTerm(term: string) {
  const { error } = await supabase.from("search_term_overrides").upsert(
    { term, label: null, pinned_rank: null, hidden: true },
    { onConflict: "term" },
  )
  if (error) throw error
}
