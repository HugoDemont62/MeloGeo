import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useCallback, useEffect, useRef, useState} from "react";
import '../../../app/styles/slider.css';
import '../../../app/styles/map.css'
import {trees} from '@/trees/trees'
import {Button} from "@mui/material";

export default function SelectATreeComponent({mapRef}) {

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

    const handleSelectedTree = () => {
        let treeDatas = currentTree.querySelector('div');
        if (treeDatas && mapRef.current) {
            let icon = treeDatas.getAttribute('data-icon');
            let canvasContainer = mapRef.current.getCanvasContainer();
            canvasContainer.style.cursor = `url(/images/custom-cursors/${icon}.png), auto`;
        }
    }


    return (
        <div>
            <h2 style={{textAlign:'center', marginBottom:-50}}>{treeName}</h2>
            <Slider ref={sliderRef} {...settings}>
                {trees.trees.map((tree, index) => (
                    <div key={index} data-name={tree.name} data-icon={tree.icon}>
                        <Image src={`/images/${tree.img}.png`} alt={`icone ${tree.name}`} width={100} height={100} />
                    </div>
                ))}
            </Slider>
            <div style={{textAlign:'center', marginTop:-40}}>
                <button onClick={handleSelectedTree} className="custom-button">Sélectionner cet arbre</button>
            </div>
            {/*<div style={{marginLeft:'5%', marginRight:'5%', marginTop:20}}>*/}
            {/*    <p style={{fontWeight:'bold'}}>Impacts environnementaux :</p>*/}
            {/*</div>*/}

        </div>
    );
}

