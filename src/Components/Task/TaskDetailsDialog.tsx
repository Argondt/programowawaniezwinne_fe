import React, {useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Chip,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Divider,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {getChipColor} from "./utils/TaskUtils";
import {Task, TaskDetailsProps, TaskStatus} from './TaskInterface';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import LabelIcon from '@mui/icons-material/Label';
import PersonIcon from "@mui/icons-material/Person";
import {apiService} from "../../Services/ApiService";
import {useQueryClient} from "react-query";
import {TaskData} from "../Interface/TaskData";
import EditTaskDrawerForm from './EditTaskForm';

const TaskDetailsDialog: React.FC<TaskDetailsProps> = ({task, open, onClose}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isStatusMenuOpen = Boolean(statusAnchorEl);
    const queryClient = useQueryClient();
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
    };


    const handleDelete = () => {
        handleMenuClose();

        console.log('Delete Clicked');
    };


    const handleStatusMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setStatusAnchorEl(event.currentTarget);
    };

    const handleStatusMenuClose = () => {
        setStatusAnchorEl(null);
    };

    const handleStatusChange = async (newStatus: TaskStatus) => {
        if (task && task.id && task.status !== newStatus) {
            try {
                await apiService.updateTaskStatus(task.id, newStatus);
                queryClient.invalidateQueries(['projectTasks', task?.id]);
                onClose(); // Close the dialog after update
            } catch (error) {
                console.error('Failed to update status:', error);
                // Handle the error appropriately
            }
        }
        handleStatusMenuClose();
    };

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
                <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    sx={{position: 'absolute', right: '48px', top: '8px'}}
                >
                    <MoreVertIcon/>
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleStatusMenuOpen}>Change Status</MenuItem>


                </Menu>
                <Menu
                    id="status-menu"
                    anchorEl={statusAnchorEl}
                    keepMounted
                    open={isStatusMenuOpen}
                    onClose={handleStatusMenuClose}
                >
                    {Object.values(TaskStatus).map((status) => {
                        if (task?.status !== status) {
                            return (
                                <MenuItem key={status} onClick={() => handleStatusChange(status)}>
                                    {status}
                                </MenuItem>
                            );
                        }
                        return null;
                    })}
                </Menu>
                <Menu
                    id="status-menu"
                    anchorEl={statusAnchorEl}
                    keepMounted
                    open={isStatusMenuOpen}
                    onClose={handleStatusMenuClose}
                >
                    {Object.values(TaskStatus).map((status) => {
                        if (task?.status !== status) {
                            return (
                                <MenuItem key={status} onClick={() => handleStatusChange(status)}>
                                    {status}
                                </MenuItem>
                            );
                        }
                        return null;
                    })}
                </Menu>
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
