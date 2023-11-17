// import React, { useEffect, useState } from "react";
// import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
// import { chatService } from "../Services/chatService";
// import { ProjektyResponse } from "./Interface/ProjektyResponse";
// import ProjektForm from "./Interface/ProjektAdd";
// type Props = {};

// const Dashboar = (props: Props) => {
//   const [projekty, setProjekty] = useState<ProjektyResponse | null>(null);
//   useEffect(() => {
//     chatService
//       .getAllProjects({ page: 0, size: 10 })
//       .then((data: ProjektyResponse) => {
//         setProjekty(data);
//       })
//       .catch((err: any) => {
//         console.error("Error fetching messages:", err);
//       });
//     console.log(projekty);
//   }, []);
//   return (
//     <>
//       <Container>
//         <Box
//           style={{
//             padding: "20px",
//             display: "flex",
//             justifyContent: "flex-end",
//             marginBottom: "20px",
//           }}
//         >
//           <ProjektForm />
//         </Box>

//         <Box style={{ padding: "20px" }}>
//           <Grid container spacing={3}>
//             {projekty &&
//               projekty.content.map((projekt) => (
//                 <Grid item xs={12} sm={6} md={4} key={projekt.projektId}>
//                   <Paper
//                     elevation={3}
//                     style={{ padding: "20px", textAlign: "center" }}
//                   >
//                     <Typography variant="h6" style={{ marginBottom: "10px" }}>
//                       {projekt.nazwa}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       style={{ marginBottom: "10px" }}
//                     >
//                       {projekt.opis}
//                     </Typography>
//                     <Typography
//                       variant="caption"
//                       style={{ display: "block", marginBottom: "5px" }}
//                     >
//                       {projekt.dataCzasUtworzeniaDateTime}
//                     </Typography>
//                     <Typography variant="caption">
//                       {projekt.dataCzasModyfikacji}
//                     </Typography>
//                   </Paper>
//                 </Grid>
//               ))}
//           </Grid>
//         </Box>
//       </Container>
//     </>
//   );
// };

// export default Dashboar;
import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { chatService } from "../Services/chatService";
import { ProjektyResponse } from "./Interface/ProjektyResponse";
import { useNavigate } from "react-router-dom";
import ProjektForm from "./ProjektAdd";

type Props = {};

const Dashboard = (props: Props) => {
  const [projekty, setProjekty] = useState<ProjektyResponse | null>(null);

  useEffect(() => {
    chatService
      .getAllProjects({ page: 0, size: 10 })
      .then((data: ProjektyResponse) => {
        setProjekty(data);
      })
      .catch((err: any) => {
        console.error("Error fetching projects:", err);
      });
  }, []);
  const navigate = useNavigate(); // Using the useNavigate hook

  // Function to handle click on a project tile
  const handleProjectClick = (projektId: number) => {
    navigate(`/projekty/${projektId}`); // Navigate to the project's detail page
  };

  return (
    <>
      <Container>
        <Box style={{ padding: "20px", display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <ProjektForm />
        </Box>

        <Box style={{ padding: "20px" }}>
          <Grid container spacing={3}>
            {projekty &&
              projekty.content.map((projekt) => (
                <Grid item xs={12} sm={6} md={4} key={projekt.projektId}>
                  <Paper
                    elevation={3}
                    style={{ padding: "20px", textAlign: "center", cursor: "pointer" }}
                    onClick={() => handleProjectClick(projekt.projektId)} // Navigate to project details on click
                  >
                    <Typography variant="h6" style={{ marginBottom: "10px" }}>
                      {projekt.nazwa}
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: "10px" }}>
                      {projekt.opis}
                    </Typography>
                    <Typography variant="caption" style={{ display: "block", marginBottom: "5px" }}>
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

export default Dashboard;
