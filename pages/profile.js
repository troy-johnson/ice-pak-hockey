import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
   Avatar,
   Button,
   Alert,
   Stack,
   FormGroup,
   FormControlLabel,
   Checkbox,
   Snackbar,
   Typography,
   useMediaQuery,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { mutate } from "swr";
import {
   ControlledCheckbox,
   ControlledInput,
   ControlledRadio,
   ControlledSelect,
   PageContainer,
} from "../components";
import { editPlayer, useGetPlayers } from "../utils";

const Profile = () => {
   const [snackbar, setSnackbar] = useState({ open: false, type: "success", message: "" });
   const { data: session, status } = useSession()
   const loading = status === "loading"
   const { players, playersError, playersLoading } = useGetPlayers();
   const desktop = useMediaQuery((theme) => theme.breakpoints.up("sm"));

   const player = players?.filter((player) => player?.email === session?.user?.email)[0];

   const [image, setImage] = useState(player?.image);

   const {
      control,
      handleSubmit,
      reset,
      register,
      watch,
      setValue,
      formState: { errors },
   } = useForm();

   const handleImageUpload = (e) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(e.target.files[0]);
      fileReader.onload = (e) => {
         setImage(e.target.result);
      };
   };

   // const gameDay = watch("gameDayNotifications");

   const onSubmit = (data) => {
      let imageToUpload = image ?? session?.user?.image;

      try {
         editPlayer({
            ...player,
            ...data,
            image: imageToUpload,
            auth0AccountId: session?.user?.sub,
            notifications: {
               gameDay: data.gameDayNotifications,
            },
         });
         setSnackbar({ open: true, type: "success", message: "Profile successfully updated!" });
         mutate(`/api/players`);
      } catch (error) {
         setSnackbar({
            open: true,
            type: "error",
            message: "An error has occurred. Please try again.",
         });
      }
   };

   useEffect(() => {
      if (player) {
         setValue("id", player?.id);
         setValue("firstName", player?.firstName);
         setValue("nickname", player?.nickname);
         setValue("lastName", player?.lastName);
         setValue("hometown", player?.hometown);
         setValue("preferredEmail", player?.preferredEmail ?? player?.email);
         setValue("preferredPhone", player?.preferredPhone ?? player?.phoneNumber);
         setValue("preferredJerseyNumber", player?.preferredJerseyNumber ?? player?.jerseyNumber);
         setValue("jerseySize", player?.jerseySize || "l");
         setValue("tShirtSize", player?.tShirtSize || "m");
         setValue("position", player?.position);
         setValue("handedness", player?.handedness || player?.shoots);
         setValue("gameDayNotifications", player?.notifications?.gameDay || false);
      }
   }, [player]);

   const sizeOptions = [
      { label: "X-Small", value: "xs" },
      { label: "Small", value: "s" },
      { label: "Medium", value: "m" },
      { label: "Large", value: "l" },
      { label: "X-Large", value: "xl" },
      { label: "XX-Large", value: "xxl" },
   ];

   const positionOptions = [
      { label: "Forward", value: "forward" },
      { label: "Defense", value: "defense" },
      { label: "Goalie", value: "goalie" },
   ];

   return (
      <PageContainer small pageTitle="Player Profile">
         <Stack direction="column" alignItems="center" spacing={2} ml={2} mb={2} mr={2}>
            {!session ? (
               <Typography>Please login to view your profile information.</Typography>
            ) : (
               <>
                  <Stack direction="row">
                     <Stack
                        display="flex"
                        alignItems="center"
                        direction="column"
                        spacing={1}
                        mb={3}
                     >
                        <Avatar
                           src={player?.image ?? session?.user?.image}
                           sx={{ height: 128, width: 128 }}
                        />
                        <Button variant="contained" component="label">
                           Upload Photo
                           <input
                              {...register("image", { onChange: (e) => handleImageUpload(e) })}
                              type="file"
                              hidden
                           />
                        </Button>
                     </Stack>
                  </Stack>
                  {desktop ? (
                     <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                        <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
                           <ControlledInput
                              control={control}
                              fullWidth
                              size="small"
                              name="firstName"
                              label="First Name"
                              rules={{ minLength: 3, required: true }}
                           />
                           <ControlledInput
                              control={control}
                              fullWidth
                              size="small"
                              name="nickname"
                              label="Nickname"
                           />
                           <ControlledInput
                              control={control}
                              fullWidth
                              size="small"
                              name="lastName"
                              label="Last Name"
                              rules={{ minLength: 3, required: true }}
                           />
                           <ControlledInput
                              control={control}
                              fullWidth
                              size="small"
                              name="preferredEmail"
                              error={errors?.preferredEmail}
                              helperText={
                                 errors?.preferredEmail
                                    ? "Email address must be formatted correctly"
                                    : ""
                              }
                              label="Preferred Email (Used for notifications)"
                              rules={{
                                 minLength: 3,
                                 required: true,
                                 pattern: /^([a-z0-9_\.-]+\@[\da-z-]+\.[a-z\.]{2,6})$/,
                              }}
                           />
                           <ControlledInput
                              control={control}
                              size="small"
                              name="preferredPhone"
                              error={errors?.preferredPhone}
                              helperText={
                                 errors?.preferredPhone ? "Phone number must contain 10 digits" : ""
                              }
                              label="Preferred Phone Number (Used for notifications)"
                              rules={{
                                 minLength: 3,
                                 required: true,
                                 pattern:
                                    /^\W?\d*?\W*?(?<area>\d{3})\W*?(?<group1>\d{3})\W*?(?<group2>\d{4})\W*?$/,
                              }}
                           />
                           <ControlledCheckbox
                              control={control}
                              name="gameDayNotifications"
                              label="Game Day Notifications (SMS)"
                              required
                           />
                        </Stack>
                        <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
                           <ControlledInput
                              control={control}
                              fullWidth
                              size="small"
                              name="hometown"
                              label="Hometown"
                           />
                           <ControlledInput
                              control={control}
                              size="small"
                              name="preferredJerseyNumber"
                              label="Preferred Jersey Number"
                              type="number"
                           />
                        <ControlledSelect
                           control={control}
                           size="small"
                           name="position"
                           label="Position"
                           options={positionOptions}
                        />
                           <ControlledSelect
                              control={control}
                              size="small"
                              name="jerseySize"
                              label="Jersey Size"
                              options={sizeOptions}
                           />
                           <ControlledSelect
                              control={control}
                              size="small"
                              name="tShirtSize"
                              label="T-Shirt Size"
                              options={sizeOptions}
                           />
                           <ControlledRadio
                              control={control}
                              name="handedness"
                              label="Handedness"
                              options={["Left", "Right"]}
                              row
                              required
                           />
                        </Stack>
                     </Stack>
                  ) : (
                     <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
                        <ControlledInput
                           control={control}
                           fullWidth
                           size="small"
                           name="firstName"
                           label="First Name"
                           rules={{ minLength: 3, required: true }}
                        />
                        <ControlledInput
                           control={control}
                           size="small"
                           name="nickname"
                           label="Nickname"
                        />
                        <ControlledInput
                           control={control}
                           size="small"
                           name="lastName"
                           label="Last Name"
                           rules={{ minLength: 3, required: true }}
                        />
                        <ControlledInput
                           control={control}
                           size="small"
                           name="homeTown"
                           label="Home Town"
                        />
                        <ControlledInput
                           control={control}
                           size="small"
                           name="preferredEmail"
                           error={errors?.preferredEmail}
                           helperText={
                              errors?.preferredEmail
                                 ? "Email address must be formatted correctly"
                                 : ""
                           }
                           label="Preferred Email (Used for notifications)"
                           rules={{
                              minLength: 3,
                              required: true,
                              pattern: /^([a-z0-9_\.-]+\@[\da-z-]+\.[a-z\.]{2,6})$/,
                           }}
                        />
                        <ControlledInput
                           control={control}
                           size="small"
                           name="preferredPhone"
                           error={errors?.preferredPhone}
                           helperText={
                              errors?.preferredPhone ? "Phone number must contain 10 digits" : ""
                           }
                           label="Preferred Phone Number (Used for notifications)"
                           rules={{
                              minLength: 3,
                              required: true,
                              pattern:
                                 /^\W?\d*?\W*?(?<area>\d{3})\W*?(?<group1>\d{3})\W*?(?<group2>\d{4})\W*?$/,
                           }}
                        />
                        <ControlledInput
                           control={control}
                           size="small"
                           name="preferredJerseyNumber"
                           label="Preferred Jersey Number"
                        />
                        <ControlledSelect
                           control={control}
                           size="small"
                           name="position"
                           label="Position"
                           options={positionOptions}
                        />
                        <ControlledSelect
                           control={control}
                           size="small"
                           name="jerseySize"
                           label="Jersey Size"
                           options={sizeOptions}
                        />
                        <ControlledSelect
                           control={control}
                           size="small"
                           name="tShirtSize"
                           label="T-Shirt Size"
                           options={sizeOptions}
                        />
                        <ControlledRadio
                           control={control}
                           name="handedness"
                           label="Handedness"
                           options={["Left", "Right"]}
                           row
                           required
                        />
                        <ControlledCheckbox
                           control={control}
                           name="gameDayNotifications"
                           label="Game Day Notifications (SMS)"
                           required
                        />
                     </Stack>
                  )}
                  <Button
                     type="submit"
                     variant="outlined"
                     sx={{ maxWidth: "350px" }}
                     onClick={handleSubmit(onSubmit)}
                  >
                     Save Profile
                  </Button>
               </>
            )}
         </Stack>
         <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ open: false, type: "success", message: "" })}
         >
            <Alert
               onClose={() => setSnackbar({ open: false, type: "success", message: "" })}
               variant="filled"
               severity={snackbar.type}
               sx={{ width: "100%" }}
            >
               {snackbar.message}
            </Alert>
         </Snackbar>
      </PageContainer>
   );
};

export default Profile;
