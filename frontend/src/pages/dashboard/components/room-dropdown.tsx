import * as React from "react";
import { Menu, MenuItem, Divider, Button, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { SvgColor } from "@components/svg-color";
import { CreateRoomDialog } from "./create-room-dialog";
import type { IRoom } from "@interfaces/IRoom";
import { useSensorsStore } from "src/store/sensors";

interface IRoomDropdownProps {
  rooms: IRoom[];
}

export default function RoomDropdown({ rooms }: IRoomDropdownProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);

  const { setRoom, room } = useSensorsStore();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (room: IRoom) => {
    setRoom(room);

    handleClose();
  };

  const handleAddNew = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.preventDefault();
    setOpenCreateDialog(true);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        onClick={handleClick}
        sx={{
          minWidth: 150,
          justifyContent: "space-between",
          textTransform: "none",
          paddingRight: 1.5,
          backgroundColor: "white",
        }}
        endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      >
        {room?.name || "Select Room"}
      </Button>
      <Menu
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
            sx: { width: 150 },
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {rooms.map((room) => (
          <MenuItem key={room.id} onClick={() => handleSelect(room)}>
            {room.name}
          </MenuItem>
        ))}

        <Divider />

        <MenuItem
          disableTouchRipple
          sx={{
            "&:hover": {
              backgroundColor:
                "rgba(var(--palette-primary-mainChannel) / var(--palette-action-hoverOpacity))",
            },
          }}
          onClick={(e) => handleAddNew(e)}
        >
          <SvgColor
            sx={{
              color: "primary.main",
            }}
            src="/assets/add.svg"
          />
          <Typography color="primary" ml={1} variant="inherit">
            New room
          </Typography>
        </MenuItem>
        <CreateRoomDialog
          open={openCreateDialog}
          setOpen={setOpenCreateDialog}
        />
      </Menu>
    </>
  );
}
