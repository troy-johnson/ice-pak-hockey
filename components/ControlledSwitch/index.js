import { FormControl, FormGroup, FormControlLabel, Switch, useMediaQuery } from "@mui/material";
import { Controller } from "react-hook-form";

const ControlledSwitch = ({
   checked,
   control,
   disabled,
   label,
   name,
   options,
   required,
   rules,
   variant,
}) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   return (
      <Controller
         name={name}
         control={control}
         defaultValue={false}
         rules={rules}
         render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormGroup>
               <FormControlLabel
                  control={<Switch checked={checked} onChange={onChange} />}
                  label={label}
               />
            </FormGroup>
         )}
      />
   );
};

export default ControlledSwitch;
