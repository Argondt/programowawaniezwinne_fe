import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Chip,
    Grid,
    Avatar,
    IconButton,
    List,
    ListItem,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import LabelIcon from '@mui/icons-material/Label';

import {TaskDetailsProps} from "../Interface/TaskDetailsProps";
import {TaskStatus} from "../Interface/TaskStatus";

const getChipColor = (status: string | undefined) => {
    switch (status) {
        case TaskStatus.TO_DO:
            return 'warning';
        case TaskStatus.IN_PROGRESS:
            return 'info';
        case TaskStatus.DONE:
            return 'success';
        default:
            return 'default';
    }
};
const TaskDetailsDialog: React.FC<TaskDetailsProps> = ({task, open, onClose}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{fontWeight: 'bold', background: '#f5f5f5'}}>
                {task?.name}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{position: 'absolute', right: '8px', top: '8px'}}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">Status</Typography>
                        <Chip label={task?.status} color={getChipColor(task?.status)} size="small" sx={{ml: 1}}/>
                    </Grid>
                    <Divider variant="middle" sx={{width: '100%', my: 2}}/>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">Przypisane do</Typography>
                        <Typography sx={{display: 'flex', alignItems: 'center', mt: 0.5}}>
                            <PersonIcon fontSize="small" sx={{mr: 1}}/>
                            {task?.name}
                        </Typography>
                    </Grid>
                    <Divider variant="middle" sx={{width: '100%', my: 2}}/>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">Deadline</Typography>
                        <Typography sx={{display: 'flex', alignItems: 'center', mt: 0.5}}>
                            <EventIcon fontSize="small" sx={{mr: 1}}/>
                            {task?.endDate}
                        </Typography>
                    </Grid>
                    <Divider variant="middle" sx={{width: '100%', my: 2}}/>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">Etykiety</Typography>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px'}}>

                            <Chip icon={<LabelIcon/>} label={task?.name} size="small"/>

                        </div>
                    </Grid>
                    <Divider variant="middle" sx={{width: '100%', my: 2}}/>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">Opis</Typography>
                        <Typography paragraph sx={{mt: 0.5}}>{task?.description}</Typography>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default TaskDetailsDialog;