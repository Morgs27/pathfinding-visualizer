import './MenuIcon.css'

type MenuIconProps = {
    menuActive: boolean
    setMenuActive: (data: boolean) => void
}

export function MenuIcon({menuActive, setMenuActive} : MenuIconProps){
    return(
        <>
        <div className="menuIcon" onClick={() => {setMenuActive(!menuActive)}}>
        <div className="hamburger" data-active = {menuActive} id="hamburger-6">
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
        </div>
        </>
    )
}