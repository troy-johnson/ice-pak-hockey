import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const ControlledInput = ({ control, disabled, fullWidth, multiline, label, name, placeholder, rows, required, rules, type, variant }) => {
   return (
      <Controller
         name={name}
         control={control}
         defaultValue=""
         render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
               disabled={disabled}
               required={required}
               type={type}
               label={label}
               fullWidth={fullWidth}
               multiline={multiline}
               placeholder={placeholder}
               rows={rows}
               variant={variant}
               value={value}
               onChange={onChange}
               error={!!error}
               helperText={error ? error.message : null}
            />
         )}
         rules={rules}
      />
   );
};

export default ControlledInput;
