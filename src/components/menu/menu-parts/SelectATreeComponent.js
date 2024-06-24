import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useRef, useState } from "react";
import '../../../app/styles/slider.css';
import '../../../app/styles/map.css'
import {Button} from "@mui/material";

export default function SelectATreeComponent() {

    const [slideIndex, setSlideIndex] = useState(0);
    const sliderRef = useRef(null);
    const [currentTree, setCurrentTree] = useState(null);
    const [treeName, setTreeName] = useState(null)

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        afterChange: () => {}, // Ne pas besoin de mettre à jour
        beforeChange: (current, next) => setSlideIndex(current)
    };

    useEffect(() => {
        if (sliderRef.current) {
            const currentSlideElement = sliderRef.current.innerSlider.list.querySelector('.slick-current');
            if (currentSlideElement) {
                const childDivElement = currentSlideElement.querySelector('div');
                setCurrentTree(childDivElement)
            }
        }
    }, [slideIndex]);

    useEffect(() => {
        if(currentTree){
           let treeName = currentTree.querySelector('div');
            setTreeName(treeName.getAttribute('data-name'))
        }
    }, [currentTree]);

    return (
        <div>
            <h2 style={{textAlign:'center', marginBottom:-50}}>{treeName}</h2>
            <Slider ref={sliderRef} {...settings}>
                <div data-name='Boulot'>
                    <Image src='/images/tree.png' alt='icone arbre' width={100} height={100} />
                </div>
                <div data-name='Sapin'>
                    <Image src='/images/tree2.png' alt='icone arbre' width={100} height={100} />
                </div>
                <div data-name='Cerisier'>
                    <Image src='/images/tree3.png' alt='icone arbre' width={100} height={100} />
                </div>
            </Slider>
            <div style={{textAlign:'center', marginTop:-40}}>
                <button className="custom-button">Sélectionner cet arbre</button>
            </div>
            {/*<div style={{marginLeft:'5%', marginRight:'5%', marginTop:20}}>*/}
            {/*    <p style={{fontWeight:'bold'}}>Impacts environnementaux :</p>*/}
            {/*</div>*/}

        </div>
    );
}

