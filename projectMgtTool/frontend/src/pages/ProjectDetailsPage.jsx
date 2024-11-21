import { useParams, useNavigate } from "react-router-dom";
import ProjectDetails from "./ProjectDetails";

const ProjectDetailsPage = () => {
  const navigate = useNavigate();

  const { projectId } = useParams();

  if (!projectId) {
    navigate("/dashboard");
  }

  return <ProjectDetails projectId={projectId} />;
};

export default ProjectDetailsPage;
