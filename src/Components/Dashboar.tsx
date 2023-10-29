import React, {useEffect, useState } from "react";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { chatService } from "../Services/chatService";
import { ProjektyResponse } from "./Interface/ProjektyResponse";

const Dashboar = () => {
  const [projekty, setProjekty] = useState<ProjektyResponse | null>(null);
  useEffect(() => {
    chatService
      .getAllProjects({ page: 0, size: 10 })
      .then((data: ProjektyResponse) => {
        setProjekty(data);
      })
      .catch((err: any) => {
        console.error("Error fetching messages:", err);
      });
    console.log(projekty);
  }, []);
  return (
    <>
      <Container>
        <Box
          style={{
            padding: "20px",
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => console.log("Dodaj nowy projekt")}
          >
            Dodaj nowy projekt
          </Button>
        </Box>

        <Box style={{ padding: "20px" }}>
          <Grid container spacing={3}>
            {projekty &&
              projekty.content.map((projekt) => (
                <Grid item xs={12} sm={6} md={4} key={projekt.projektId}>
                  <Paper
                    elevation={3}
                    style={{ padding: "20px", textAlign: "center" }}
                  >
                    <Typography variant="h6" style={{ marginBottom: "10px" }}>
                      {projekt.nazwa}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ marginBottom: "10px" }}
                    >
                      {projekt.opis}
                    </Typography>
                    <Typography
                      variant="caption"
                      style={{ display: "block", marginBottom: "5px" }}
                    >
                      {projekt.dataCzasUtworzeniaDateTime}
                    </Typography>
                    <Typography variant="caption">
                      {projekt.dataCzasModyfikacji}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Dashboar;
