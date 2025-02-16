import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import backgroundImage from "../images/backnew.jpg";
import Logo from "../images/BMKLogo.jpg"; // Adjusted path
import Validation from "../LoginPage/Validation";

const defaultTheme = createTheme();

function LoginForm() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      fetch(`${process.env.REACT_APP_API_URL}authentication/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then(async (response) => {
          if (response.ok) {
            const role = await response.text();
            console.log("Login Success!!");
            console.log("Role from server response:", role);

            // Store both the role and username in localStorage
            const userInfo = { role, firstname: values.username };
            localStorage.setItem("userInfo", JSON.stringify(userInfo));

            // Navigate based on the role
            switch (role.toLowerCase()) {
              case "admin":
                navigate("/admindashboard");
                break;
              case "manager":
                navigate("/managerdashboard");
                break;
              case "stocksupervisor":
                navigate("/stocksupervisordashboard");
                break;
              case "sitesupervisor":
                navigate("/sitesupervisordashboard"); // Corrected this line to point to the right dashboard
                break;
              default:
                throw new Error("Unknown role");
            }
          } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
          }
        })
        .catch((error) => {
          console.error("Error during login:", error);
        });
    } else {
      console.error("Form validation errors:", validationErrors);
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} elevation={6}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={Logo}
              alt="Company Logo"
              sx={{ width: 100, height: 100, mb: 1 }}
            />
            <Typography component="h2" variant="h3">
              Tools Management System
            </Typography>
            <Typography component="h4" variant="h4">
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                id="outlined-username-input"
                label="Username"
                type="text"
                value={values.username}
                name="username"
                onChange={handleChange}
                autoComplete="current-username"
                fullWidth
                margin="normal"
                error={!!errors.username}
                helperText={errors.username}
              />
              <TextField
                id="outlined-password-input"
                label="Password"
                type="password"
                value={values.password}
                name="password"
                onChange={handleChange}
                autoComplete="current-password"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password}
              />
              <Button
                type="submit"
                className="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default LoginForm;
