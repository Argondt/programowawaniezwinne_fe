import { Navigate, useParams } from "react-router-dom";
import UserDetails from "./UserDetails";
import {useNavigate} from "react-router";

const UserDetailsView = () => {

    const { id } = useParams();
    if (!id) {
        return <Navigate to="../" />;
    }
    return <UserDetails id={id} />;
};

export default UserDetailsView;
