import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const TextInput = ({
   control,
   disabled,
   label,
   name,
   required,
   type,
   variant,
}) => {
   return (
      <Controller
         name={name}
         control={control}
         defaultValue=""
         render={({ error, field }) => (
            <TextField
               {...field}
               helperText={error ? error.message : null}
               size="small"
               error={!!error}
               fullWidth
               label={label}
               variant={variant}
               required={required}
               disabled={disabled}
               type={type}
            />
         )}
      />
   );
};

export default TextInput;
