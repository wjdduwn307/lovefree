import { useEffect, useState } from "react"
import { fetchIsAdmin } from "../data/hotTopics"
import { useSession } from "./useSession"

// 화면 표시용 확인. 실제 권한은 DB에서 다시 검사함
export function useIsAdmin() {
  const userId = useSession()?.user.id
  const [adminId, setAdminId] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    let active = true
    void fetchIsAdmin().then((isAdmin) => {
      if (active) setAdminId(isAdmin ? userId : null)
    })
    return () => {
      active = false
    }
  }, [userId])

  return Boolean(userId) && adminId === userId
}
