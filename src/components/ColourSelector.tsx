
import { FaAngleLeft , FaAngleRight} from 'react-icons/fa'
import './ColourSelector.css'

type ColourSelectorProps = {
    colorScheme: number
    setColorTheme: (data: number) => void
    themes: string[][]
}

export function ColourSelector({colorScheme, setColorTheme, themes} : ColourSelectorProps){
    return (
    <>
        <div className="colourTheme">
            <div className="title">Colour Theme</div>
            
            <div className="colours">
              {colorScheme > 0 ? 
                <div className="arrow" onClick = {() => {
                  setColorTheme(colorScheme - 1)
                }}><FaAngleLeft/></div>
                : 
                <div className="arrow" style = {{opacity: 0.3}}><FaAngleLeft/></div>
                }
              {
                themes[colorScheme].map((theme) => {
                  return(
                    <div className='colour' style = {{backgroundColor: theme}}></div>
                  )
                })
              }
              {colorScheme < (themes.length - 1) ? 
              <div className="arrow" onClick = {() => {
                setColorTheme(colorScheme + 1)
              }}><FaAngleRight/></div>
              : 
              <div className="arrow" style = {{opacity: 0.3}}><FaAngleRight/></div>
              }
            </div>

          </div>
    </>
    )
}