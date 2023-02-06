import React, { useEffect, useRef, useState } from 'react'
import './TutorialModal.css'

type ModalProps = {
    children : any,
    open? : boolean,
    state : boolean,
    onClose : any
}

type PageProps = {
    children: any,
    name? : string | null,
    skip? : boolean
}



export function TutorialModal({children, open, state, onClose} : ModalProps){

    const [currentPage, setCurrentPage] = useState(0)
    const [pagesTransform, setPagesTransform] = useState(0)

    const [pageHeight, setPageHeight] = useState(0)

    // Button States
    const [showNext, setShowNext] = useState(true)
    const [showPrev, setShowPrev] = useState(false)
    const [showSkip, setShowSkip] = useState(false)

    // Element References
    const modalPages = useRef(null)
    const header = useRef(null)

    // Convert to array if only 1 page provided
    if (!Array.isArray(children)){
        children = [children]
    }

    // Check All Children Are Pages
    if (!children.every((child: any) => {
        return child.type.name == 'Page'
    })){
        console.log(' All children of `Tutorial Modal` must be pages')
        return (<>
            All children of Tutorial Modal must be pages
        </>)
    }

    let pages = children.length;

    function closeModal(){
        setCurrentPage(0)
        onClose()
    }

    function checkButtons(){

        if(currentPage == 0){
            setShowPrev(false)
        }
        else if(currentPage == 1){
            setShowPrev(true)
        }

        if(pagesTransform != -100 && pages != 1){
            setShowNext(true)
        }

        if (children[currentPage].props.skip || currentPage == 0){
            setShowSkip(true)
        }
        else {
            setShowSkip(false)
        }
    }

    useEffect(() => {
        setPagesTransform( -1 * currentPage  * (100 / children.length))
        checkButtons()

        if(children[currentPage].props.name){
            header.current.innerHTML = children[currentPage].props.name;
            header.current.style.display = '';
        }
        else{
            header.current.style.display = 'none';
        }
    },[currentPage])

    useEffect(() => {
        setPageHeight((_) =>{
            let currentHeight = modalPages.current.children[currentPage].offsetHeight
            return currentHeight
        })
    },[currentPage])

    return (

        <>
        <div className="pageCover" style={{display: state?'block':'none'}}></div>

        <div className="tutorialModal" style={{display: state?'grid':'none'}}>
            
            {/* <img className='test' src="./map.jpg" alt="" /> */}

            <div className="modalHeader" ref = {header}></div>
            <div className="overflowContainer"  style={{height: pageHeight + 'px'}}>
                <div 
                ref = {modalPages} 
                className="modalPages" 
                style={{
                    width: (children.length * 100) + '%', 
                    transform: 'translateX('+ pagesTransform + '%)'
                    }}>
                    
                    {children.map((page: any) => {
                        return (
                            <div className="pageContainer" style = {{width: (100 / children.length) + '%'}}>
                                {page}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="modalFooter">
                <div className="modalButtons">

                    <div 
                        className = {showNext?'button':'button hide'} 
                        onClick={() => {
                            if(currentPage==(pages - 1)){
                                closeModal();
                            }
                            else{
                            setCurrentPage((currentPage) => currentPage + 1)
                            }
                        }}
                    >
                        {
                            currentPage==(pages - 1)?'Finish':'Next'
                        }
                    </div>

                    <div className = {showPrev?'button':'button hide'} 
                    onClick={() => setCurrentPage((currentPage) => currentPage - 1)}
                    >Previous</div>

                    <div className = {showSkip?'button skip':'button skip hide'} 
                    onClick={() => closeModal()}
                    >Skip Tutorial</div>

                </div>
            </div>
           
        </div>
        </>
    )
}

export function Page({children, name, skip}: PageProps){
    return (

        <div className="page" data-name = {name} data-skip = {skip}>
            {children}
        </div>
    )
}


