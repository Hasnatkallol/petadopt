import React, { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FirebaseAuthContext } from "../Firebase/FirebaseAuthContext";

const Loading = () => {
  const { theme } = useContext(FirebaseAuthContext);

  const baseColor = theme === "dark" ? "#2d3748" : "#e2e8f0"; // dark: gray-800, light: gray-300
  const highlightColor = theme === "dark" ? "#4a5568" : "#f1f5f9"; // dark: gray-700, light: gray-100

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen px-6 py-12 ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Title Skeleton */}
      <Skeleton
        width={280}
        height={36}
        baseColor={baseColor}
        highlightColor={highlightColor}
        style={{ borderRadius: "8px" }}
      />

      {/* Subtitle Skeleton */}
      <Skeleton
        width={180}
        height={20}
        baseColor={baseColor}
        highlightColor={highlightColor}
        style={{ borderRadius: "6px", marginTop: 12 }}
      />

      {/* Large gap */}
      <div style={{ height: 40 }} />

      {/* Table Skeleton */}
      <div className="w-full max-w-5xl">
        {/* Table Header Skeleton */}
        <div className="flex mb-4 gap-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              height={24}
              baseColor={baseColor}
              highlightColor={highlightColor}
              style={{ flex: 1, borderRadius: "6px" }}
            />
          ))}
        </div>

        {/* Table Rows Skeleton */}
        <div className="flex flex-col gap-5">
          {[...Array(6)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex items-center gap-6"
              style={{ width: "100%" }}
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-4" style={{ flex: 1 }}>
                <Skeleton
                  circle
                  width={48}
                  height={48}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                />
                <Skeleton
                  width={100}
                  height={20}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                  style={{ borderRadius: "6px" }}
                />
              </div>

              {/* Owner */}
              <Skeleton
                width={120}
                height={16}
                baseColor={baseColor}
                highlightColor={highlightColor}
                style={{ flex: 1, borderRadius: "6px" }}
              />

              {/* Max Donation */}
              <Skeleton
                width={80}
                height={16}
                baseColor={baseColor}
                highlightColor={highlightColor}
                style={{ flex: 1, borderRadius: "6px" }}
                className="hidden sm:block"
              />

              {/* Progress */}
              <div style={{ flex: 1 }}>
                <Skeleton
                  width="100%"
                  height={16}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                  style={{ borderRadius: "6px" }}
                />
                <Skeleton
                  width={120}
                  height={12}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                  style={{ borderRadius: "6px", marginTop: 6 }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3" style={{ flex: 1 }}>
                {[...Array(3)].map((_, i) => (
                  <Skeleton
                    key={i}
                    width={50}
                    height={32}
                    baseColor={baseColor}
                    highlightColor={highlightColor}
                    style={{ borderRadius: "6px" }}
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
