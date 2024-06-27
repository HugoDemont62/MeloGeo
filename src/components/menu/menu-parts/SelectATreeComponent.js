import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useCallback, useEffect, useRef, useState} from "react";
import '../../../app/styles/slider.css';
import '../../../app/styles/map.css'
import {trees} from '@/trees/trees'
import {Button} from "@mui/material";
import Slide from "@mui/material/Slide";
import Progressbar from "@/components/progressbar/Progressbar";
import CircularWithValueLabel from "@/components/circularprogressbar/CircularProgress";


export default function SelectATreeComponent({mapRef, setSelectedTree, selectedTree}) {

    const [slideIndex, setSlideIndex] = useState(0);
    const sliderRef = useRef(null);
    const [currentTree, setCurrentTree] = useState(null);
    const [treeName, setTreeName] = useState(null)
    const [treeImpacts, setTreeImpacts] = useState(null)
    const [treeLimit, setTreeLimit] = useState(null)

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
            setTreeLimit(treeName.getAttribute('data-limit'))
            setTreeImpacts(JSON.parse(treeName.getAttribute('data-impacts')))
        }
    }, [currentTree]);

    useEffect(() => {
    },[treeImpacts])

    const handleSelectedTree = () => {
        let treeDatas = currentTree.querySelector('div');
        if (treeDatas && mapRef.current) {
            let icon = treeDatas.getAttribute('data-icon');
            let canvasContainer = mapRef.current.getCanvasContainer();
            canvasContainer.style.cursor = `url(/images/custom-cursors/${icon}.png), auto`;
            setSelectedTree(treeDatas);
        }
    }

    const handleClose = () => {
        setSelectedTree(null)
    }



    return (
        <div>
            <h2 style={{textAlign:'center', marginBottom:-50, fontSize:24}}>{treeName}</h2>
            <Slider ref={sliderRef} {...settings}>
                {trees.trees.map((tree, index) => (
                    <div key={index} data-name={tree.name} data-icon={tree.icon} data-limit={tree.limit} data-impacts={JSON.stringify(tree.impacts)}>
                        <Image src={`/images/${tree.img}.png`} alt={`icone ${tree.name}`} width={100} height={100} />
                    </div>
                ))}
            </Slider>
            <div style={{textAlign:'center', marginTop:-10, display:"flex", justifyContent:'center', alignItems:'center', gap:12}}>
                <button onClick={handleSelectedTree} className="custom-button">Sélectionner cet arbre</button>
                <Slide direction="left"  in={selectedTree} mountOnEnter unmountOnExit>
                <button onClick={handleClose}
                        style={{background: 'none', border: 'none'}}>
                    <img className="cross-button" style={{height: 30}} src="/images/map-menu/cross.png" alt='icone fermer'/>
                </button>
                </Slide>
            </div>

            <div style={{marginTop:20}}>
                <p><strong>Impacts environnementaux :</strong></p>
                {treeImpacts && treeImpacts.length > 0 ? (
                    treeImpacts.map((impact, index) => (
                        <div style={{marginTop:12}}>
                        <Progressbar key={index} title={impact.title} value={impact.value} />
                            </div>
                    ))
                ) : (
                    <p>Aucun impact environnemental disponible.</p>
                )}
            </div>
            <div style={{backgroundColor:"#EBF5FF", borderRadius:10, padding:10, marginTop:12}}>
                <p><strong>Limites</strong></p>
                <div style={{display:"flex", gap:12, alignItems:'center'}}>
                    <img height={32} src='/images/sad.png' alt="smiley sad"/>
                    <p style={{fontSize:14}}>{treeLimit}</p>
                </div>
            </div>
        </div>
    );
}

