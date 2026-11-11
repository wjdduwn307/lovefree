import { createContext, useContext } from "react"

// notice: 로그인 창에 보여줄 안내 문구, next: 로그인하면 이동할 주소
export type PromptLogin = (notice: string, next?: string) => void

export const LoginPromptContext = createContext<PromptLogin>(() => {})

export function usePromptLogin() {
  return useContext(LoginPromptContext)
}
