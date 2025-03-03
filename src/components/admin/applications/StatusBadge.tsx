
import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "./types";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "new":
      return <Badge className="bg-blue-500">New</Badge>;
    case "reviewed":
      return <Badge className="bg-yellow-500">Reviewed</Badge>;
    case "shortlisted":
      return <Badge className="bg-green-500">Shortlisted</Badge>;
    case "rejected":
      return <Badge className="bg-red-500">Rejected</Badge>;
    default:
      return null;
  }
};

export default StatusBadge;
