import { useEffect, useState } from "react";
import { useSession } from "next-auth/client";
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
import { ControlledInput, ControlledRadio, ControlledSelect, PageContainer } from "../components";
import { editPlayer, useGetPlayers } from "../utils";

const Profile = () => {
   const [snackbar, setSnackbar] = useState({ open: false, type: "success", message: "" });
   const [session, loading] = useSession();
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

   // console.log("gameDayNotifications", gameDay);

   const onSubmit = (data) => {
      let imageToUpload = image ?? session?.user?.image;

      try {
         editPlayer({
            ...player,
            ...data,
            image: imageToUpload,
            auth0AccountId: session?.user?.sub,
         });
         setSnackbar({ open: true, type: "success", message: "Profile successfully updated!" });
         mutate(`/api/players`);
      } catch (error) {
         console.log("error", error);
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
         setValue("homeTown", player?.homeTown);
         setValue("preferredEmail", player?.preferredEmail ?? player?.email);
         setValue("preferredPhone", player?.preferredPhone ?? player?.phoneNumber);
         setValue("preferredJerseyNumber", player?.preferredJerseyNumber ?? player?.jerseyNumber);
         setValue("tShirtSize", player?.tShirtSize || "m");
         setValue("position", player?.position);
         setValue("handedness", player?.handedness || player?.shoots);
         // setValue("gameDayNotifications", player?.gameDayNotifications || false);
      }
   }, [player]);

   const shirtSizeOptions = [
      { label: "X-Small", value: "xs" },
      { label: "Small", value: "s" },
      { label: "Medium", value: "m" },
      { label: "Large", value: "l" },
      { label: "X-Large", value: "xl" },
      { label: "XX-Large", value: "xxl" },
   ];

   return (
      <PageContainer pageTitle="Player Profile">
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
                     {/* {desktop ? (
                        <Controller
                           control={control}
                           name="gameDayNotifications"
                           render={({
                              field: { onChange, onBlur, value, name, ref },
                              fieldState: { invalid, isTouched, isDirty, error },
                              formState,
                           }) => (
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       onBlur={onBlur}
                                       onChange={onChange}
                                       checked={value}
                                       inputRef={ref}
                                    />
                                 }
                                 label="Game Day Notifications (SMS)"
                              />
                           )}
                        />
                     ) : null} */}
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
                        </Stack>
                        <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
                           <ControlledInput
                              control={control}
                              fullWidth
                              size="small"
                              name="homeTown"
                              label="Home Town"
                           />
                           <ControlledInput
                              control={control}
                              size="small"
                              name="preferredJerseyNumber"
                              label="Preferred Jersey Number"
                              type="number"
                           />
                           <ControlledInput
                              control={control}
                              size="small"
                              name="position"
                              label="Position"
                           />
                           <ControlledSelect
                              control={control}
                              size="small"
                              name="tShirtSize"
                              label="T-Shirt Size"
                              options={shirtSizeOptions}
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
                        <ControlledInput
                           control={control}
                           size="small"
                           name="position"
                           label="Position"
                        />
                        <ControlledSelect
                           control={control}
                           size="small"
                           name="tShirtSize"
                           label="T-Shirt Size"
                           options={shirtSizeOptions}
                        />
                        <ControlledRadio
                           control={control}
                           name="handedness"
                           label="Handedness"
                           options={["Left", "Right"]}
                           row
                           required
                        />
                        {/* <FormGroup>
                           <FormControlLabel
                              control={<Checkbox {...register("gameDayNotifications")} />}
                              label="Game Day (SMS) Notifications"
                           />
                        </FormGroup> */}
                     </Stack>
                  )}
                  {/* <ControlledInput control={control} name="bio" label="Bio" rows={3} /> */}
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
