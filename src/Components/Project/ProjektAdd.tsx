import React, {FormEvent, useState} from "react";
import { TextField, Button, Drawer } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useMutation, useQueryClient } from 'react-query';
import { apiService } from "../../Services/ApiService";

const ProjektForm = () => {
  const [nazwa, setNazwa] = useState("");
  const [opis, setOpis] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation(
      () => {
          return apiService.createProject(nazwa, opis);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('projekty')
          setDrawerOpen(false);
        },
      }
  );

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // @ts-ignore
        mutation.mutate({ nazwa, opis }); // Przekazanie obiektu z właściwościami nazwa i opis
    };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
      <>
        <Button variant="outlined" onClick={toggleDrawer} startIcon={<AddIcon />}>
          Dodaj nowy projekt
        </Button>

        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
          <form onSubmit={handleSubmit} style={{ width: "300px", padding: "16px" }}>
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
            <Button type="submit" variant="outlined" disabled={mutation.isLoading}>
              Utwórz projekt
            </Button>
          </form>
        </Drawer>
      </>
  );
};

export default ProjektForm;
