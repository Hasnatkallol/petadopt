import React, { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";

const Loading = () => {
  const { theme } = useContext(FirebaseAuthContext);

  const baseColor = theme === "dark" ? "#2d3748" : "#e2e8f0"; // gray-800 / gray-300
  const highlightColor = theme === "dark" ? "#4a5568" : "#f1f5f9"; // gray-700 / gray-100

  return (
    <div
      className={`flex flex-col items-center justify-start min-h-screen px-4 py-10 ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Title */}
      <Skeleton
        width={260}
        height={36}
        baseColor={baseColor}
        highlightColor={highlightColor}
        className="rounded-md"
      />

      {/* Subtitle */}
      <Skeleton
        width={160}
        height={20}
        baseColor={baseColor}
        highlightColor={highlightColor}
        className="mt-3 rounded-md"
      />

      {/* Spacer */}
      <div className="h-10" />

      {/* Content Table */}
      <div className="w-full max-w-6xl space-y-6">
        {/* Table Header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              height={24}
              baseColor={baseColor}
              highlightColor={highlightColor}
              className="rounded-md"
            />
          ))}
        </div>

        {/* Table Rows */}
        <div className="space-y-6">
          {[...Array(6)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-center"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <Skeleton
                  circle
                  width={40}
                  height={40}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                />
                <Skeleton
                  width={100}
                  height={16}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                  className="rounded-md"
                />
              </div>

              {/* Owner */}
              <Skeleton
                height={16}
                baseColor={baseColor}
                highlightColor={highlightColor}
                className="rounded-md w-3/4"
              />

              {/* Max Donation */}
              <Skeleton
                height={16}
                baseColor={baseColor}
                highlightColor={highlightColor}
                className="rounded-md w-2/3 hidden md:block"
              />

              {/* Progress Bar */}
              <div className="space-y-2 w-full">
                <Skeleton
                  height={16}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                  className="rounded-md w-full"
                />
                <Skeleton
                  height={12}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                  className="rounded-md w-1/3"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton
                    key={i}
                    width={48}
                    height={32}
                    baseColor={baseColor}
                    highlightColor={highlightColor}
                    className="rounded-md"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
