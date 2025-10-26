import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useNavigate } from '@tanstack/react-router';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.801-5.823-2.151m5.823 2.151A7.962 7.962 0 0112 21c-2.34 0-4.29-.801-5.823-2.151m5.823 2.151A7.962 7.962 0 0112 21c-2.34 0-4.29-.801-5.823-2.151M12 12V3"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              404 - Page Not Found
            </CardTitle>
            <CardDescription className="mt-2">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-600">
              <p>Please check the URL in the address bar and try again.</p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => navigate({ to: '/' })}
                variant="default"
                className="flex-1"
              >
                Go Home
              </Button>
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="flex-1"
              >
                Go Back
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                If you think this is an error, please contact support.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}