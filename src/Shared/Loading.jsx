import React, { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";

const Loading = () => {
  const { theme } = useContext(FirebaseAuthContext);

  // Theme-based colors for skeleton
  const baseColor = theme === "dark" ? "#374151" : "#e5e7eb"; // gray-700 for dark, gray-200 for light
  const highlightColor = theme === "dark" ? "#4b5563" : "#d1d5db"; // gray-600 for dark, gray-300 for light

  return (
    <div className="p-4 md:p-6 max-w-[95vw] mx-auto min-h-screen">
      {/* Title Skeleton */}
      <div className="mb-6 md:mb-8 text-center">
        <Skeleton
          width={250}
          height={36}
          baseColor={baseColor}
          highlightColor={highlightColor}
          className="mx-auto"
        />
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto shadow-lg rounded-lg border">
        {/* Table Header Skeleton */}
        <div className="flex p-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-1 px-2">
              <Skeleton
                height={24}
                baseColor={baseColor}
                highlightColor={highlightColor}
              />
            </div>
          ))}
        </div>

        {/* Table Rows Skeleton */}
        <div className="divide-y">
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex p-3 items-center">
              {/* Pet Image & Name */}
              <div className="flex-1 flex items-center gap-3">
                <Skeleton
                  circle
                  width={48}
                  height={48}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                />
                <Skeleton
                  width={80}
                  height={20}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                />
              </div>

              {/* Owner */}
              <div className="flex-1">
                <Skeleton
                  width={100}
                  height={16}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                />
                <Skeleton
                  width={120}
                  height={12}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                  className="mt-1"
                />
              </div>

              {/* Max Donation */}
              <div className="flex-1 hidden sm:block">
                <Skeleton
                  width={60}
                  height={16}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                />
              </div>

              {/* Progress */}
              <div className="flex-1">
                <Skeleton
                  width="100%"
                  height={16}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                />
                <Skeleton
                  width={120}
                  height={12}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                  className="mt-1"
                />
              </div>

              {/* Actions */}
              <div className="flex-1 flex gap-2">
                <Skeleton
                  width={50}
                  height={32}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                />
                <Skeleton
                  width={50}
                  height={32}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                />
                <Skeleton
                  width={50}
                  height={32}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
