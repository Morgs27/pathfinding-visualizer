import './Slider.css'
import SliderImport from 'react-input-slider';

type SliderProps = {
    value: number
    min: number
    max: number
    title: string
    setState: (data: any) => void
    step: number
}


export function Slider({value, min, max , title, setState, step} : SliderProps){
    const styles = {
        track: {
            width: 150,
            height: 3,
            background: 'orange'
        },
        active: {
            background: 'orange'
        },
        thumb: {
            width: 10,
            height: 10,
            background: 'orange'
        }
    }

    return(
        <>
        <div className="slider">
            <div className="sliderTitle">{title}</div>
                <SliderImport
                    styles = {styles}
                    axis = "x"
                    xstep= {step}
                    xmax = {max}
                    xmin = {min}
                    x={value}
                    onChange={({x}) => setState(x)}
                />
            <div className="value">
                {value}
            </div>
        </div>
        </>
    )
}