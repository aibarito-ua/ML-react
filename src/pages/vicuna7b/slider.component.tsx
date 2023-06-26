import { Refresh, VolumeUp } from "@mui/icons-material";
import { Box, Button, css, Divider, FormGroup, Grid, Input, Slider, TextField, Typography } from "@mui/material";
import { useState } from "react";

export function SliderCustom(props: {value: number, setValue: any, title: string, min: number, max:number, step: number}) {
    let {value, setValue, title, min, max, step} = props
    const handleSliderChangeTemperature = (event: Event, newValue: number | any) => {
        setValue(newValue);
      };
      const handleInputChangeTemperature = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value === '' ? 0 : Number(event.target.value));
      };
      const handleBlurTemperature = () => {
        if (value < min) {
            setValue(min);
        } else if (value > max) {
            setValue(max);
        }
      };
    return(
        <Box sx={{ width: 300 }}>
            <Typography id="input-slider" gutterBottom>
              {title}
            </Typography>
            <Grid container spacing={5} alignItems="center">
              <Grid item xs>
                <Slider
                  value={typeof value === 'number' ? value : 0}
                  onChange={handleSliderChangeTemperature}
                  aria-labelledby="input-slider"
                  max = {max}
                  min = {min}
                  step = {step}
                />
              </Grid>
              <Grid item xs>
                <Input
                  value={value}
                  size="small"
                  onChange={handleInputChangeTemperature}
                  onBlur={handleBlurTemperature}
                  inputProps={{
                    step: {step},
                    min: {min},
                    max: {max},
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                  }}
                />
              </Grid>
            </Grid>
          </Box>
    )
}