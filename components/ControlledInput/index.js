import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const ControlledInput = ({
   control,
   disabled,
   fullWidth,
   multiline,
   label,
   name,
   placeholder,
   helperText,
   rows,
   required,
   rules,
   size,
   type,
   variant,
}) => {
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
               size={size}
               variant={variant}
               value={value}
               onChange={onChange}
               error={!!error}
               helperText={helperText}
            />
         )}
         rules={rules}
      />
   );
};

export default ControlledInput;
