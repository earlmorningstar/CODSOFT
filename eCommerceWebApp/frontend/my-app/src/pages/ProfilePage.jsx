import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import {
  TextField,
  Button,
  Badge,
  styled,
  Stack,
  Avatar,
  // CircularProgress,
} from "@mui/material";

const images = [{ src: "/images/avatar1.jpg", alt: "Avatar 1" }];

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <section className="userPages-main-container">
      <p id="usermenuPages-title">Profile</p>

      <div className="usermenuPages-title-container">
        <NavLink to="/user-menu">
          <span>
            <IoChevronBackOutline size={25} />
          </span>
        </NavLink>
      </div>

      <div
        className="avatar-name-email-container"
        id="user-name-img-flex-holder"
      >
        <Stack direction="row" spacing={2}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              id="avatar-container-id"
              alt={images[0].alt}
              src={images[0].src}
            />
          </StyledBadge>
        </Stack>
        <span>
          <p>{user?.name || "Nothing to see here"} </p>
        </span>
      </div>

      <form className="profile-form-container">
        <TextField className="profile-text-field" fullWidth label="Name" />
        <TextField className="profile-text-field" fullWidth label="Email" />
        <main className="age-span">
          <Stack direction="row" spacing={2}>
            <Button disabled>Age: Age</Button>
          </Stack>
        </main>

        <TextField className="profile-text-field" fullWidth label="Address" />
        <TextField
          className="profile-text-field"
          fullWidth
          label="New Password"
          type="password"
        />
        <span>Leave this input blank to keep your current password</span>
        <TextField
          className="profile-text-field"
          fullWidth
          label="Confirm New Password"
          type="password"
        />
        <span>Leave this input blank to keep your current password</span>
        <button type="submit" className="proj-btn">
          {/* <CircularProgress className="btn-progress" size={24} /> */}
          Update Profile
        </button>
      </form>
    </section>
  );
};

export default ProfilePage;
