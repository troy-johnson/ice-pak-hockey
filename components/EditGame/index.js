import styled from "@emotion/styled";
import { useSWRConfig } from "swr";
import { useForm } from "react-hook-form";
import { Button, DialogActions, DialogContent, DialogTitle, Dialog } from "@mui/material";
import { SelectInput, TextInput } from "..";
import { editGame } from "../../utils";

const EditGame = ({ game, onClose, open }) => {
   const {
      control,
      formState: { errors },
      handleSubmit,
      reset,
   } = useForm();
   const { mutate } = useSWRConfig();


   const shootsOptions = [
      { label: "L", value: "L" },
      { label: "R", value: "R" },
   ];

   const posOptions = [
      { label: "F", value: "F" },
      { label: "D", value: "D" },
      { label: "G", value: "G" },
      { label: "LW", value: "LW" },
      { label: "C", value: "C" },
      { label: "RW", value: "RW" },
      { label: "LD", value: "LD" },
      { label: "RD", value: "RD" },
   ];

   const onSubmit = (data) => {
      console.log(data);

      try {
         editGame(data);
         mutate(`/api/games/${game?.gameId}`, [...players, data], true);
         handleClose();
      } catch (error) {
         consol.log("error", error);
      }
   };

   const handleClose = () => {
      reset({
         email: "",
         firstName: "",
         homeTown: "",
         image: "",
         jerseyNumber: "",
         lastName: "",
         nickname: "",
         phoneNumber: "",
         position: "F",
         shoots: "R",
      });
      onClose();
   };

   return (
      <Dialog onClose={handleClose} open={open}>
         <DialogTitle>Edit Game</DialogTitle>
         <DialogContent>
            <TextInput
               control={control}
               label="First Name"
               name="firstName"
               variant="outlined"
               required
            />
            <TextInput control={control} label="Nickname" name="nickname" variant="outlined" />
            <TextInput
               control={control}
               label="Last Name"
               name="lastName"
               variant="outlined"
               required
            />
            <TextInput
               control={control}
               label="Email Address"
               name="email"
               variant="outlined"
               required
            />
            <TextInput
               control={control}
               label="Phone Number"
               name="phoneNumber"
               variant="outlined"
               required
            />
            <TextInput control={control} label="Home Town" name="homeTown" variant="outlined" />
            <SelectInput
               control={control}
               name="position"
               label="Position"
               options={posOptions}
               variant="outlined"
            />
            <SelectInput
               control={control}
               name="shoots"
               label="Shoots"
               options={shootsOptions}
               variant="outlined"
            />
            <TextInput
               control={control}
               label="Jersey Number"
               name="jerseyNumber"
               variant="outlined"
               type="number"
               required
            />
         </DialogContent>
         <DialogActions>
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
               Submit
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
         </DialogActions>
      </Dialog>
   );
};

export default EditGame;
