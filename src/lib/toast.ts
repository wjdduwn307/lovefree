import { createContext, useContext } from "react"

// 화면 아래에 잠깐 뜨는 검은 안내 박스
export type ShowToast = (message: string) => void

export const ToastContext = createContext<ShowToast>(() => {})

export function useToast() {
  return useContext(ToastContext)
}
