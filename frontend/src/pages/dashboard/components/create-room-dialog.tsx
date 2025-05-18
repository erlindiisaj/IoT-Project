import { z } from "zod";
// import { useSnackbar } from "notistack";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

// import type { createRoomDTO } from "@interfaces/IRoom";
// import { handleRHFAxiosError } from "@utils/rhf-error-handler";
// import { useRoom } from "src/hooks/useRoom";

interface DialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const roomSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Room name must be at least 3 characters." })
    .max(50, { message: "Room name must be at most 50 characters." }),
});

type roomFormData = z.infer<typeof roomSchema>;

export function CreateRoomDialog({ open, setOpen }: DialogProps) {
  //   const { createRoom } = useRoom();
  //   const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    // handleSubmit,
    // setError,
    formState: { errors, isSubmitting },
    // reset,
  } = useForm<roomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
    },
  });

  //   const onSubmit = async (values: roomFormData) => {
  //     const payload: createRoomDTO = values;

  //     try {
  //       await createRoom.mutateAsync(payload);
  //       enqueueSnackbar("User created successfully!", { variant: "success" });
  //       setOpen(false);
  //       reset();
  //     } catch (error) {
  //       enqueueSnackbar("User creation failed!", { variant: "error" });
  //       handleRHFAxiosError(error, setError);
  //     }
  //   };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      slotProps={{
        paper: {
          sx: { width: 1 / 3, maxWidth: "90%", borderRadius: 2 },
        },
      }}
    >
      <DialogTitle>Add new room</DialogTitle>
      <DialogContent>
        <form onSubmit={() => console.log("submit")}>
          <Grid container spacing={2} marginY={1}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Room Name"
                fullWidth
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name")}
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={() => setOpen(false)}
              color="inherit"
            >
              Close
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              variant="contained"
              color="inherit"
            >
              Create Room
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
