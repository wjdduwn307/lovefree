import { useMemo, useState, type FormEvent } from "react"
import { Header, Icon, MobileNav } from "./Home"

type Page = "home" | "write" | "profile"

type ScreenProps = {
  onNavigate: (page: Page) => void
}

const avatarThemes = ["coral", "blue", "violet", "mint"]

export default function Profile({ onNavigate }: ScreenProps) {
  const avatarTheme = useMemo(
    () => avatarThemes[Math.floor(Math.random() * avatarThemes.length)],
    [],
  )
  const [relationship, setRelationship] = useState("1년 이상 3년 미만")
  const [myGender, setMyGender] = useState("여성")
  const [partnerGender, setPartnerGender] = useState("남성")
  const [saved, setSaved] = useState(false)

  function handleSave(event: FormEvent) {
    event.preventDefault()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div className="candidate-page page-b-white member-page">
      <Header active="profile" onNavigate={onNavigate} />
      <main className="member-main profile-main">
        <section className="member-intro">
          <span className="member-intro-icon profile-icon">
            <Icon name="user" size={22} />
          </span>
          <div>
            <span className="section-kicker">MY RELATIONSHIP</span>
            <h1>프로필 설정</h1>
            <p>우리 관계에 맞는 이야기와 장소를 더 잘 추천해드릴게요.</p>
          </div>
        </section>

        <div className="profile-layout">
          <aside className="profile-summary">
            <div
              className={`default-profile-avatar avatar-theme-${avatarTheme}`}
            >
              <span>
                <Icon name="heart" size={31} />
              </span>
              <i />
              <b />
            </div>
            <span className="fixed-image-badge">연애해방 기본 이미지</span>
            <h2>hello123@gmail.com</h2>
            <p>
              게시글과 댓글에는 이메일 대신
              <br />
              <strong>‘익명의 해방이’</strong>로 표시돼요.
            </p>
            <div className="privacy-note">
              <Icon name="sparkle" size={17} />
              <span>
                프로필 정보는 추천을 위해서만 사용되며 다른 사용자에게 공개되지
                않아요.
              </span>
            </div>
          </aside>

          <form className="profile-form" onSubmit={handleSave}>
            <div className="profile-form-heading">
              <div>
                <span className="section-kicker">ABOUT US</span>
                <h2>우리 관계에 대해 알려주세요</h2>
              </div>
              <span>모든 항목은 선택 사항이에요</span>
            </div>

            <fieldset>
              <legend>
                <span>01</span> 연애 기간
              </legend>
              <div className="option-grid relationship-options">
                {[
                  "3개월 미만",
                  "3개월 이상 1년 미만",
                  "1년 이상 3년 미만",
                  "3년 이상",
                ].map((item) => (
                  <label
                    className={relationship === item ? "selected" : ""}
                    key={item}
                  >
                    <input
                      type="radio"
                      name="relationship"
                      value={item}
                      checked={relationship === item}
                      onChange={() => setRelationship(item)}
                    />
                    <span>{item}</span>
                    <i />
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="gender-fields">
              <fieldset>
                <legend>
                  <span>02</span> 나의 성별
                </legend>
                <div className="option-grid gender-options">
                  {["여성", "남성", "기타", "선택 안 함"].map((item) => (
                    <label
                      className={myGender === item ? "selected" : ""}
                      key={item}
                    >
                      <input
                        type="radio"
                        name="my-gender"
                        value={item}
                        checked={myGender === item}
                        onChange={() => setMyGender(item)}
                      />
                      <span>{item}</span>
                      <i />
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>
                  <span>03</span> 상대방 성별
                </legend>
                <div className="option-grid gender-options">
                  {["여성", "남성", "기타", "선택 안 함"].map((item) => (
                    <label
                      className={partnerGender === item ? "selected" : ""}
                      key={item}
                    >
                      <input
                        type="radio"
                        name="partner-gender"
                        value={item}
                        checked={partnerGender === item}
                        onChange={() => setPartnerGender(item)}
                      />
                      <span>{item}</span>
                      <i />
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="profile-actions">
              <button
                className="cancel-button"
                type="button"
                onClick={() => onNavigate("home")}
              >
                홈으로
              </button>
              <button className="primary-button" type="submit">
                변경사항 저장 <Icon name="arrow" size={18} />
              </button>
            </div>
          </form>
        </div>
      </main>
      {saved && (
        <div className="save-toast">
          <Icon name="sparkle" size={18} /> 프로필이 저장되었어요
        </div>
      )}
      <MobileNav active="profile" onNavigate={onNavigate} />
    </div>
  )
}
