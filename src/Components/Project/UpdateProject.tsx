import React, {FormEvent, useEffect, useState} from "react";
import {
    TextField,
    Button,
    Drawer
} from "@mui/material";
import {useMutation, useQueryClient} from 'react-query';
import {apiService} from "../../Services/ApiService";
import {ProjektUpdate, ProjektUpdatedTO} from "../Interface/Projekt";


const UpdateProjectForm = ({projekt, open}: { projekt: ProjektUpdatedTO, open: boolean }) => {
    const [nazwa, setNazwa] = useState<string>(projekt.name);
    const [opis, setOpis] = useState<string>(projekt.description);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const queryClient = useQueryClient();
    useEffect(() => {
        if (open) {
            setDrawerOpen(true);
        }
        console.log("Projekt:", projekt); // Sprawdź, czy właściwe wartości są przekazywane

    }, [open, projekt]);
    const mutation = useMutation(
        () => {

            const projektUpdate: ProjektUpdate = {
                name: nazwa, // Uses the current state, originally set to projekt.name
                description: opis, // Uses the current state, originally set to projekt.description
            };

            return apiService.updateProject(projekt.projectId, projektUpdate);
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
        mutation.mutate();
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
                <form onSubmit={handleSubmit} style={{width: "300px", padding: "16px"}}>
                    <h1>Edytuj projekt</h1>
                    <TextField
                        label="Nazwa"
                        variant="outlined"
                        value={nazwa}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNazwa(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Opis"
                        variant="outlined"
                        value={opis}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOpis(e.target.value)}
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                    />

                    <Button type="submit" variant="outlined" disabled={mutation.isLoading}>
                        Zaktualizuj projekt
                    </Button>
                </form>
            </Drawer>
        </>
    );
};

export default UpdateProjectForm;
