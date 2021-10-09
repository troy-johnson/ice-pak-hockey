import {
   FormControl,
   InputLabel,
   MenuItem,
   NativeSelect,
   Select,
   useMediaQuery,
} from "@mui/material";
import { Controller } from "react-hook-form";

const ControlledSelect = ({ control, disabled, label, name, options, required, variant }) => {
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

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
               <InputLabel id={`${name}-label`}>{label}</InputLabel>
               {desktop ? (
                  <Select value={value} onChange={onChange} labelId={`${name}-label`} id={`${name}-select`} label={label}>
                     {options?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                           {option.label}
                        </MenuItem>
                     ))}
                  </Select>
               ) : (
                  <NativeSelect value={value} onChange={onChange} id={`${name}-select`} label={label} variant="outlined">
                     {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                           {option.label}
                        </option>
                     ))}
                  </NativeSelect>
               )}
            </FormControl>
         )}
      />
   );
};

export default ControlledSelect;
