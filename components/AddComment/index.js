import { useState } from "react";
import { useSession } from "next-auth/client";
import { Button, Container, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { ControlledInput } from "..";
import { createComment } from "../../utils";

const AddComment = ({ postId, setSnackbar }) => {
   const [session, loading] = useSession();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [errorMessage, setErrorMessage] = useState(false);
   const [success, setSuccess] = useState(false);

   const {
      control,
      handleSubmit,
      reset,
      setError,
      watch,
      formState: { errors },
   } = useForm({
      defaultValues: {
         approved: true,
         email: session?.user?.email,
         name: `${session?.user?.firstName} ${session?.user?.lastName}`,
         comment: "",
         _id: postId,
      },
   });

   const comment = watch("comment");
   const name = watch("name");

   const onSubmit = async (data) => {
      setIsSubmitting(true);

      try {
         createComment(data).then((res) => console.log(res));
         setIsSubmitting(false);
         setSuccess(true);
         setSnackbar({
            open: true,
            type: "success",
            message: "Comment successfully posted!",
         });
      } catch (error) {
         setErrorMessage(true);
         setSnackbar({
            open: true,
            type: "error",
            message: "An error has occurred. Please try again.",
         });
         setIsSubmitting(false);
      }
   };

   if (success) {
      return (
         <Stack spacing={1}>
            <Stack spacing={1}>
               <Typography variant="caption">
                  {`${name} (${dayjs().format("h:m A on MMM D, YYYY")})`}
               </Typography>
               <Typography>{comment}</Typography>
               <Divider />
            </Stack>
         </Stack>
      );
   }

   if (errorMessage) {
      return (
         <Typography bgcolor="error.main" color="white">
            Error posting comment. Please try again later.
         </Typography>
      );
   }

   return (
      <Stack
         direction="column"
         alignItems="center"
         justifyContent="center"
         spacing={1}
         sx={{ mt: 2 }}
      >
         <ControlledInput
            name="comment"
            label={session ? "Comment" : "Please login to comment"}
            disabled={!session}
            control={control}
            placeholder="Leave a comment"
            fullWidth
            multiline
            required
            rows={3}
            rules={{ minLength: 3, required: true }}
         />
         <Button
            disabled={!session}
            onClick={handleSubmit(onSubmit)}
            variant="outlined"
            sx={{ textAlign: "center", maxWidth: "200px" }}
         >
            Post Comment {isSubmitting ? <CircularProgress /> : null}
         </Button>
      </Stack>
   );
};

export default AddComment;
