import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import JobApplicationForm from "../JobApplicationForm";
import { toast } from "@/hooks/use-toast";
import { Send, CheckCircle, ArrowRight } from "lucide-react";

export type JobPosition = {
  id: string;
  title: string;
};

export type JobCategory = {
  id: string;
  title: string;
  positions: JobPosition[];
  description: string;
  requirements: string;
};

interface JobListingSectionProps {
  jobCategories: JobCategory[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPosition: string;
  setSelectedPosition: (position: string) => void;
}

type ApplicationMode = "browse" | "apply";

const JobListingSection = ({
  jobCategories,
  selectedCategory,
  setSelectedCategory,
  selectedPosition,
  setSelectedPosition,
}: JobListingSectionProps) => {
  const [applicationMode, setApplicationMode] =
    useState<ApplicationMode>("browse");
  const [isMobile, setIsMobile] = useState(false);
  const selectedCategoryData = jobCategories.find(
    (cat) => cat.id === selectedCategory
  );

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // sm breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-navigate for mobile users
  const handleCategorySelect = (categoryId: string) => {
    const category = jobCategories.find((cat) => cat.id === categoryId);
    setSelectedCategory(categoryId);
    setSelectedPosition("");

    // Show success toast
    toast({
      title: "Category Selected!",
      description: `${category?.title} selected. ${
        isMobile
          ? "Scrolling to positions..."
          : "Please select a position below."
      }`,
    });

    // On mobile, automatically scroll to positions section
    if (isMobile) {
      setTimeout(() => {
        const positionsSection = document.getElementById("positions-section");
        if (positionsSection) {
          positionsSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  };

  const handlePositionSelect = (positionId: string) => {
    const position = selectedCategoryData?.positions.find(
      (p) => p.id === positionId
    );
    setSelectedPosition(positionId);

    // Show success toast
    toast({
      title: "Position Selected!",
      description: `${position?.title} selected. ${
        isMobile
          ? "Opening application form..."
          : 'Click "Apply Now" to continue.'
      }`,
    });

    // On mobile, automatically move to application form
    if (isMobile) {
      setTimeout(() => {
        setApplicationMode("apply");

        // Show application form opened toast
        setTimeout(() => {
          toast({
            title: "Application Form Opened!",
            description:
              "Please fill out the form below to submit your application.",
          });
        }, 200);

        setTimeout(() => {
          const applicationSection = document.getElementById(
            "application-section"
          );
          if (applicationSection) {
            applicationSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      }, 300);
    }
  };

  return (
    <div
      id="job-listings"
      className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 bg-white"
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-10 lg:mb-12">
        Current Opportunities
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
        {jobCategories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all ${
              selectedCategory === category.id
                ? "border-primary border-2 shadow-md"
                : "hover:shadow-md"
            }`}
            onClick={() => handleCategorySelect(category.id)}
          >
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                {category.description}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                <strong>Requirements:</strong> {category.requirements}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCategory && (
        <div
          id="positions-section"
          className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-8 sm:mb-10 lg:mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">
              Available Positions in {selectedCategoryData?.title}
            </h3>
            {selectedPosition && !isMobile && (
              <Button
                onClick={() => {
                  setApplicationMode("apply");
                  toast({
                    title: "📝 Application Form Opened",
                    description:
                      "Please fill out the application form below to submit your application.",
                  });
                }}
                className="flex items-center gap-2 w-full sm:w-auto"
                size="sm"
              >
                <Send className="h-4 w-4" />
                Apply Now
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {selectedCategoryData?.positions.map((position) => (
              <Card
                key={position.id}
                className={`transition-all ${
                  selectedPosition === position.id
                    ? "border-primary border-2 shadow-md bg-primary/5"
                    : "hover:shadow-md cursor-pointer"
                }`}
                onClick={() =>
                  selectedPosition !== position.id &&
                  handlePositionSelect(position.id)
                }
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h4 className="font-medium text-sm sm:text-base">
                      {position.title}
                    </h4>
                    {selectedPosition === position.id && (
                      <Badge variant="default" className="text-xs w-fit">
                        Selected
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedPosition && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white rounded-lg border">
              <h4 className="font-semibold text-base sm:text-lg mb-2">
                Selected Position:{" "}
                {
                  selectedCategoryData?.positions.find(
                    (p) => p.id === selectedPosition
                  )?.title
                }
              </h4>
              {isMobile ? (
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base"></p>
              ) : (
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  Ready to apply? Click "Apply Now" to submit your application
                  for this position.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {applicationMode === "apply" && selectedPosition && (
        <div
          id="application-section"
          className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-8 sm:mb-10 lg:mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">
              Job Application
            </h3>
            <Button
              variant="outline"
              onClick={() => setApplicationMode("browse")}
              size="sm"
              className="w-full sm:w-auto"
            >
              Back to Positions
            </Button>
          </div>

          <JobApplicationForm
            availablePositions={selectedCategoryData?.positions || []}
            selectedPosition={
              selectedCategoryData?.positions.find(
                (p) => p.id === selectedPosition
              )?.title || ""
            }
          />
        </div>
      )}
    </div>
  );
};

export default JobListingSection;
