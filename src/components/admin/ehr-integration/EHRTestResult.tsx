
import React from 'react';
import { AlertCircle, CheckCircle2 } from "lucide-react";

type EHRTestResultProps = {
  testResult: {
    success: boolean;
    message: string;
  } | null;
};

const EHRTestResult = ({ testResult }: EHRTestResultProps) => {
  if (!testResult) return null;

  return (
    <div className={`p-4 rounded-lg ${
      testResult.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
    }`}>
      <div className="flex items-start gap-3">
        {testResult.success ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
        )}
        <div>
          <p className={`font-medium ${
            testResult.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {testResult.success ? 'Connection Successful' : 'Connection Failed'}
          </p>
          <p className="text-sm mt-1">
            {testResult.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EHRTestResult;
