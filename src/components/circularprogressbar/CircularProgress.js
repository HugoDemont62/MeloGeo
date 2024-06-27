import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {useEffect} from "react";

function CircularProgressWithLabel(props) {
  const { current, total, size = 20 } = props;
  const percentage = (current / total) * 100;
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', width: size, height: size }}>
      <CircularProgress
        size={size}
        variant="determinate"
        value={100}
        sx={{ color: '#e5e7eb', position: 'absolute' }}
      />
      <CircularProgress
        size={size}
        variant="determinate"
        value={percentage}
        sx={{ color: '#5ccd61' }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" component="div" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          {`${current}/${total}`}
        </Typography>
        <Typography variant="caption" component="div" color="text.secondary" sx={{ fontSize: '10px' }}>
          Arbres plantés
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The current value of the progress indicator.
   */
  current: PropTypes.number.isRequired,
  /**
   * The total value of the progress indicator.
   */
  total: PropTypes.number.isRequired,
  /**
   * The size of the circular progress.
   * @default 40
   */
  size: PropTypes.number,
};

export default function CircularWithValueLabel({treesNeeded, markers, heatPointId, setIsCured}) {
    const [current, setCurrent] = React.useState(0);

    useEffect(() => {
        // Filtrer les markers par heatPointId
        const filteredMarkers = markers.filter(marker => marker.heatPointId === heatPointId);
        // Mettre à jour l'état current avec le nombre de markers filtrés
        setCurrent(filteredMarkers.length);
    }, [markers, heatPointId]);



    useEffect(() => {
        if(current === treesNeeded) {
            setIsCured(true)
        }

    }, [current]);

    useEffect(() => {
        setIsCured(false)
    }, [heatPointId]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgressWithLabel current={current} total={treesNeeded} size={130} />
        </Box>
    );
}
