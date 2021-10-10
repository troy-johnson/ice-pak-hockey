import { FormControl, FormLabel, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { Controller } from "react-hook-form";

const ControlledRadio = ({ control, disabled, label, name, options, required, variant }) => {
   return (
      <Controller
         name={name}
         control={control}
         defaultValue=""
         render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormControl
               disabled={disabled}
               error={error}
               margin="none"
               required={required}
               size="small"
               fullWidth
               variant={variant}
            >
               <FormLabel>{label}</FormLabel>
               <RadioGroup
                  aria-label={name}
                  defaultValue=""
                  name={`${name}-radio-group`}
                  onChange={onChange}
                  alue={value}
               >
                  {options?.map((option) => (
                     <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option}
                     />
                  ))}
               </RadioGroup>
            </FormControl>
         )}
      />
   );
};

export default ControlledRadio;
