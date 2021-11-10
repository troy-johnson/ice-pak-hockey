import {
   FormControl,
   FormLabel,
   FormGroup,
   Checkbox,
   FormHelperText,
   FormControlLabel,
} from "@mui/material";
import { Controller } from "react-hook-form";

const ControlledCheckbox = ({
   control,
   disabled,
   label,
   name,
   options,
   required,
   rules,
   row,
   variant,
}) => {
   return (
      <Controller
         name={name}
         control={control}
         defaultValue=""
         rules={rules}
         render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl
               required={required}
               error={error}
               component="fieldset"
               sx={{ m: 3 }}
               variant={variant}
            >
               {/* <FormLabel component="legend">{label}</FormLabel> */}
               <FormGroup>
                  <FormControlLabel
                     control={
                        <Checkbox checked={value} onChange={onChange} name={`${name}-checkbox`} />
                     }
                     label={label}
                  />
               </FormGroup>
               {/* <FormHelperText>You can display an error</FormHelperText> */}
            </FormControl>
         )}
      />
   );
};

export default ControlledCheckbox;
