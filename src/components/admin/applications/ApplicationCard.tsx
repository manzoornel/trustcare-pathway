
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Application } from "./types";
import StatusBadge from "./StatusBadge";

interface ApplicationCardProps {
  application: Application;
  onView: (application: Application) => void;
}

const ApplicationCard = ({ application, onView }: ApplicationCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{application.name}</h3>
            <p className="text-gray-600">
              {application.position} ({application.category})
            </p>
            <div className="flex space-x-4 text-sm text-gray-500 mt-1">
              <span>{application.email}</span>
              <span>{application.phone}</span>
              <span>Applied: {application.dateApplied}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={application.status} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(application)}
            >
              <Eye className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
