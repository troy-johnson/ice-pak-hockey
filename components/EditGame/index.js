import styled from "@emotion/styled";
import { useSWRConfig } from "swr";
import { useForm } from "react-hook-form";
import { Button, DialogActions, DialogContent, DialogTitle, Dialog } from "@mui/material";
import { editGame } from "../../utils";

const EditGame = ({ game, onClose, open }) => {
   const {
      control,
      formState: { errors },
      handleSubmit,
      reset,
   } = useForm();
   const { mutate } = useSWRConfig();

   const onSubmit = (data) => {
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
         <DialogContent></DialogContent>
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
