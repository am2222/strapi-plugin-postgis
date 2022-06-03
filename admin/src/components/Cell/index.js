
import { Typography } from '@strapi/design-system/Typography';
import { Box } from '@strapi/design-system/Box';
import React from 'react';
import Point from './GeometryIcons/Point'
const GeoCell = (props) => {
    const background = true ? 'success100' : 'secondary100';
    const textColor = true ? 'success700' : 'secondary700';
    debugger
    return     <Box
    background={background}
    hasRadius
    paddingTop={1}
    paddingBottom={1}
    paddingLeft={2}
    paddingRight={2}
    style={{ width: 'fit-content' }}
  >
    <Typography fontWeight="bold" textColor={textColor}>
     <Point></Point> {props['row'][props['col']]['type']}
    </Typography>
  </Box>;
}
export default GeoCell;