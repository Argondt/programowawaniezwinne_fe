import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import {chatService} from "../Services/chatService";

interface User {
  // Define user properties here
}

interface ApiResponse {
  // Define API response properties here
}

const ProjektForm: React.FC = () => {
  const [nazwa, setNazwa] = useState<string>("");
  const [opis, setOpis] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const token: string | null = localStorage.getItem("token");
  const userJson: string | null = localStorage.getItem("user");
  const user: User | null = userJson ? JSON.parse(userJson) : null;

  //   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     setLoading(true);

  //     try {
  //       const response = await axios.post<ApiResponse>(
  //         "http://localhost:8080/api/projekty",
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //           nazwa,
  //           opis,
  //         }
  //       );
  //       console.log(response.data);
  //       setDrawerOpen(false);
  //     } catch (error) {
  //       console.error("Błąd podczas tworzenia projektu", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const projectData = await chatService.createProject(nazwa, opis); // Call the new function
      console.log(projectData);
      setDrawerOpen(false);
    } catch (error) {
      console.error("Błąd podczas tworzenia projektu", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      {/* <IconButton color="primary" onClick={toggleDrawer}>
        <AddIcon />
      </IconButton> */}
      <Button variant="outlined" onClick={toggleDrawer} startIcon={<AddIcon />}>
        Dodaj nowy projekt
      </Button>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <form
          onSubmit={handleSubmit}
          style={{ width: "300px", padding: "16px" }}
        >
          <h1>Dodaj projekt</h1>

          <TextField
            label="Nazwa"
            variant="outlined"
            value={nazwa}
            onChange={(e) => setNazwa(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Opis"
            variant="outlined"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
          <Button variant="outlined" type="submit" disabled={loading}>
            Utwórz projekt
          </Button>
        </form>
      </Drawer>
    </>
  );
};

export default ProjektForm;

